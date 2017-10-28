const {Menu} = require('electron')
const musicboxStore = require('./stores/musicboxStore')

class AppPrimaryMenu {

  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor (selectors) {
    this._selectors = selectors
    this._lastMusicboxes = null

    musicboxStore.on('changed', () => {
      this.handleMusicboxesChanged()
    })
  }

  /* ****************************************************************************/
  // Creating
  /* ****************************************************************************/

  /**
  * Builds the menu
  * @param musicboxes: the list of musicboxes
  * @return the new menu
  */
  build (musicboxes) {
    return Menu.buildFromTemplate([
      {
        label: 'Application',
        submenu: [
          { label: 'About', click: this._selectors.aboutDialog },
          { type: 'separator' },
          { label: 'Preferences', click: this._selectors.preferences, accelerator: 'CmdOrCtrl+,' },
          { type: 'separator' },
          process.platform === 'darwin' ? { label: 'Services', role: 'services', submenu: [] } : undefined,
          process.platform === 'darwin' ? { type: 'separator' } : undefined,
          { label: 'Hide', accelerator: 'CmdOrCtrl+H', role: 'hide' },
          { label: 'Hide Others', accelerator: process.platform === 'darwin' ? 'Command+Alt+H' : 'Ctrl+Shift+H', role: 'hideothers' },
          { label: 'Show All', role: 'unhide' },
          { type: 'separator' },
          { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: this._selectors.fullQuit }
        ].filter((item) => item !== undefined)
      },
      {
        label: 'File',
        submenu: [
          {label: 'Show Window', accelerator: 'CmdOrCtrl+N', click: this._selectors.showWindow},
          {label: 'Close Window', accelerator: 'CmdOrCtrl+W', click: this._selectors.closeWindow}
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
          { label: 'Paste and match style', accelerator: 'CmdOrCtrl+Shift+V', role: 'pasteandmatchstyle' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
          { type: 'separator' },
          { label: 'Find', accelerator: 'CmdOrCtrl+F', click: this._selectors.find },
          { label: 'Find Next', accelerator: 'CmdOrCtrl+G', click: this._selectors.findNext }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Toggle Full Screen', accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11', click: this._selectors.fullscreenToggle },
          { label: 'Toggle Sidebar', accelerator: (process.platform === 'darwin' ? 'Ctrl+Command+S' : 'Ctrl+Shift+S'), click: this._selectors.sidebarToggle },
          process.platform === 'darwin' ? undefined : { label: 'Toggle Menu', accelerator: 'CmdOrCtrl+\\', click: this._selectors.menuToggle },
          { type: 'separator' },
          { label: 'Navigate Back', accelerator: 'CmdOrCtrl+[', click: this._selectors.musicboxNavBack },
          { label: 'Navigate Back', accelerator: 'CmdOrCtrl+Left', click: this._selectors.musicboxNavBack },
          { label: 'Navigate Forward', accelerator: 'CmdOrCtrl+]', click: this._selectors.musicboxNavForward },
          { type: 'separator' },
          { label: 'Zoom Musicbox In', accelerator: 'CmdOrCtrl+Plus', click: this._selectors.zoomIn },
          { label: 'Zoom Musicbox Out', accelerator: 'CmdOrCtrl+-', click: this._selectors.zoomOut },
          { label: 'Reset Musicbox Zoom', accelerator: 'CmdOrCtrl+0', click: this._selectors.zoomReset },
          { type: 'separator' },
          { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: this._selectors.reload },
          { label: 'Toggle Dev Tools', accelerator: process.platform === 'darwin' ? 'Cmd+Alt+J' : 'Ctrl+Shift+J', click: this._selectors.devTools },
          {
            label: 'Toggle Box Dev Tools',
            accelerator: process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
            click: this._selectors.embeddedDevTools
          }
        ].filter((item) => item !== undefined)
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize'}
        ]
          .concat(process.platform === 'darwin' ? [] : [
          { label: 'Cycle Windows', accelerator: 'CmdOrCtrl+`', click: this._selectors.cycleWindows }
          ])
        .concat(musicboxes.length <= 1 ? [] : [
          { type: 'separator' },
          { label: 'Previous Musicbox', accelerator: 'CmdOrCtrl+<', click: this._selectors.prevMusicbox },
          { label: 'Next Musicbox', accelerator: 'CmdOrCtrl+>', click: this._selectors.nextMusicbox },
          {type: 'separator'},
          {
            label: 'Musicboxes',
            submenu: musicboxes.length <= 1 ? [] : musicboxes.map((musicbox, index) => {
              return {
                label: musicbox.typeWithUsername,
                accelerator: 'CmdOrCtrl+' + (index + 1),
                click: () => { this._selectors.changeMusicbox(musicbox.id) }
              }
            })
          }
        ])
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          { label: 'WMail Website', click: this._selectors.learnMore },
          { label: 'Privacy', click: this._selectors.privacy },
          { label: 'WMail on GitHub', click: this._selectors.learnMoreGithub },
          { label: 'Report a Bug', click: this._selectors.bugReport }
        ]
      }
    ])
  }

  /**
  * Builds and applies the musicboxes menu
  * @param musicboxes=autoget: the current list of musicboxes
  */
  updateApplicationMenu (musicboxes = musicboxStore.orderedMusicboxes()) {
    this._lastMusicboxes = musicboxes
    Menu.setApplicationMenu(this.build(musicboxes))
  }

  /* ****************************************************************************/
  // Change events
  /* ****************************************************************************/

  /**
  * Handles the musicboxes changing
  */
  handleMusicboxesChanged () {
    if (this._lastMusicboxes === null) {
      this.updateApplicationMenu()
    } else {
      // Real lazy compare tbh
      const nextMusicboxes = musicboxStore.orderedMusicboxes()
      const lastIdent = this._lastMusicboxes.map((m) => m.email).join('|')
      const nextIdent = nextMusicboxes.map((m) => m.email).join('|')
      if (lastIdent !== nextIdent) {
        this.updateApplicationMenu(nextMusicboxes)
      }
    }
  }
}

module.exports = AppPrimaryMenu
