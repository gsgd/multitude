const injector = require('../injector')
const {ipcRenderer} = require('electron')
// const GoogleWindowOpen = require('./GoogleWindowOpen')
const path = require('path')
const fs = require('fs')
const DeezerChangeEmitter = require('./DeezerChangeEmitter')
// const GmailChangeEmitter = require('./GmailChangeEmitter')
// const GinboxChangeEmitter = require('./GinboxChangeEmitter')
// const GinboxApi = require('./GinboxApi')
// const GmailApiExtras = require('./GmailApiExtras')
const elconsole = require('../elconsole')
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

    // Bind our listeners
    ipcRenderer.on('deezer-init', this.handleInit.bind(this))
    ipcRenderer.on('deezer-play', this.handlePlay.bind(this))
    ipcRenderer.on('deezer-pause', this.handlePause.bind(this))
    ipcRenderer.on('deezer-play-pause', this.handlePlayPause.bind(this))
    ipcRenderer.on('deezer-next-track', this.handleNextTrack.bind(this))
    ipcRenderer.on('deezer-previous-track', this.handlePreviousTrack.bind(this))

    this.changeEmitter = new DeezerChangeEmitter()
  }

  get volume () {
    // console.log('dz get volume');
    return dzPlayer.getVolume()
  }

  set volume (level) {
    // console.log('dz set volume');
    dzPlayer.control.setVolume(level)
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get isGmail () { return window.location.host.indexOf('mail.google') !== -1 }
  get isGinbox () { return window.location.host.indexOf('inbox.google') !== -1 }

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
