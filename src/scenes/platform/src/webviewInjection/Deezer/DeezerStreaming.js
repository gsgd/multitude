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
    // this.googleWindowOpen = new GoogleWindowOpen()

    this.sidebarStylesheet = document.createElement('style')
    // this.sidebarStylesheet.innerHTML = `
    //   [href="#inbox"][data-ved]>* {
    //     max-height:33px !important;
    //     margin-top: 22px;
    //     background-position-x: center;
    //   }
    //   [jsaction="global.toggle_main_menu"] {
    //     margin-top: 5px;
    //   }
    //   [jsaction="global.toggle_main_menu"] ~ [data-action-data] {
    //     margin-top: 21px;
    //   }
    // `

    // Inject some styles
    injector.injectStyle(`
      button[data-type="log_out"] {
        visibility: hidden !important;
      }
    `)

    // Bind our listeners
    // ipcRenderer.on('window-icons-in-screen', this.handleWindowIconsInScreenChange.bind(this))
    // ipcRenderer.on('get-google-unread-count', this.handleFetchUnreadCount.bind(this))

    ipcRenderer.on('deezer-init', this.handleInit.bind(this))
    ipcRenderer.on('deezer-play-pause', this.handlePlayPause.bind(this))
    ipcRenderer.on('deezer-next-track', this.handleNextTrack.bind(this))
    ipcRenderer.on('deezer-previous-track', this.handlePreviousTrack.bind(this))

    this.changeEmitter = new DeezerChangeEmitter()
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

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePlayPause (evt, data) { 
    window.dzPlayer.control.togglePause()
  }

  handleNextTrack (evt, data) { 
    window.dzPlayer.control.nextSong()
  }

  handlePreviousTrack (evt, data) { 
    window.dzPlayer.control.prevSong()
  }

  handleInit (evt, data) {
    window.__DZR_APP_STATE__ = data
  }

}

module.exports = DeezerStreaming
