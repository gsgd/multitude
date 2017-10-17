const WMailWindow = require('./WMailWindow')
const AuthGoogle = require('../AuthGoogle')
const path = require('path')
const MusicboxesSessionManager = require('./MusicboxesSessionManager')
const settingStore = require('../stores/settingStore')

const MAILBOXES_DIR = path.resolve(path.join(__dirname, '/../../../scenes/musicboxes'))
const ALLOWED_URLS = new Set([
  'file://' + path.join(MAILBOXES_DIR, 'musicboxes.html'),
  'file://' + path.join(MAILBOXES_DIR, 'offline.html')
])

class MusicboxesWindow extends WMailWindow {

  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  /**
  * @param analytics: the analytics object
  */
  constructor (analytics) {
    super(analytics, {
      screenLocationNS: 'musicbox_window_state'
    })
    this.heartbeatInterval = null
    this.authGoogle = new AuthGoogle()
    this.sessionManager = new MusicboxesSessionManager(this)
  }

  /**
  * @param url: the url to load
  * @param hidden=false: true to start the window hidden
  */
  start (hidden = false) {
    super.start('file://' + path.join(MAILBOXES_DIR, 'musicboxes.html'), {
      show: !hidden,
      minWidth: 770,
      minHeight: 300,
      fullscreenable: true,
      titleBarStyle: settingStore.ui.showTitlebar ? 'default' : 'hidden',
      title: 'WMail',
      backgroundColor: '#f2f2f2',
      selectedTextBackgroundColor: '#929292',
      webPreferences: {
        nodeIntegration: true,
        plugins: true
      }
    })
  }

  /* ****************************************************************************/
  // Creation & Closing
  /* ****************************************************************************/

  createWindow () {
    super.createWindow.apply(this, Array.from(arguments))

    // We're locking on to our window. This stops file drags redirecting the page
    this.window.webContents.on('will-navigate', (evt, url) => {
      if (!ALLOWED_URLS.has(url)) {
        evt.preventDefault()
      }
    })

    this.analytics.appOpened(this.window)
    this.heartbeatInterval = setInterval(() => {
      this.analytics.appHeartbeat(this.window)
    }, 1000 * 60 * 5) // 5 mins
  }

  destroyWindow (evt) {
    super.destroyWindow(evt)
    clearInterval(this.heartbeatInterval)
  }

  /* ****************************************************************************/
  // Musicbox Actions
  /* ****************************************************************************/

  /**
  * Reloads the webview
  */
  reload () {
    this.window.webContents.send('prepare-reload', {})
    setTimeout(() => {
      this.window.webContents.reload()
    }, 250)
  }

  /**
  * Zooms the current musicbox in
  */
  musicboxZoomIn () {
    this.window.webContents.send('musicbox-zoom-in', { })
  }

  /**
  * Zooms the current musicbox out
  */
  musicboxZoomOut () {
    this.window.webContents.send('musicbox-zoom-out', { })
  }

  /**
  * Resets the zoom on the current musicbox
  */
  musicboxZoomReset () {
    this.window.webContents.send('musicbox-zoom-reset', { })
  }

  /**
  * Switches musicbox
  * @param musicboxId: the id of the musicbox to switch to
  */
  switchMusicbox (musicboxId) {
    this.window.webContents.send('switch-musicbox', { musicboxId: musicboxId })
  }

  /**
  * Switches to the previous musicbox
  */
  switchPrevMusicbox () {
    this.window.webContents.send('switch-musicbox', { prev: true })
  }

  /**
  * Switches to the next musicbox
  */
  switchNextMusicbox () {
    this.window.webContents.send('switch-musicbox', { next: true })
  }

  stopAll () {
    this.window.webContents.send('musicbox-stop-all', { })
  }

  playPause () {
    this.window.webContents.send('musicbox-play-pause', { })
  }

  nextTrack () {
    this.window.webContents.send('musicbox-next-track', { })
  }

  previousTrack () {
    this.window.webContents.send('musicbox-previous-track', { })
  }

  /**
  * Launches the preferences modal
  */
  launchPreferences () {
    this.window.webContents.send('launch-settings', { })
  }

  /**
  * Toggles the sidebar
  */
  toggleSidebar () {
    this.window.webContents.send('toggle-sidebar', { })
  }

  /**
  * Toggles the app menu
  */
  toggleAppMenu () {
    this.window.webContents.send('toggle-app-menu', { })
  }

  /**
  * Toggles the dev tools
  */
  toggleEmbeddedDevTools () {
    this.window.webContents.send('musicbox-toggle-dev-tools', { })
  }

  /**
  * Tells the frame a download is complete
  * @param path: the path of the saved file
  * @param filename: the name of the file
  */
  downloadCompleted (path, filename) {
    this.window.webContents.send('download-completed', {
      path: path,
      filename: filename
    })
  }

  /**
  * Starts finding in the musicboxes window
  */
  findStart () {
    this.window.webContents.send('musicbox-window-find-start', { })
  }

  /**
  * Finds the next in the musicbox window
  */
  findNext () {
    this.window.webContents.send('musicbox-window-find-next', { })
  }

  /**
  * Tells the active musicbox to navigate back
  */
  navigateMusicboxBack () {
    this.window.webContents.send('musicbox-window-navigate-back', { })
  }

  /**
  * Tells the active musicbox to navigate back
  */
  navigateMusicboxForward () {
    this.window.webContents.send('musicbox-window-navigate-forward', { })
  }

  /**
  * Opens a mailto link
  * @param mailtoLink: the link to open
  */
  openMailtoLink (mailtoLink) {
    this.window.webContents.send('open-mailto-link', { mailtoLink: mailtoLink })
  }

}

module.exports = MusicboxesWindow
