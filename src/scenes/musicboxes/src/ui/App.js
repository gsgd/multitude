const React = require('react')
const flux = {
  mailbox: require('../stores/mailbox'),
  musicbox: require('../stores/musicbox'),
  google: require('../stores/google'),
  settings: require('../stores/settings')
}
const {
  ipcRenderer, remote: {shell}
} = window.nativeRequire('electron')
const {
  musicboxDispatch, navigationDispatch
} = require('../Dispatch')
const AppContent = require('./AppContent')
const TimerMixin = require('react-timer-mixin')
const constants = require('shared/constants')
const UnreadNotifications = require('../Notifications/UnreadNotifications')
const TrackNotifications = require('../Notifications/TrackNotifications')
const shallowCompare = require('react-addons-shallow-compare')
const Tray = require('./Tray')
const AppBadge = require('./AppBadge')
const appTheme = require('./appTheme')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default

const injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin()

navigationDispatch.bindIPCListeners()

module.exports = React.createClass({
  displayName: 'App',
  mixins: [TimerMixin],

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    this.forceFocusTO = null

    this.unreadNotifications = new UnreadNotifications()
    this.unreadNotifications.start()
    this.trackNotifications = new TrackNotifications()
    this.trackNotifications.start()

    flux.musicbox.S.listen(this.musicboxesChanged)
    flux.settings.S.listen(this.settingsChanged)
    flux.google.A.startPollingUpdates()

    musicboxDispatch.on('blurred', this.musicboxBlurred)

    ipcRenderer.on('download-completed', this.downloadCompleted)
  },

  componentWillUnmount () {
    this.unreadNotifications.stop()
    this.trackNotifications.stop()

    flux.musicbox.S.unlisten(this.musicboxesChanged)
    flux.settings.S.unlisten(this.settingsChanged)
    flux.google.A.stopPollingUpdates()

    ipcRenderer.removeListener('download-completed', this.downloadCompleted)

    musicboxDispatch.off('blurred', this.musicboxBlurred)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const settingsStore = flux.settings.S.getState()
    const musicboxStore = flux.musicbox.S.getState()
    return {
      activeMusicboxId: musicboxStore.activeMusicboxId(),
      messagesUnreadCount: musicboxStore.totalUnreadCountForAppBadge(),
      uiSettings: settingsStore.ui,
      traySettings: settingsStore.tray
    }
  },

  musicboxesChanged (store) {
    this.setState({
      activeMusicboxId: store.activeMusicboxId(),
      messagesUnreadCount: store.totalUnreadCountForAppBadge()
    })
    ipcRenderer.send('musicboxes-changed', {
      musicboxes: store.allMusicboxes().map((musicbox) => {
        return { id: musicbox.id, name: musicbox.name, email: musicbox.email }
      })
    })
  },

  settingsChanged (store) {
    this.setState({
      uiSettings: store.ui,
      traySettings: store.tray
    })
  },

  /* **************************************************************************/
  // IPC Events
  /* **************************************************************************/

  /**
  * Shows a notification of a completed download
  * @param evt: the event that fired
  * @param req: the request that came through
  */
  downloadCompleted (evt, req) {
    const notification = new window.Notification('Download Completed', {
      body: req.filename
    })
    notification.onclick = function () {
      shell.openItem(req.path) || shell.showItemInFolder(req.path)
    }
  },

  /* **************************************************************************/
  // Rendering Events
  /* **************************************************************************/

  /**
  * Handles a mailbox bluring by trying to refocus the mailbox
  * @param evt: the event that fired
  */
  musicboxBlurred (evt) {
    // Requeue the event to run on the end of the render cycle
    this.setTimeout(() => {
      const active = document.activeElement
      if (active.tagName === 'WEBVIEW') {
        // Nothing to do, already focused on mailbox
        this.clearInterval(this.forceFocusTO)
      } else if (active.tagName === 'BODY') {
        // Focused on body, just dip focus onto the webview
        this.clearInterval(this.forceFocusTO)
        musicboxDispatch.refocus()
      } else {
        // focused on some element in the ui, poll until we move back to body
        this.forceFocusTO = this.setInterval(() => {
          if (document.activeElement.tagName === 'BODY') {
            this.clearInterval(this.forceFocusTO)
            musicboxDispatch.refocus()
          }
        }, constants.REFOCUS_MUSICBOX_INTERVAL_MS)
      }
    }, constants.REFOCUS_MUSICBOX_INTERVAL_MS)
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {
      traySettings,
      uiSettings,
      messagesUnreadCount
    } = this.state

    // Update the app title
    if (uiSettings.showTitlebarCount) {
      if (messagesUnreadCount === 0) {
        document.title = 'Multitude'
      } else {
        document.title = `Multitude (${messagesUnreadCount})`
      }
    } else {
      document.title = 'Multitude'
    }

    return (
      <div>
        <MuiThemeProvider muiTheme={appTheme}>
          <AppContent />
        </MuiThemeProvider>
        {!traySettings.show ? undefined : (
          <Tray
            unreadCount={messagesUnreadCount}
            traySettings={traySettings} />
        )}
        {!uiSettings.showAppBadge ? undefined : (
          <AppBadge unreadCount={messagesUnreadCount} />
        )}
      </div>
    )
  }
})
