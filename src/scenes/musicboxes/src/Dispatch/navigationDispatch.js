const Minivents = require('minivents')
const {ipcRenderer} = window.nativeRequire('electron')

class NavigationDispatch {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    Minivents(this)
  }

  /**
  * Binds the listeners to the ipc renderer
  */
  bindIPCListeners () {
    ipcRenderer.on('launch-settings', () => { this.openSettings() })
    return this
  }

  /* **************************************************************************/
  // Actions
  /* **************************************************************************/

  /**
  * Emits an open settings command
  */
  openSettings () {
    this.emit('opensettings', {})
  }

  /**
  * Opens the settings at a musicbox
  * @param musicboxId: the id of the musicbox
  */
  openMusicboxSettings (musicboxId) {
    this.emit('opensettings', {
      route: {
        tab: 'accounts',
        musicboxId: musicboxId
      }
    })
  }

  /**
  * Opens the news
  */
  openNews () {
    this.emit('opennews', {})
  }
}

module.exports = new NavigationDispatch()
