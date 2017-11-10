const React = require('react')
const MusicboxTab = require('../MusicboxTab')
// const Musicbox = require('shared/Models/Musicbox/Musicbox')
const { musicboxStore } = require('../../../stores/musicbox')
const { settingsStore } = require('../../../stores/settings')
// const { musicboxDispatch } = require('../../../Dispatch')
const URL = require('url')
const {
  remote: {shell}, ipcRenderer
} = require('electron')

const REF = 'musicbox_tab'

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxStreamingTab',
  propTypes: {
    musicboxId: React.PropTypes.string.isRequired,
    preload: React.PropTypes.string.isRequired
  },

  /* **************************************************************************/
  // Component lifecylce
  /* **************************************************************************/

  componentDidMount () {
    // Stores
    musicboxStore.listen(this.musicboxChanged)
    settingsStore.listen(this.settingsChanged)
  },

  componentWillUnmount () {
    // Stores
    musicboxStore.unlisten(this.musicboxChanged)
    settingsStore.unlisten(this.settingsChanged)
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.musicboxId !== nextProps.musicboxId) {
    }
  },

  /* **************************************************************************/
  // Data lifecylce
  /* **************************************************************************/

  getInitialState () {
    const settingsState = settingsStore.getState()
    return {
      musicboxCount: musicboxStore.getState().musicboxCount(),
      ui: settingsState.ui,
      os: settingsState.os
    }
  },

  musicboxChanged (musicboxState) {
    this.setState({
      musicboxCount: musicboxState.musicboxCount()
    })
  },

  settingsChanged (settingsState) {
    this.setState((prevState) => {
      const update = { os: settingsState.os }
      if (settingsState.ui !== prevState.ui) {
        this.refs[REF].send('window-icons-in-screen', {
          inscreen: !settingsState.ui.sidebarEnabled && !settingsState.ui.showTitlebar && process.platform === 'darwin'
        })
        update.ui = settingsState.ui
      }
      return update
    })
  },

  /* **************************************************************************/
  // Dispatcher Events
  /* **************************************************************************/

  /* **************************************************************************/
  // Browser Events
  /* **************************************************************************/

  /**
  * Dispatches browser IPC messages to the correct call
  * @param evt: the event that fired
  */
  dispatchFromBrowserIPCMessage (evt) {
    switch (evt.channel.type) {
      default: break
    }
  },

  /**
  * Handles the Browser DOM becoming ready
  */
  handleBrowserDomReady () {
    // UI Fixes
    const ui = this.state.ui
    this.refs[REF].send('window-icons-in-screen', {
      inscreen: !ui.sidebarEnabled && !ui.showTitlebar && process.platform === 'darwin'
    })
  },

  /**
  * Opens a new url in the correct way
  * @param url: the url to open
  */
  handleOpenNewWindow (url) {
    const purl = URL.parse(url, true)
    let mode = 'external'
    if (purl.host === 'inbox.overcast.com') {
      mode = 'source'
    } else if (purl.host === 'mail.overcast.com') {
      if (purl.query.ui === '2' || purl.query.view === 'om') {
        mode = 'tab'
      } else {
        mode = 'source'
      }
    }

    switch (mode) {
      case 'external':
        shell.openExternal(url, { activate: !this.state.os.openLinksInBackground })
        break
      case 'source':
        this.setState({ browserSrc: url })
        break
      case 'tab':
        ipcRenderer.send('new-window', { partition: 'persist:' + this.props.musicboxId, url: url })
        break
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    return (
      <MusicboxTab
        ref={REF}
        preload={this.props.preload}
        musicboxId={this.props.musicboxId}
        service={this.props.service}
        newWindow={(evt) => { this.handleOpenNewWindow(evt.url) }}
        domReady={this.handleBrowserDomReady}
        ipcMessage={this.dispatchFromBrowserIPCMessage} />
    )
  }
})
