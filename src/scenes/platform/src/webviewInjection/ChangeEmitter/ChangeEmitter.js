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
   * @param {MediaPlayer} player: the media player to use
  */
  constructor (player) {
    this.player = player
    // load
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this))
    window.addEventListener('load', this.onFullyLoaded.bind(this))
    // unload
    if (this.player.handleUnload !== undefined) { window.addEventListener('beforeunload', this.onUnload.bind(this)) }
    this.transmitEvent(MUSICBOX_WINDOW_INIT_REQUEST, true)
  }

  get player () {
    return this.__player__
  }

  set player (player) {
    this.__player__ = player
  }

  onLoaded () {
    this.player.onLoaded(this)
  }

  onUnload () {
    this.player.onUnload(this)
  }

  onFullyLoaded () {
    this.handlePageChanged()
    this.handleDisplayCurrentSong()
    this.handlePlaying()
    this.handleUsername()
  }

  subscribeToEvents () {
    // console.log('ChangeEmitter.subscribeToEvents', this)
    this.player.subscribeToEvents(this)
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying () {
    // console.log('handlePlaying', this.player.playing)
    this.transmitEvent(MUSICBOX_WINDOW_PLAYING, this.player.playing)
  }

  throttleDisplayCurrentSong () {
    return throttle(() => {
      this.handleDisplayCurrentSong()
    }, 1000, { trailing: true, leading: false })
  }

  handleDisplayCurrentSong () {
    // console.log('handleDisplayCurrentSong', event, data)
    this.transmitEvent(MUSICBOX_WINDOW_TRACK_CHANGED, this.player.currentTrack)
  }

  handleUsername () {
    // console.log('handleUsername', data)
    this.transmitEvent(MUSICBOX_WINDOW_USERNAME, this.player.username)
  }

  handleTracklistChanged () {
    // console.log('handleTracklistChanged', data)
    this.transmitEvent(MUSICBOX_WINDOW_TRACKLIST_CHANGED, this.player.tracklist)
  }

  handlePageChanged () {
    // console.log('handlePageChanged', event, data)
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, this.player.currentPage)
  }

  throttleTimeUpdated () {
    return throttle(() => {
      // console.log('handleTimeUpdated.throttle')
      this.handleTimeUpdated()
    }, 1100)
  }

  handleTimeUpdated () {
    // console.log('handleTimeUpdated', this.player.currentTime)
    this.transmitEvent(MUSICBOX_WINDOW_TIME_UPDATED, this.player.currentTime)
  }

  /* **************************************************************************/
  // Event Emitter
  /* **************************************************************************/

  /**
  * Passing events up across the bridge
  */
  transmitEvent (type, data) {
    if (data === undefined) { return }
    // console.log('transmitEvent', type, data)
    ipcRenderer.sendToHost({
      type: type,
      data: data
    })
  }
}

module.exports = ChangeEmitter
