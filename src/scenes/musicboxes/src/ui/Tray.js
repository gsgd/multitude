const electron = require('electron')
const { ipcRenderer, remote } = electron
const { Tray, Menu, nativeImage } = remote
const React = require('react')
const { musicboxDispatch } = require('../Dispatch')
const { musicboxActions, musicboxStore } = require('../stores/musicbox')
const { composeActions } = require('../stores/compose')
const { BLANK_PNG } = require('shared/b64Assets')
const { TrayRenderer } = require('../Components')
const navigationDispatch = require('../Dispatch/navigationDispatch')
const uuid = require('uuid')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/
  displayName: 'Tray',

  // Pretty strict on updating. If you're changing these, change shouldComponentUpdate :)
  propTypes: {
    activeTrack: React.PropTypes.object.isRequired,
    activeMusicboxId: React.PropTypes.string.isRequired,
    traySettings: React.PropTypes.object.isRequired
  },
  statics: {
    platformSupportsDpiMultiplier: () => {
      return process.platform === 'darwin' || process.platform === 'linux'
    }
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxStore.listen(this.musicboxesChanged)

    this.appTray = new Tray(nativeImage.createFromDataURL(BLANK_PNG))
    if (process.platform === 'win32') {
      this.appTray.on('double-click', () => {
        ipcRenderer.send('toggle-musicbox-visibility-from-tray')
      })
      this.appTray.on('click', () => {
        ipcRenderer.send('toggle-musicbox-visibility-from-tray')
      })
    } else if (process.platform === 'linux') {
      // On platforms that have app indicator support - i.e. ubuntu clicking on the
      // icon will launch the context menu. On other linux platforms the context
      // menu is opened on right click. For app indicator platforms click event
      // is ignored
      this.appTray.on('click', () => {
        ipcRenderer.send('toggle-musicbox-visibility-from-tray')
      })
    }
  },

  componentWillUnmount () {
    musicboxStore.unlisten(this.musicboxesChanged)

    if (this.appTray) {
      this.appTray.destroy()
      this.appTray = null
    }
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return Object.assign({}, this.generateMenuTrackDetails())
  },

  musicboxesChanged (store) {
    this.setState(this.generateMenuTrackDetails(store))
  },

  /**
  * Generates the current tracks from the musicboxes store
  * @param store=autogen: the musicbox store
  * @return { menuTrackMessages, menuTrackMessagesSig } with menuTrackMessages
  * being an array of musicboxes with menu items prepped to display and menuTrackMessagesSig
  * being a string hash of these to compare
  */
  generateMenuTrackDetails (store = musicboxStore.getState()) {
    const menuItems = store.musicboxIds().map((musicboxId) => {
      const musicbox = store.getMusicbox(musicboxId)
      const track = musicbox.currentTrack

      if (!track) {
        return {
          label: `${musicbox.displayName || musicbox.title}`,
          click: (e) => {
            ipcRenderer.send('focus-app', { })
            musicboxActions.changeActive(musicboxId)
          }
        }
      }
      const playPause = musicbox.isPlaying ? 'Pause' : 'Play'
      return {
        label: musicbox.typeWithUsername,
        submenu: [
          {
            id: `${musicboxId}:${track.title}:${playPause}`, // used for update tracking
            label: `${playPause}: ${track.title} – ${track.artist || track.album}`,
            click: (e) => {
              ipcRenderer.send('focus-app', { })
              musicboxActions.changeActive(musicboxId)
              musicboxDispatch.musicboxPlayPause(musicboxId)
            }
          }
        ]
      }
    })

    const sig = menuItems
      .map((musicboxItem) => musicboxItem.submenu.map((item) => item.id).join('|'))
      .join('|')

    return { menuTrackMessages: menuItems, menuTrackMessagesSig: sig }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate: function (nextProps, nextState) {
    if (this.props.activeTrack.title !== nextProps.activeTrack.title) { return true }
    if (this.props.activeMusicboxId !== nextProps.activeMusicboxId) { return true }
    if (this.state.menuTrackMessagesSig !== nextState.menuTrackMessagesSig) { return true }

    return [
      'unreadColor',
      'unreadBackgroundColor',
      'readColor',
      'readBackgroundColor',
      'showActiveTrack',
      'dpiMultiplier'
    ].findIndex((k) => {
      return this.props.traySettings[k] !== nextProps.traySettings[k]
    }) !== -1
  },

  /**
  * @return the tooltip string for the tray icon
  */
  renderTooltip () {
    const {activeTrack} = this.props
    return activeTrack.title ? `${activeTrack.title} – ${activeTrack.artist || activeTrack.album}` : 'No track currently playing'
  },

  /**
  * @return the context menu for the tray icon
  */
  renderContextMenu () {
    let trackDetails = []
    if (this.state.menuTrackMessages.length === 1) { // Only one account
      trackDetails = this.state.menuTrackMessages[0].submenu
    } else if (this.state.menuTrackMessages.length > 1) { // Multiple accounts
      trackDetails = this.state.menuTrackMessages
    }

    const {activeMusicboxId} = this.props

    // Build the template
    let template = [
      {
        label: 'Toggle Play / Pause',
        click: (e) => {
          musicboxDispatch.musicboxPlayPause(activeMusicboxId)
        }
      },
      { label: this.renderTooltip(), enabled: false },
      { type: 'separator' }
    ]

    if (trackDetails.length) {
      template = template.concat(trackDetails)
      template.push({ type: 'separator' })
    }

    template = template.concat([
      {
        label: 'Show / Hide',
        click: (e) => {
          ipcRenderer.send('toggle-musicbox-visibility-from-tray')
        }
      },
      {
        label: 'News',
        click: (e) => {
          navigationDispatch.openNews()
          ipcRenderer.send('focus-app', { })
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: (e) => {
          ipcRenderer.send('quit-app')
        }
      }
    ])

    return Menu.buildFromTemplate(template)
  },

  /**
  * @return the tray icon size
  */
  trayIconSize () {
    switch (process.platform) {
      case 'darwin': return 22
      case 'win32': return 16
      case 'linux': return 32 * this.props.traySettings.dpiMultiplier
      default: return 32
    }
  },

  /**
  * @return the pixel ratio
  */
  trayIconPixelRatio () {
    switch (process.platform) {
      case 'darwin': return this.props.traySettings.dpiMultiplier
      default: return 1
    }
  },

  render () {
    const { traySettings } = this.props

    const renderId = uuid.v4()
    this.renderId = renderId

    const trayConfig = {
      pixelRatio: this.trayIconPixelRatio(),
      size: this.trayIconSize()
    }

    TrayRenderer.renderNativeImage(Object.assign({}, trayConfig, {
      color: traySettings.color,
      backgroundColor: traySettings.backgroundColor
    })).then((image) => {
      if (renderId !== this.renderId) { return }
      this.appTray.setImage(image)
      this.appTray.setToolTip(this.renderTooltip())
      this.appTray.setContextMenu(this.renderContextMenu())
    })
    TrayRenderer.renderNativeImage(Object.assign({}, trayConfig, {
      color: traySettings.pressedColor,
      backgroundColor: traySettings.pressedBackgroundColor
    })).then((image) => {
      if (renderId !== this.renderId) { return }
      this.appTray.setPressedImage(image)
    })

    return null
  }
})
