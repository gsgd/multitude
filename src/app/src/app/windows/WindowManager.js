const {app} = require('electron')
const settingStore = require('../stores/settingStore')

class WindowManager {

  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  /**
  * @param musicboxesWindow: the main window
  */
  constructor (musicboxesWindow) {
    this.contentWindows = []
    this.musicboxesWindow = musicboxesWindow
    this.forceQuit = false
    this.musicboxesWindow.on('close', (e) => this.handleClose(e))
    this.musicboxesWindow.on('closed', () => {
      this.musicboxesWindow = null
      app.quit()
    })
  }

  /* ****************************************************************************/
  // Events
  /* ****************************************************************************/

  /**
  * Handles the close event by trying to persist the musicbox window
  * @param evt: the event that occured
  */
  handleClose (evt) {
    if (!this.forceQuit) {
      this.contentWindows.forEach((w) => w.close())
      if (process.platform === 'darwin' || settingStore.tray.show) {
        this.musicboxesWindow.hide()
        evt.preventDefault()
        this.forceQuit = false
      }
    }
  }

  /* ****************************************************************************/
  // Adding
  /* ****************************************************************************/

  /**
  * Adds a content window
  * @param window: the window to add
  */
  addContentWindow (window) {
    this.contentWindows.push(window)
    window.on('closed', () => {
      this.contentWindows = this.contentWindows.filter((w) => w !== window)
    })
  }

  /* ****************************************************************************/
  // Actions
  /* ****************************************************************************/

  /**
  * Handles a quit by trying to keep the musicbox window hidden
  */
  quit () {
    this.forceQuit = true
    this.musicboxesWindow.close()
  }

  /**
  * Focuses the next available window
  */
  focusNextWindow () {
    if (this.musicboxesWindow.isFocused()) {
      if (this.contentWindows.length) {
        this.contentWindows[0].focus()
      }
    } else {
      const focusedIndex = this.contentWindows.findIndex((w) => w.isFocused())
      if (focusedIndex === -1 || focusedIndex + 1 >= this.contentWindows.length) {
        this.musicboxesWindow.focus()
      } else {
        this.musicboxesWindow[focusedIndex + 1].focus()
      }
    }
  }

  /**
  * Focuses the main musicboxes window and shows it if it's hidden
  */
  focusMusicboxesWindow () {
    if (this.focused() === this.musicboxesWindow) {
      return // If there's already a focused window, do nothing
    }

    if (!this.musicboxesWindow.isVisible()) {
      this.musicboxesWindow.show()
    }
    this.musicboxesWindow.focus()
  }

  /**
  * Toggles the musicboxes window visibility by hiding or showing the musicboxes windoww
  */
  toggleMusicboxWindowVisibilityFromTray () {
    if (process.platform === 'win32') {
      // On windows clicking on non-window elements (e.g. tray) causes window
      // to lose focus, so the window will never have focus
      if (this.musicboxesWindow.isVisible()) {
        this.musicboxesWindow.close()
      } else {
        this.musicboxesWindow.show()
        this.musicboxesWindow.focus()
      }
    } else {
      if (this.musicboxesWindow.isVisible()) {
        if (this.focused() === this.musicboxesWindow) {
          this.musicboxesWindow.hide()
        } else {
          this.musicboxesWindow.focus()
        }
      } else {
        this.musicboxesWindow.show()
        this.musicboxesWindow.focus()
      }
    }
  }

  /* ****************************************************************************/
  // Querying
  /* ****************************************************************************/

  /**
  * @return the focused window
  */
  focused () {
    if (this.musicboxesWindow.isFocused()) {
      return this.musicboxesWindow
    } else {
      return this.contentWindows.find((w) => w.isFocused())
    }
  }
}

module.exports = WindowManager
