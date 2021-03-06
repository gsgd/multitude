const alt = require('../alt')
// const { ipcRenderer, remote } = require('electron')
const {ipcRenderer, remote} = require('electron')
const { session } = remote
const musicboxDispatch = require('../../Dispatch/musicboxDispatch')
const Musicbox = require('shared/Models/Musicbox/Musicbox')

class MusicboxActions {

  /* **************************************************************************/
  // Loading
  /* **************************************************************************/

  /**
  * Indicates the store to drop all data and load from disk
  */
  load () { return {} }

  /* **************************************************************************/
  // Create & Remove
  /* **************************************************************************/

  /**
  * Creates a new musicbox
  * @param id: the id of the musicbox
  * @param data: the data to create it with
  */
  create (id, data) { return { id: id, data: data } }

  /**
  * Removes a musicbox
  * @param id: the id of the musicbox to update
  */
  remove (id) { return { id: id } }

  /* **************************************************************************/
  // Updating
  /* **************************************************************************/

  /**
  * Updates a musicbox
  * @param id: the id of the musicbox
  * @param updatesOrPath: an object indicating the updates to apply or the path string to apply to
  * @param valueOrUndef: if path is set, the value to set
  */
  update (id, updatesOrPath, valueOrUndef) {
    if (typeof (updatesOrPath) === 'string') {
      return { id: id, updates: undefined, path: updatesOrPath, value: valueOrUndef }
    } else {
      return { id: id, updates: updatesOrPath, path: undefined, value: undefined }
    }
  }

  /**
  * Sets a custom avatar
  * @param id: the id of the musicbox
  * @param b64Image: the image to set
  */
  setCustomAvatar (id, b64Image) { return { id: id, b64Image: b64Image } }

  /**
  * @param id: the id of the musicbox
  * @param show: sets whether to show the unread badge or not
  */
  setShowUnreadBage (id, show) {
    return this.update(id, { showUnreadBadge: show })
  }

  /**
  * @param id: the id of the musicbox
  * @param show: sets whether to show notifications or not
  */
  setShowNotifications (id, show) {
    return this.update(id, { showNotifications: show })
  }

  /**
  * @param id: the id of the musicbox
  * @param doesCount: sets whther the unread counts do count towards the app unread badge
  */
  setUnreadCountsTowardsAppUnread (id, doesCount) {
    return this.update(id, { unreadCountsTowardsAppUnread: doesCount })
  }

  /**
  * @param id: the id of the musicbox
  * @param col: the color as either a hex string or object that contains hex key
  */
  setColor (id, col) {
    if (typeof (col) === 'object') {
      col = col.hex
    }
    return this.update(id, { color: col })
  }

  /**
  * Sets the basic profile info
  * @param id: the musicbox id
  * @param email: the users email address
  * @param name: the accounts display name
  * @param avatar: the accounts avatar
  */
  setBasicProfileInfo (id, email, name, avatar) {
    return this.update(id, {
      avatar: avatar,
      email: email,
      name: name
    })
  }

  /**
  * Sets the custom css
  * @param id: the musicbox id
  * @param css: the css code
  */
  setCustomCSS (id, css) {
    return this.update(id, { customCSS: css })
  }

  /**
  * Sets the custom js
  * @param id: the musicbox id
  * @param js: the js code
  */
  setCustomJS (id, js) {
    return this.update(id, { customJS: js })
  }

  /**
  * Artificially persist the cookies for this musicbox
  * @param id: the musicbox id
  * @param persist: whether to persist the cookies
  */
  artificiallyPersistCookies (id, persist) {
    return this.update(id, { artificiallyPersistCookies: persist })
  }

  /* **************************************************************************/
  // Updating: Services
  /* **************************************************************************/

  /**
  * Adds a service
  * @param id: the id of the musicbox
  * @Param service: the service type
  */
  addService (id, service) {
    return { id: id, service: service }
  }

  /**
  * Removes a service
  * @param id: the id of the musicbox
  * @Param service: the service type
  */
  removeService (id, service) {
    return { id: id, service: service }
  }

  /**
  * Moves a service up
  * @param id: the id of the musicbox
  * @Param service: the service type
  */
  moveServiceUp (id, service) {
    return { id: id, service: service }
  }

  /**
  * Moves a service down
  * @param id: the id of the musicbox
  * @Param service: the service type
  */
  moveServiceDown (id, service) {
    return { id: id, service: service }
  }

  /**
  * Toggles the service sleepable state
  * @param id: the id of the musicbox
  * @param service: service type
  * @param sleepable: true if the service is sleepable, false otherwise
  */
  toggleServiceSleepable (id, service, sleepable) {
    return { id: id, service: service, sleepable: sleepable }
  }

  /**
  * Sets the services to be compact
  * @param id: the id of the musicbox
  * @param compact: true to make them ompact
  */
  setCompactServicesUI (id, compact) {
    return this.update(id, { compactServicesUI: compact })
  }

  /* **************************************************************************/
  // Updating: Zoom
  /* **************************************************************************/

  /**
  * Increases the zoom of the active musicbox
  */
  increaseActiveZoom () { return {} }

  /**
  * Decreases the zoom of the active musicbox
  */
  decreaseActiveZoom () { return {} }

  /**
  * Resets the zoom of the the active musicbox
  */
  resetActiveZoom () { return {} }

  /* **************************************************************************/
  // Deezer
  /* **************************************************************************/

  /**
  * Updates the streaming config inside a musicbox
  * @param id: the id of the musicbox
  * @param updates: the updates to apply
  */
  updateStreamingConfig (id, updates) { return { id: id, updates: updates } }

  /**
  * Sets the last fired history id
  * @param id: the id of the musicbox
  * @param historyId: the last historyId
  */
  setStreamingLastNotifiedInternalDate (id, internalDate) {
    return this.update(id, 'streamingUnreadMessageInfo_v2.lastNotifiedInternalDate', parseInt(internalDate))
  }

  /* **************************************************************************/
  // Active
  /* **************************************************************************/

  /**
  * Changes the active musicbox
  * @param id: the id of the musicbox
  * @param service=default: the service to change to
  */
  changeActive (id, service = Musicbox.SERVICES.DEFAULT) {
    return { id: id, service: service }
  }

  /**
  * Changes the active musicbox to the previous in the list
  */
  changeActiveToPrev () { return {} }

  /**
  * Changes the active musicbox to the next in the list
  */
  changeActiveToNext () { return {} }

  /* **************************************************************************/
  // Search
  /* **************************************************************************/

  /**
  * Starts searching the musicbox
  * @param id: the musicbox id
  * @param service: the type of service to search for
  */
  startSearchingMusicbox (id, service) {
    return {id: id, service: service}
  }

  /**
  * Stops searching the musicbox
  * @param id: the musicbox id
  * @param service: the type of service to stop search for
  */
  stopSearchingMusicbox (id, service) {
    return {id: id, service: service}
  }

  /* **************************************************************************/
  // Ordering
  /* **************************************************************************/

  /**
  * Moves a musicbox up in the index
  * @param id: the id of the musicbox
  */
  moveUp (id) { return { id: id } }

  /**
  * Moves a musicbox down in the index
  * @param id: the id of the musicbox
  */
  moveDown (id) { return { id: id } }

  /* **************************************************************************/
  // Auth
  /* **************************************************************************/

  /**
  * Reauthenticates the user by logging them out of the webview
  * @param id: the id of the musicbox
  */
  reauthenticateBrowserSession (id) {
    const ses = session.fromPartition('persist:' + id)
    const promise = Promise.resolve()
      .then(() => {
        return new Promise((resolve) => {
          ses.clearStorageData(resolve)
        })
      })
      .then(() => {
        return new Promise((resolve) => {
          ses.clearCache(resolve)
        })
      })
      .then(() => {
        musicboxDispatch.reloadAllServices(id)
        return Promise.resolve()
      })

    return { promise: promise }
  }

  /* **************************************************************************/
  // Player
  /* **************************************************************************/

  /**
   * username
   * @param id: the id of the musicbox
   */
  setUsername (id, evt) {
    const {musicboxId, username} = evt
    // console.log('mbA.setUsername', id, evt, musicboxId, username)
    return {id, musicboxId, username}
  }

  /**
  * track changed
  * @param id: the id of the musicbox
  */
  trackChanged (id, evt) {
    const { musicboxId, trackDetail } = evt
    // console.log('mbA.trackChanged', id, evt, musicboxId, trackDetail)
    return { id, musicboxId, trackDetail }
  }

  /**
  * track changed
  * @param id: the id of the musicbox
  */
  tracklistChanged (id, evt) {
    // console.log('MusicboxActions.trackChanged', id, evt)
    const { musicboxId, tracklist } = evt
    return { id, musicboxId, tracklist }
  }

  playingChanged (id, evt) {
    const { musicboxId, playing } = evt
    // console.log('mbA.playingChanged', id, evt, musicboxId, playing);
    return { id, musicboxId, playing }
  }

  pageChanged (id, evt) {
    const { musicboxId, pageInfo } = evt
    // console.log('MusicboxActions.pageChanged', id, pageInfo, evt)
    return { id, musicboxId, pageInfo }
  }

  setTrackTime (id, evt) {
    const {musicboxId, trackTime} = evt
    // console.log('MusicboxActions.pageChanged', id, pageUrl)
    return {id, musicboxId, trackTime}
  }

}

const actions = alt.createActions(MusicboxActions)
ipcRenderer.on('musicbox-zoom-in', actions.increaseActiveZoom)
ipcRenderer.on('musicbox-zoom-out', actions.decreaseActiveZoom)
ipcRenderer.on('musicbox-zoom-reset', actions.resetActiveZoom)
ipcRenderer.on('musicbox-window-find-start', () => actions.startSearchingMusicbox())
ipcRenderer.on('switch-musicbox', (evt, req) => {
  if (req.musicboxId) {
    actions.changeActive(req.musicboxId)
  } else if (req.prev) {
    actions.changeActiveToPrev()
  } else if (req.next) {
    actions.changeActiveToNext()
  }
})
ipcRenderer.on('control-musicbox', (evt, req) => {
  if (req.playPause) {
    actions.playPause()
  } else if (req.nextTrack) {
    actions.nextTrack()
  } else if (req.previousTrack) {
    actions.previousTrack()
  }
})

module.exports = actions
