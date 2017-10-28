const {ipcRenderer} = require('electron')
const throttle = require('lodash.throttle')
const {
  MUSICBOX_WINDOW_INIT_REQUEST,
  MUSICBOX_WINDOW_PLAYING,
  MUSICBOX_WINDOW_TRACK_CHANGED,
  MUSICBOX_WINDOW_TRACKLIST_CHANGED,
  MUSICBOX_WINDOW_PAGE_CHANGED,
  MUSICBOX_WINDOW_USERNAME,
  MUSICBOX_WINDOW_TIME_UPDATED
} = require('shared/constants')

class ChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
   * @param strategy: the media strategy to use
  */
  constructor (strategy) {
    this.strategy = strategy
    this.__data__ = {intervals: []}
    // load
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this))
    window.addEventListener('load', this.onFullyLoaded.bind(this))
    // unload
    if (this.strategy.handleUnload !== undefined) { window.addEventListener('beforeunload', this.onUnload.bind(this)) }
    this.transmitEvent(MUSICBOX_WINDOW_INIT_REQUEST, true)
  }

  get strategy () {
    return this.__strategy__
  }

  set strategy (strategy) {
    this.__strategy__ = strategy
  }

  onLoaded () {
    this.strategy.onLoaded(this)
  }

  onUnload () {
    this.strategy.onUnload(this)
  }

  onFullyLoaded () {
    this.handlePageChanged()
    this.handleDisplayCurrentSong()
    this.handlePlaying()
    this.handleUsername()
  }

  subscribeToEvents () {
    // console.log('ChangeEmitter.subscribeToEvents', this)
    this.strategy.subscribeToEvents(this)
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying () {
    // console.log('handlePlaying', this.strategy.playing)
    this.transmitEvent(MUSICBOX_WINDOW_PLAYING, this.strategy.playing)
  }

  handleDisplayCurrentSong () {
    // console.log('handleDisplayCurrentSong', event, data)
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(() => {
      this.transmitEvent(MUSICBOX_WINDOW_TRACK_CHANGED, this.strategy.currentTrack)
    }, 1000)
  }

  handleUsername () {
    // console.log('handleUsername', data)
    this.transmitEvent(MUSICBOX_WINDOW_USERNAME, this.strategy.username)
  }

  handleTracklistChanged () {
    // console.log('handleTracklistChanged', data)
    this.transmitEvent(MUSICBOX_WINDOW_TRACKLIST_CHANGED, this.strategy.tracklist)
  }

  handlePageChanged () {
    // console.log('handlePageChanged', event, data)
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, this.strategy.currentPage)
  }

  throttleTimeUpdated () {
    return throttle(() => {
      console.log('handleTimeUpdated.throttle')
      this.handleTimeUpdated()
    }, 1500)
  }

  handleTimeUpdated () {
    console.log('handleTimeUpdated', this.strategy.currentTime)
    this.transmitEvent(MUSICBOX_WINDOW_TIME_UPDATED, this.strategy.currentTime)
  }

  /* **************************************************************************/
  // Event Emitter
  /* **************************************************************************/

  /**
  * Passing events up across the bridge
  */
  transmitEvent (type, data) {
    if (data === undefined) { return }
    console.log('transmitEvent', type, data)
    ipcRenderer.sendToHost({
      type: type,
      data: data
    })
  }
}

module.exports = ChangeEmitter
