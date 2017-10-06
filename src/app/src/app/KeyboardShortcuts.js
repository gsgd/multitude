const {globalShortcut} = require('electron')

/*
 * KeyboardShortcuts registers additional keyboard shortcuts.
 * Note that most keyboard shortcuts are configured with the AppPrimaryMenu.
 */
class KeyboardShortcuts {

  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor (selectors) {
    this._selectors = selectors
    this._shortcuts = []
    this._globalShortcuts = []
  }

  /* ****************************************************************************/
  // Creating
  /* ****************************************************************************/

  /**
   * Registers global keyboard shortcuts.
   */
  register () {
    let shortcuts = new Map([
      ['CmdOrCtrl+{', this._selectors.prevMusicbox],
      ['CmdOrCtrl+}', this._selectors.nextMusicbox],
    ])
    this.unregister()
    shortcuts.forEach((callback, accelerator) => {
      globalShortcut.register(accelerator, callback)
      this._shortcuts.push(accelerator)
    })
  }

  /**
   * Registers global keyboard shortcuts.
   */
  registerGlobal () {
    let shortcuts = new Map([
      ['MediaPlayPause', this._selectors.playPause],
      ['MediaNextTrack', this._selectors.nextTrack],
      ['MediaPreviousTrack', this._selectors.previousTrack]
    ])
    this.unregisterGlobal()
    shortcuts.forEach((callback, accelerator) => {
      // console.log('registerGlobal', callback, accelerator);
      globalShortcut.register(accelerator, callback)
      this._globalShortcuts.push(accelerator)
    })
  }

  /**
   * Unregisters any previously registered global keyboard shortcuts.
   */
  unregister () {
    this._shortcuts.forEach((accelerator) => {
      globalShortcut.unregister(accelerator)
    })
    this._shortcuts = []
  }

  /**
   * Unregisters any previously registered global keyboard shortcuts.
   */
  unregisterGlobal () {
    this._globalShortcuts.forEach((accelerator) => {
      globalShortcut.unregister(accelerator)
    })
    this._globalShortcuts = []
  }

}

module.exports = KeyboardShortcuts
