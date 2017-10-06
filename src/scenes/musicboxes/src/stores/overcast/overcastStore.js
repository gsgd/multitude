const alt = require('../alt')
const actions = require('./overcastActions')
const { musicboxStore, musicboxActions } = require('../musicbox')
// const deezerHTTP = require('./deezerHTTP')
const { musicboxDispatch } = require('../../Dispatch')
const constants = require('shared/constants')

// console.log(actions);

class OvercastStore {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.cachedAuths = new Map()
    this.profileSync = null
    this.unreadSync = null

    this.openProfileRequests = new Map()
    this.openUnreadCountRequests = new Map()

    /* **************************************/
    // Request checkers
    /* **************************************/

    this.hasOpenProfileRequest = (musicboxId) => {
      return (this.openProfileRequests.get(musicboxId) || 0) >= 1
    }

    this.hasOpenUnreadCountRequest = (musicboxId) => {
      return (this.openUnreadCountRequests.get(musicboxId) || 0) >= 1
    }

    /* **************************************/
    // Listeners
    /* **************************************/

    this.bindListeners({
      handleStartPollSync: actions.START_POLLING_UPDATES,
      handleStopPollSync: actions.STOP_POLLING_UPDATES,

      handleSyncMusicboxProfile: actions.SYNC_MUSICBOX_PROFILE,
      handleSyncMusicboxProfileSuccess: actions.SYNC_MUSICBOX_PROFILE_SUCCESS,
      handleSyncMusicboxProfileFailure: actions.SYNC_MUSICBOX_PROFILE_FAILURE,

      // handleSyncMusicboxUnreadCount: actions.SYNC_MUSICBOX_UNREAD_COUNT,
      handleSyncMusicboxUnreadCountSuccess: actions.SYNC_MUSICBOX_UNREAD_COUNT,
      handleSuggestSyncMusicboxUnreadCount: actions.SUGGEST_SYNC_MUSICBOX_UNREAD_COUNT,
      handleSyncMusicboxUnreadCountSuccess: actions.SYNC_MUSICBOX_UNREAD_COUNT_SUCCESS,
      handleSyncMusicboxUnreadCountFailure: actions.SYNC_MUSICBOX_UNREAD_COUNT_FAILURE
    })
  }

  /* **************************************************************************/
  // Utils
  /* **************************************************************************/

  /**
  * Sets up the auth for a musicbox
  * @param musicboxId: the id of the musicbox to setup for
  * @return { auth } the musicbox auth and the musicbox id
  */
  getAPIAuth (musicboxId) {
    const musicbox = musicboxStore.getState().getMusicbox(musicboxId)
    return { auth: undefined }
    if (!musicbox) {
      return { auth: undefined }
    } else {
      return { auth: deezerHTTP.generateAuth(musicbox.deezer.accessToken, musicbox.deezer.refreshToken, musicbox.deezer.authExpiryTime) }
    }
  }

  /* **************************************************************************/
  // Error Detection
  /* **************************************************************************/

  /**
  * Checks if an error is an invalid grant error
  * @param err: the error that was thrown
  * @return true if this error is invalid grant
  */
  isInvalidGrantError (err) {
    if (err && typeof (err.message) === 'string') {
      if (err.message.indexOf('invalid_grant') !== -1 || err.message.indexOf('Invalid Credentials') !== -1) {
        return true
      }
    }
    return false
  }

  /* **************************************************************************/
  // Handlers: Pollers
  /* **************************************************************************/

  /**
  * Saves the intervals so they can be cancelled later
  * @profiles: the profiles interval
  * @param unread: the unread interval
  * @param notification: the notification interval
  */
  handleStartPollSync ({profiles, unread, notification}) {
    clearInterval(this.profileSync)
    this.profileSync = setInterval(() => {
      actions.syncAllMusicboxProfiles()
    }, constants.GMAIL_PROFILE_SYNC_MS)

    clearInterval(this.unreadSync)
    this.unreadSync = (() => {
      let partialCount = 0
      return setInterval(() => {
        if (partialCount >= 5) {
          actions.syncAllMusicboxUnreadCounts(true)
          partialCount = 0
        } else {
          actions.syncAllMusicboxUnreadCounts(false)
          partialCount++
        }
      }, constants.GMAIL_UNREAD_SYNC_MS)
    })()

    actions.syncAllMusicboxProfiles.defer()
    actions.syncAllMusicboxUnreadCounts.defer(true)
  }

  /**
  * Stops any running intervals
  */
  handleStopPollSync () {
    clearInterval(this.profileSync)
    this.profileSync = null
    clearInterval(this.unreadSync)
    this.unreadSync = null
  }

  /* **************************************************************************/
  // Handlers: Profiles
  /* **************************************************************************/

  handleSyncMusicboxProfile ({ musicboxId }) {
    return
    this.openProfileRequests.set((this.openProfileRequests.get(musicboxId) || 0) + 1)

    const { auth } = this.getAPIAuth(musicboxId)
    deezerHTTP.fetchMusicboxProfile(auth)
      .then((response) => {
        musicboxActions.setBasicProfileInfo(
          musicboxId,
          (response.response.emails.find((a) => a.type === 'account') || {}).value,
          response.response.displayName,
          response.response.image.url
        )
      })
      .then(
        (response) => actions.syncMusicboxProfileSuccess(musicboxId),
        (err) => actions.syncMusicboxProfileFailure(musicboxId, err)
      )
  }

  handleSyncMusicboxProfileSuccess ({ musicboxId }) {
    this.openProfileRequests.set(this.openProfileRequests.get(musicboxId) - 1)
    musicboxActions.setDeezerHasGrantError.defer(musicboxId, false)
  }

  handleSyncMusicboxProfileFailure ({ musicboxId, err }) {
    if (this.isInvalidGrantError(err.err)) {
      musicboxActions.setDeezerHasGrantError.defer(musicboxId, true)
    } else {
      console.warn('[SYNC ERR] Musicbox Profile', err)
    }
    this.openProfileRequests.set(this.openProfileRequests.get(musicboxId) - 1)
  }

  /* **************************************************************************/
  // Handlers: Unread Counts
  /* **************************************************************************/

  handleSyncMusicboxUnreadCount ({ musicboxId, forceFullSync }) {
    return
    this.openUnreadCountRequests.set((this.openUnreadCountRequests.get(musicboxId) || 0) + 1)
    const { auth } = this.getAPIAuth(musicboxId)

    const musicbox = musicboxStore.getState().getMusicbox(musicboxId)
    const label = musicbox.deezer.unreadLabel

    Promise.resolve()
      .then(() => {
        // Step 1. Counts: Fetch the musicbox label
        return Promise.resolve()
          .then(() => {
            // Step 1.1: call out to deezer
            return deezerHTTP.fetchMusicboxLabel(auth, label)
          })
          .then(({ response }) => {
            const musicbox = musicboxStore.getState().getMusicbox(musicboxId)

            // Step 1.2. see if we are configured to grab the unread count from the ui
            if (musicbox.deezer.takeLabelCountFromUI) {
              return Promise.resolve()
                .then(() => musicboxDispatch.fetchGmailUnreadCountWithRetry(musicboxId, forceFullSync ? 30 : 5))
                .then(({count, available}) => {
                  if (available) {
                    return Object.assign(response, {
                      unreadCountFromUI: true,
                      threadsUnread: count
                    })
                  } else {
                    const passResponse = Object.assign(response, {
                      unreadCountFromUI: true
                    })
                    delete passResponse.threadsUnread
                    return passResponse
                  }
                })
            } else {
              return response
            }
          })
          .then((response) => {
            // Step 1.3: Update the models. Decide if we changed
            const musicbox = musicboxStore.getState().getMusicbox(musicboxId)
            musicboxActions.setDeezerLabelInfo(musicboxId, response)
            return Promise.resolve({
              changed: forceFullSync || musicbox.deezer.messagesTotal !== response.messagesTotal
            })
          })
      })
      .then(({changed}) => {
        // Step 2. Message info: if we did change run a query to get the unread message count
        if (!changed) { return Promise.resolve() }

        return Promise.resolve()
          .then(() => {
            // Step 2.1: Fetch the unread email ids
            const musicbox = musicboxStore.getState().getMusicbox(musicboxId)
            const unreadQuery = musicbox.deezer.unreadQuery
            return deezerHTTP.fetchThreadIds(auth, unreadQuery)
          })
          .then(({ response }) => {
            // Step 2.3: find the changed threads
            const threads = response.threads || []

            if (threads.length === 0) { return { threads: threads, changedThreads: [], resultSizeEstimate: response.resultSizeEstimate } }

            const musicbox = musicboxStore.getState().getMusicbox(musicboxId)
            const currentThreadsIndex = musicbox.deezer.latestUnreadThreads.reduce((acc, thread) => {
              acc[thread.id] = thread
              return acc
            }, {})
            const changedThreads = threads.reduce((acc, thread) => {
              if (!currentThreadsIndex[thread.id]) {
                acc.push(thread)
              } else if (currentThreadsIndex[thread.id].historyId !== thread.historyId) {
                acc.push(thread)
              } else if ((currentThreadsIndex[thread.id].messages || []).length === 0) {
                acc.push(thread)
              }
              return acc
            }, [])

            return { threads: threads, changedThreads: changedThreads, resultSizeEstimate: response.resultSizeEstimate }
          })
          .then(({ threads, changedThreads, resultSizeEstimate }) => {
            // Step 2.4: Grab the full threads
            if (changedThreads.length === 0) { return { threads: threads, changedThreads: [], resultSizeEstimate: resultSizeEstimate } }

            return Promise.all(threads.map((thread) => {
              return Promise.resolve()
                .then(() => deezerHTTP.fetchThread(auth, thread.id))
                .then(({response}) => response)
            }))
            .then((changedThreads) => {
              return { threads: threads, changedThreads: changedThreads, resultSizeEstimate: resultSizeEstimate }
            })
          })
          .then(({threads, changedThreads, resultSizeEstimate}) => {
            // Step 2.5: Store the grabbed threads
            if (changedThreads.length !== 0) {
              const changedIndexed = changedThreads.reduce((acc, thread) => {
                thread.messages = (thread.messages || []).map((message) => {
                  return {
                    id: message.id,
                    threadId: message.threadId,
                    historyId: message.historyId,
                    internalDate: message.internalDate,
                    snippet: message.snippet,
                    labelIds: message.labelIds,
                    payload: {
                      headers: message.payload.headers.filter((header) => {
                        const name = header.name.toLowerCase()
                        return name === 'subject' || name === 'from' || name === 'to'
                      })
                    }
                  }
                })
                acc[thread.id] = thread
                return acc
              }, {})

              musicboxActions.setDeezerLatestUnreadThreads(musicboxId, threads, resultSizeEstimate, changedIndexed)
              return { threads: threads, changedIndex: changedIndexed }
            } else {
              musicboxActions.setDeezerLatestUnreadThreads(musicboxId, threads, resultSizeEstimate, {})
              return { threads: threads, changedIndex: {} }
            }
          })
      })
      .then(
        () => actions.syncMusicboxUnreadCountSuccess(musicboxId),
        (err) => actions.syncMusicboxUnreadCountFailure(musicboxId, err)
      )
  }

  handleSuggestSyncMusicboxUnreadCount ({ musicboxId }) {
    if (!this.hasOpenUnreadCountRequest(musicboxId)) {
      actions.syncMusicboxUnreadCount.defer(musicboxId)
    }
  }

  handleSyncMusicboxUnreadCountSuccess ({ musicboxId }) {
    return
    this.openUnreadCountRequests.set(this.openUnreadCountRequests.get(musicboxId) - 1)
    musicboxActions.setDeezerHasGrantError.defer(musicboxId, false)
  }

  handleSyncMusicboxUnreadCountFailure ({ musicboxId, err }) {
    this.openUnreadCountRequests.set(this.openUnreadCountRequests.get(musicboxId) - 1)
    if (this.isInvalidGrantError(err.err)) {
      musicboxActions.setDeezerHasGrantError.defer(musicboxId, true)
    } else {
      console.warn('[SYNC ERR] Musicbox Unread Count', err)
    }
  }
}

module.exports = alt.createStore(OvercastStore, 'OvercastStore')
