const injector = require('../injector')
const DeezerChangeEmitter = require('./DeezerChangeEmitter')
const StreamingService = require('../Service/StreamingService')

class DeezerStreaming extends StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    super()

    this.sidebarStylesheet = document.createElement('style')

    // Inject some styles
    injector.injectStyle(`
      button[data-type="log_out"] {
        visibility: hidden !important;
      }
    `)

    this.changeEmitter = new DeezerChangeEmitter()
  }

  get volume () {
    // console.log('dz get volume');
    return window.dzPlayer.getVolume()
  }

  set volume (level) {
    // console.log('dz set volume');
    window.dzPlayer.control.setVolume(level)
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

  /* **************************************************************************/
  // Event handlers
  /* **************************************************************************/

  handleInit (evt, data) {
    if (!data || !data.track) { return }
    document.addEventListener('DOMContentLoaded', () => { window.PLAYER_INIT = data })
  }
  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */

  handlePlay (evt, data) {
    window.dzPlayer.control.play()
  }

  handlePause (evt, data) {
    window.dzPlayer.control.pause()
  }

  handlePlayPause (evt, data) {
    window.dzPlayer.control.togglePause()
  }

  handleNextTrack (evt, data) {
    window.dzPlayer.control.nextSong()
  }

  handlePreviousTrack (evt, data) {
    window.dzPlayer.control.prevSong()
  }

}

module.exports = DeezerStreaming
