const alt = require('../alt')
const actions = require('./musicboxActions')
const Musicbox = require('shared/Models/Musicbox/Musicbox')
const uuid = require('uuid')
const persistence = {
  musicbox: require('./musicboxPersistence'),
  avatar: require('./avatarPersistence')
}

const {MUSICBOX_INDEX_KEY, MUSICBOX_ACTIVE_KEY} = require('shared/constants')
const { BLANK_PNG } = require('shared/b64Assets')
const { ipcRenderer } = window.nativeRequire('electron')

// persistence.musicbox.setJSONItemSync(MUSICBOX_ACTIVE_KEY, {MUSICBOX_ACTIVE_KEY: null})

const ImageUtil = require('shared/imageUtil')

// console.log(actions);

class MusicboxStore {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.index = []
    this.musicboxes = new Map()
    this.avatars = new Map()
    this.__active = null
    this.activeService = Musicbox.SERVICES.DEFAULT
    this.search = new Map()

    /* ****************************************/
    // Fetching Musicboxes
    /* ****************************************/

    /**
    * @return all the musicboxes in order
    */
    this.allMusicboxes = () => { return this.index.map((id) => this.musicboxes.get(id)) }

    /**
    * @return the ids
    */
    this.musicboxIds = () => { return Array.from(this.index) }

    /**
    * @return the musicbox
    */
    this.getMusicbox = (id) => { return this.musicboxes.get(id) || null }

    /**
    * @return the count of musicboxes
    */
    this.musicboxCount = () => { return this.musicboxes.size }

    /* ****************************************/
    // Avatar
    /* ****************************************/

    this.getAvatar = (id) => { return this.avatars.get(id) || BLANK_PNG }

    /* ****************************************/
    // Active
    /* ****************************************/

    /**
    * @return the id of the active musicbox
    */
    this.activeMusicboxId = () => { return this.active }

    /**
    * @return the service type of the active musicbox
    */
    this.activeMusicboxService = () => {
      if (this.activeService === Musicbox.SERVICES.DEFAULT) {
        return Musicbox.SERVICES.DEFAULT
      } else {
        const musicbox = this.activeMusicbox()
        const valid = musicbox.enabledServies.findIndex((s) => s === this.activeService) !== -1
        return valid ? this.activeService : Musicbox.SERVICES.DEFAULT
      }
    }

    /**
    * @return the active musicbox
    */
    this.activeMusicbox = () => { return this.musicboxes.get(this.active) }

    /**
    * @param musicboxId: the id of the musicbox
    * @param service: the type of service
    * @return true if this musicbox is active, false otherwise
    */
    this.isActive = (musicboxId, service) => {
      return this.activeMusicboxId() === musicboxId && this.activeMusicboxService() === service
    }

    /* ****************************************/
    // Search
    /* ****************************************/

    /**
    * @param musicboxId: the id of the musicbox
    * @param service: the service of the musicbox
    * @return true if the musicbox is searching, false otherwise
    */
    this.isSearchingMusicbox = (musicboxId, service) => {
      return this.search.get(`${musicboxId}:${service}`) === true
    }

    /* ****************************************/
    // Aggregated queries
    /* ****************************************/

    /**
    * @return the total amount of unread items
    */
    this.totalUnreadCount = () => {
      return this.all().reduce((acc, musicbox) => {
        if (musicbox && !isNaN(musicbox.unread)) {
          acc += musicbox.unread
        }
        return acc
      }, 0)
    }

    /**
    * @return the total amount of unread items taking musicbox settings into account
    */
    this.totalUnreadCountForAppBadge = () => {
      return this.allMusicboxes().reduce((acc, musicbox) => {
        if (musicbox && !isNaN(musicbox.unread) && musicbox.unreadCountsTowardsAppUnread) {
          acc += musicbox.unread
        }
        return acc
      }, 0)
    }

    /**
    * @return all the unread messages for the app badge
    */
    this.unreadMessagesForAppBadge = () => {
      return this.allMusicboxes().reduce((acc, musicbox) => {
        if (musicbox && musicbox.unreadCountsTowardsAppUnread) {
          if (musicbox.deezer) {
            acc[musicbox.id] = Object.assign({}, musicbox.deezer.unreadMessages)
          }
        }
        return acc
      }, {})
    }

    /* ****************************************/
    // Listeners
    /* ****************************************/

    // console.log(this, actions);

    this.bindListeners({
      // Load
      handleLoad: actions.LOAD,

      // Create & Remove
      handleCreate: actions.CREATE,
      handleRemove: actions.REMOVE,

      // Update
      handleUpdate: actions.UPDATE,
      handleSetCustomAvatar: actions.SET_CUSTOM_AVATAR,

      // Update: Services
      handleAddService: actions.ADD_SERVICE,
      handleRemoveService: actions.REMOVE_SERVICE,
      handleMoveServiceUp: actions.MOVE_SERVICE_UP,
      handleMoveServiceDown: actions.MOVE_SERVICE_DOWN,
      handleToggleServiceSleepable: actions.TOGGLE_SERVICE_SLEEPABLE,

      // Update player info
      handleSetUsername: actions.SET_USERNAME,
      handleTrackChanged: actions.TRACK_CHANGED,
      handleTracklistChanged: actions.TRACKLIST_CHANGED,
      handlePlayingChanged: actions.PLAYING_CHANGED,
      handlePageChanged: actions.PAGE_CHANGED,

      // Active Update
      handleIncreaseActiveZoom: actions.INCREASE_ACTIVE_ZOOM,
      handleDecreaseActiveZoom: actions.DECREASE_ACTIVE_ZOOM,
      handleResetActiveZoom: actions.RESET_ACTIVE_ZOOM,

      // Search
      handleStartSearchingMusicbox: actions.START_SEARCHING_MUSICBOX,
      handleStopSearchingMusicbox: actions.STOP_SEARCHING_MUSICBOX,

      // Streaming
      handleUpdateDeezerConfig: actions.UPDATE_STREAMING_CONFIG,

      // Active & Ordering
      handleChangeActive: actions.CHANGE_ACTIVE,
      handleChangeActivePrev: actions.CHANGE_ACTIVE_TO_PREV,
      handleChangeActiveNext: actions.CHANGE_ACTIVE_TO_NEXT,
      handleMoveUp: actions.MOVE_UP,
      handleMoveDown: actions.MOVE_DOWN
    })
  }

  /* **************************************************************************/
  // Getters and Setters
  /* **************************************************************************/

  get active () {
    return this.__active
  }

  set active (value) {
    persistence.musicbox.setJSONItem(MUSICBOX_ACTIVE_KEY, value)
    this.__active = value
  }

  /* **************************************************************************/
  // Utils
  /* **************************************************************************/

  /**
  * Saves a musicbox
  * @param musicboxId: the id of the musicbox
  * @param musicboxJS: the js of the musicbox
  */
  saveMusicbox (musicboxId, musicboxJS) {
    persistence.musicbox.setJSONItem(musicboxId, musicboxJS)
    this.musicboxes.set(musicboxId, new Musicbox(musicboxId, musicboxJS))
  }

  /* **************************************************************************/
  // Handlers Load
  /* **************************************************************************/

  /**
  * Loads the storage from disk
  */
  handleLoad () {
    // Load
    const allAvatars = persistence.avatar.allItemsSync()
    const allMusicboxes = persistence.musicbox.allJSONItemsSync()
    this.index = []

    // console.log('mbS.handleLoad', allMusicboxes)
    // Musicboxes
    Object.keys(allMusicboxes).forEach((id) => {
      if (id === MUSICBOX_INDEX_KEY) {
        this.index = allMusicboxes[MUSICBOX_INDEX_KEY]
      } else if (id === MUSICBOX_ACTIVE_KEY) {
        this.__active = allMusicboxes[MUSICBOX_ACTIVE_KEY]
      } else {
        this.musicboxes.set(id, new Musicbox(id, allMusicboxes[id]))
        ipcRenderer.send('prepare-webview-session', { partition: 'persist:' + id })
      }
    })

    if (this.__active === null) { this.__active = this.index[0] || null }

    // Avatars
    Object.keys(allAvatars).forEach((id) => {
      this.avatars.set(id, allAvatars[id])
    })
  }

  /* **************************************************************************/
  // Handlers Create & Remove
  /* **************************************************************************/

  /**
  * Creates a new musicbox
  * @param id: the id of the musicbox
  * @param data: the data to seed the musicbox with
  */
  handleCreate ({id, data}) {
    this.saveMusicbox(id, data)
    ipcRenderer.send('prepare-webview-session', { partition: 'persist:' + id })
    this.index.push(id)
    persistence.musicbox.setJSONItem(MUSICBOX_INDEX_KEY, this.index)
    this.active = id
  }

  /**
  * Removes an item
  * @param id: the id to remove
  */
  handleRemove ({id}) {
    const wasActive = this.active === id
    this.index = this.index.filter((i) => i !== id)
    persistence.musicbox.setJSONItem(MUSICBOX_INDEX_KEY, this.index)
    this.musicboxes.delete(id)
    persistence.musicbox.removeItem(id)

    if (wasActive) {
      this.active = this.index[0]
    }
  }

  /* **************************************************************************/
  // Handlers Update
  /* **************************************************************************/

  /**
  * Updates a musicboxJS object by taking the path and value
  * @param musicboxJS: the musicbox js object to update in situ
  * @param path: the path to update
  * @param value: the value to update with
  * @return the updated musicboxJS although this item has been updated in situ
  */
  _updateMusicboxJSWithPath_ (musicboxJS, path, value) {
    let pointer = musicboxJS
    path.split('.').forEach((fragment, index, fragments) => {
      if (index === fragments.length - 1) {
        pointer[fragment] = value
      } else {
        if (!pointer[fragment]) {
          pointer[fragment] = {}
        }
        pointer = pointer[fragment]
      }
    })
    return musicboxJS
  }

  /**
  * Handles a musicbox updating
  * @param id: the id of the tem
  * @param updates: the updates to merge in
  */
  handleUpdate ({id, updates, path, value}) {
    const musicboxJS = this.musicboxes.get(id).cloneData()
    if (updates !== undefined) {
      Object.keys(updates).forEach((path) => {
        this._updateMusicboxJSWithPath_(musicboxJS, path, updates[path])
      })
    } else {
      this._updateMusicboxJSWithPath_(musicboxJS, path, value)
    }
    this.saveMusicbox(id, musicboxJS)
  }

  /**
  * Handles setting a custom avatar
  * @param: id the id of the musicbox
  * @param b64Image: a base64 version of the image
  */
  handleSetCustomAvatar ({id, b64Image}) {
    const musicbox = this.musicboxes.get(id)
    let data = musicbox.cloneData()
    if (b64Image) {
      const imageId = uuid.v4()
      data.customAvatar = imageId
      persistence.avatar.setItem(imageId, b64Image)
      this.avatars.set(imageId, b64Image)
    } else {
      if (data.customAvatar) {
        persistence.avatar.removeItem(data.customAvatar)
        this.avatars.delete(data.customAvatar)
        delete data.customAvatar
      }
    }
    this.saveMusicbox(id, data)
  }

  /* **************************************************************************/
  // Handlers Update Service
  /* **************************************************************************/

  handleAddService ({ id, service }) {
    const musicbox = this.musicboxes.get(id)

    const supportedIndex = new Set(musicbox.supportedServices)
    if (!supportedIndex.has(service)) { return }

    const enabledIndex = new Set(musicbox.enabledServies)
    if (enabledIndex.has(service)) { return }

    this.saveMusicbox(id, musicbox.changeData({
      services: Array.from(musicbox.enabledServies).concat(service)
    }))
  }

  handleRemoveService ({ id, service }) {
    const musicbox = this.musicboxes.get(id)
    this.saveMusicbox(id, musicbox.changeData({
      services: Array.from(musicbox.enabledServies).filter((s) => s !== service)
    }))
  }

  handleMoveServiceUp ({ id, service }) {
    const musicbox = this.musicboxes.get(id)
    const services = Array.from(musicbox.enabledServies)
    const serviceIndex = services.findIndex((s) => s === service)
    if (serviceIndex !== -1 && serviceIndex !== 0) {
      services.splice(serviceIndex - 1, 0, services.splice(serviceIndex, 1)[0])
      this.saveMusicbox(id, musicbox.changeData({
        services: services
      }))
    }
  }

  handleMoveServiceDown ({ id, service }) {
    const musicbox = this.musicboxes.get(id)
    const services = Array.from(musicbox.enabledServies)
    const serviceIndex = services.findIndex((s) => s === service)
    if (serviceIndex !== -1 && serviceIndex < services.length) {
      services.splice(serviceIndex + 1, 0, services.splice(serviceIndex, 1)[0])
      this.saveMusicbox(id, musicbox.changeData({
        services: services
      }))
    }
  }

  handleToggleServiceSleepable ({ id, service, sleepable }) {
    const musicbox = this.musicboxes.get(id)
    const services = new Set(musicbox.sleepableServices)
    services[sleepable ? 'add' : 'delete'](service)
    this.saveMusicbox(id, musicbox.changeData({
      sleepableServices: Array.from(services)
    }))
  }

  /* **************************************************************************/
  // Handlers Update Active
  /* **************************************************************************/

  handleIncreaseActiveZoom () {
    const musicbox = this.activeMusicbox()
    if (musicbox) {
      const musicboxJS = musicbox.changeData({
        zoomFactor: Math.min(1.5, musicbox.zoomFactor + 0.1)
      })
      this.saveMusicbox(musicbox.id, musicboxJS)
    }
  }

  handleDecreaseActiveZoom () {
    const musicbox = this.activeMusicbox()
    if (musicbox) {
      const musicboxJS = musicbox.changeData({
        zoomFactor: Math.min(1.5, musicbox.zoomFactor - 0.1)
      })
      this.saveMusicbox(musicbox.id, musicboxJS)
    }
  }

  handleResetActiveZoom () {
    const musicbox = this.activeMusicbox()
    if (musicbox) {
      const musicboxJS = musicbox.changeData({ zoomFactor: 1.0 })
      this.saveMusicbox(musicbox.id, musicboxJS)
    }
  }

  /* **************************************************************************/
  // Handlers : Player
  /* **************************************************************************/

  /**
  * Handles the deezer config updating
  * @param id: the id of the musicbox
  * @param updates: the updates to merge in
  */
  handleTrackChanged ({id, musicboxId, trackDetail}) {
    // console.log('mbS.handleTrackChanged', id, musicboxId, trackDetail);
    if (id !== musicboxId) { return }
    const data = this.musicboxes.get(id).cloneData()
    if (JSON.stringify(data.currentTrack) === JSON.stringify(trackDetail)) { return }

    data.currentTrack = trackDetail
    this.saveMusicbox(id, data)
    if (trackDetail.imageUrl) {
      // console.log('musicboxStore.handleTrackChanged.imageUrl', trackDetail.imageUrl);
      const imageUtil = new ImageUtil(trackDetail.imageUrl)
      // // console.log('musicboxStore.handleTrackChanged.imageUtil', imageUtil);
      imageUtil.b64.then((b64image) => {
        // // console.log('handleTrackChanged.b64image', b64image);
        actions.setCustomAvatar(id, b64image)
      })
    }
  }

  /**
  * Handles the deezer config updating
  * @param id: the id of the musicbox
  * @param updates: the updates to merge in
  */
  handleTracklistChanged ({id, musicboxId, tracklist}) {
    // console.log('musicboxStore.handleTrackChanged', id, musicboxId, trackDetail);
    if (id !== musicboxId) { return }
    const data = this.musicboxes.get(id).cloneData()

    data.tracklist = tracklist
    this.saveMusicbox(id, data)
  }

  /**
   * Handles the deezer config updating
   * @param id: the id of the musicbox
   * @param updates: the updates to merge in
   */
  handleSetUsername ({id, musicboxId, username}) {
    // console.log('musicboxStore.handleSetUsername', id, musicboxId, username)
    if (id !== musicboxId) { return }
    const data = this.musicboxes.get(id).cloneData()

    if (data.username === username) { return }
    data.username = username
    this.saveMusicbox(id, data)
  }

  /**
  * Handles the deezer config updating
  * @param id: the id of the musicbox
  * @param updates: the updates to merge in
  */
  handlePlayingChanged ({id, musicboxId, playing}) {
    // console.log('musicboxStore.handlePlayingChanged', id, musicboxId, playing);
    if (id !== musicboxId) { return }
    const data = this.musicboxes.get(id).cloneData()
    data.isPlaying = playing
    this.saveMusicbox(id, data)
  }

  /**
  * Handles the deezer config updating
  * @param id: the id of the musicbox
  * @param updates: the updates to merge in
  */
  handlePageChanged ({id, musicboxId, pageUrl}) {
    if (id !== musicboxId) { return }
    // console.log('musicboxStore.handlePageChanged', pageUrl);
    const data = this.musicboxes.get(id).cloneData()
    data.pageUrl = pageUrl
    this.saveMusicbox(id, data)
  }

  /* **************************************************************************/
  // Handlers : Deezer
  /* **************************************************************************/

  /**
  * Handles the deezer config updating
  * @param id: the id of the musicbox
  * @param updates: the updates to merge in
  */
  handleUpdateDeezerConfig ({id, updates}) {
    const data = this.musicboxes.get(id).cloneData()
    data.deezerConf = Object.assign(data.deezerConf || {}, updates)
    this.saveMusicbox(id, data)
  }

  /**
  * Updates the deezer unread threads
  * @param id: the id of the musicbox
  * @param threadList: the complete thread list as an array
  * @param fetchedThreads: the threads that were fetched in an object by id
  * @param resultSizeEstimate: the size estimate
  */
  handleSetDeezerLatestUnreadThreads ({ id, threadList, fetchedThreads, resultSizeEstimate }) {
    const prevThreads = this.musicboxes.get(id).deezer.latestUnreadThreads.reduce((acc, thread) => {
      acc[thread.id] = thread
      return acc
    }, {})

    // Merge changes
    const nextThreads = threadList.map((threadHead) => {
      if (fetchedThreads[threadHead.id]) {
        return fetchedThreads[threadHead.id]
      } else if (prevThreads[threadHead.id]) {
        return prevThreads[threadHead.id]
      } else {
        return undefined
      }
    }).filter((thread) => !!thread)

    // Write it
    const data = this.musicboxes.get(id).cloneData()
    data.deezerUnreadMessageInfo_v2 = data.deezerUnreadMessageInfo_v2 || {}
    data.deezerUnreadMessageInfo_v2.latestUnreadThreads = nextThreads
    data.deezerUnreadMessageInfo_v2.resultSizeEstimate = resultSizeEstimate
    this.saveMusicbox(id, data)
  }

  handleSetDeezerHasGrantError ({ id, hasError }) {
    const data = this.musicboxes.get(id).cloneData()

    if (data.deezerAuth.invalidGrant !== hasError) {
      data.deezerAuth.invalidGrant = hasError
      this.saveMusicbox(id, data)
    } else {
      this.preventDefault()
    }
  }

  /* **************************************************************************/
  // Handlers : Active & Ordering
  /* **************************************************************************/

  /**
  * Handles the active musicbox changing
  * @param id: the id of the musicbox
  * @param service: the service type
  */
  handleChangeActive ({id, service}) {
    this.active = id
    this.activeService = service
  }

  /**
  * Handles the active musicbox changing to the prev in the index
  */
  handleChangeActivePrev () {
    const activeIndex = this.index.findIndex((id) => id === this.active)
    this.active = this.index[Math.max(0, activeIndex - 1)] || null
    this.activeService = Musicbox.SERVICES.DEFAULT
  }

  /**
  * Handles the active musicbox changing to the next in the index
  */
  handleChangeActiveNext () {
    const activeIndex = this.index.findIndex((id) => id === this.active)
    this.active = this.index[Math.min(this.index.length - 1, activeIndex + 1)] || null
    this.activeService = Musicbox.SERVICES.DEFAULT
  }

  /**
  * Handles moving the given musicbox id up
  */
  handleMoveUp ({id}) {
    const musicboxIndex = this.index.findIndex((i) => i === id)
    if (musicboxIndex !== -1 && musicboxIndex !== 0) {
      this.index.splice(musicboxIndex - 1, 0, this.index.splice(musicboxIndex, 1)[0])
      persistence.musicbox.setJSONItem(MUSICBOX_INDEX_KEY, this.index)
    }
  }

  /**
  * Handles moving the given musicbox id down
  */
  handleMoveDown ({id}) {
    const musicboxIndex = this.index.findIndex((i) => i === id)
    if (musicboxIndex !== -1 && musicboxIndex < this.index.length) {
      this.index.splice(musicboxIndex + 1, 0, this.index.splice(musicboxIndex, 1)[0])
      persistence.musicbox.setJSONItem(MUSICBOX_INDEX_KEY, this.index)
    }
  }

  /* **************************************************************************/
  // Handlers : Search
  /* **************************************************************************/

  /**
  * Indicates the musicbox is searching
  */
  handleStartSearchingMusicbox ({ id, service }) {
    if (id && service) {
      this.search.set(`${id}:${service}`, true)
    } else {
      this.search.set(`${this.active}:${this.activeService}`, true)
    }
  }

  /**
  * Indicates the musicbox is no longer searching
  */
  handleStopSearchingMusicbox ({id, service}) {
    if (id && service) {
      this.search.delete(`${id}:${service}`)
    } else {
      this.search.delete(`${this.active}:${this.activeService}`)
    }
  }

}

module.exports = alt.createStore(MusicboxStore, 'MusicboxStore')
