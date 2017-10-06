const injector = require('../injector')
const {ipcRenderer} = require('electron')
// const GoogleWindowOpen = require('./GoogleWindowOpen')
const path = require('path')
const fs = require('fs')
const OvercastChangeEmitter = require('./OvercastChangeEmitter')
// const GmailChangeEmitter = require('./GmailChangeEmitter')
// const GinboxChangeEmitter = require('./GinboxChangeEmitter')
// const GinboxApi = require('./GinboxApi')
// const GmailApiExtras = require('./GmailApiExtras')
const elconsole = require('../elconsole')
const StreamingService = require('../Service/StreamingService')

class OvercastStreaming extends StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    super()

    // Bind our listeners
    ipcRenderer.on('overcast-play-pause', this.handlePlayPause.bind(this))
    ipcRenderer.on('overcast-play', this.handlePlay.bind(this))
    ipcRenderer.on('overcast-pause', this.handlePause.bind(this))
    ipcRenderer.on('overcast-next-track', this.handleSeekForward.bind(this))
    ipcRenderer.on('overcast-previous-track', this.handleSeekBackward.bind(this))

    this.changeEmitter = new OvercastChangeEmitter()
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get isGmail () { return window.location.host.indexOf('mail.google') !== -1 }
  get isGinbox () { return window.location.host.indexOf('inbox.google') !== -1 }

  get volume () {
    return this.changeEmitter.player.volume
  }

  set volume (level) {
    this.changeEmitter.player.volume = level
  }

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

  /* **************************************************************************/
  // Event handlers
  /* **************************************************************************/

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePlayPause (evt, data) {
    this.changeEmitter.player.paused ? this.handlePlay(evt, data) : this.handlePause(evt, data)
  }

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePlay (evt, data) {
    this.changeEmitter.player.play()
  }

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePause (evt, data) { 
    this.changeEmitter.player.pause()
  }

  handleSeekForward (evt, data) { 
    document.getElementById('seekforwardbutton').click()
  }

  handleSeekBackward (evt, data) { 
    document.getElementById('seekbackbutton').click()
  }

}

module.exports = OvercastStreaming
