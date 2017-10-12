const React = require('react')
const MusicboxTab = require('../MusicboxTab')
const Musicbox = require('shared/Models/Musicbox/Musicbox')
const { composeStore, composeActions } = require('../../../stores/compose')
const { musicboxStore } = require('../../../stores/musicbox')
const { settingsStore } = require('../../../stores/settings')
const { deezerActions } = require('../../../stores/deezer')
const { musicboxDispatch } = require('../../../Dispatch')
const URL = window.nativeRequire('url')
const {
  remote: {shell}, ipcRenderer
} = window.nativeRequire('electron')

const REF = 'musicbox_tab'

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'DeezerMusicboxStreamingTab',
  propTypes: {
    musicboxId: React.PropTypes.string.isRequired
  },

  /* **************************************************************************/
  // Component lifecylce
  /* **************************************************************************/

  componentDidMount () {
    // Stores
    composeStore.listen(this.composeChanged)
    musicboxStore.listen(this.musicboxChanged)
    settingsStore.listen(this.settingsChanged)

    // Handle dispatch events
    musicboxDispatch.on('openMessage', this.handleOpenMessage)
    musicboxDispatch.on('fadeTo', this.handleFadeTo)
    musicboxDispatch.on('musicboxInit', this.handleInitDeezer)
    musicboxDispatch.respond('get-deezer-unread-count:' + this.props.musicboxId, this.handleGetDeezerUnreadCount)

    // Fire an artifical compose change in case the compose event is waiting
    this.composeChanged(composeStore.getState())
  },

  componentWillUnmount () {
    // Stores
    composeStore.unlisten(this.composeChanged)
    musicboxStore.unlisten(this.musicboxChanged)
    settingsStore.unlisten(this.settingsChanged)

    // Handle dispatch events
    musicboxDispatch.off('openMessage', this.handleOpenMessage)
    musicboxDispatch.off('fadeTo', this.handleFadeTo)
    musicboxDispatch.off('musicboxInit', this.handleInitDeezer)
    musicboxDispatch.unrespond('get-deezer-unread-count:' + this.props.musicboxId, this.handleGetDeezerUnreadCount)
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.musicboxId !== nextProps.musicboxId) {
      musicboxDispatch.unrespond('get-deezer-unread-count:' + this.props.musicboxId, this.handleGetDeezerUnreadCount)
      musicboxDispatch.respond('get-deezer-unread-count:' + nextProps.musicboxId, this.handleGetDeezerUnreadCount)
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

  composeChanged (composeState) {
    // Look to see if we should dispatch a compose event down to the UI
    // We clear this directly here rather resetting state
    if (composeState.composing) {
      if (this.state.musicboxCount === 1 || composeState.targetMusicbox === this.props.musicboxId) {
        this.refs[REF].send('compose-message', composeState.getMessageInfo())
        composeActions.clearCompose.defer()
      }
    }
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

  /**
  * Handles opening a new message
  * @param evt: the event that fired
  */
  handleOpenMessage (evt) {
    if (evt.musicboxId === this.props.musicboxId) {
      this.refs[REF].send('open-message', { messageId: evt.messageId, threadId: evt.threadId })
    }
  },

  /**
  * Handles volume fade
  * @param evt: the event that fired
  */
  handleFadeTo (evt) {
    this.refs[REF].send('musicbox-fade-to', evt)
  },

  controls () {
    return {
      customJS: "setTimeout(function() { window.dzPlayer.isAdvertisingAllowed = function() { return false; }; $('.ads').remove(); $('body').removeClass('has-ads-bottom').removeClass('has-ads-top')}, 1000)",
      init: 'deezer-init',
      pause: 'deezer-pause',
      playPause: 'deezer-play-pause',
      nextTrack: 'deezer-next-track',
      previousTrack: 'deezer-previous-track'
    }
  },

  /**
  * Fetches the gmail unread count
  * @return promise
  */
  handleGetDeezerUnreadCount () {
    return this.refs[REF].sendWithResponse('get-deezer-unread-count', {}, 1000)
  },

  /**
  * Sends the init data
  */
  handleInitDeezer (data) {
    // console.log('handleInitDeezer', data);
    return this.refs[REF].send('deezer-init', data)
  },

  /* **************************************************************************/
  // Browser Events
  /* **************************************************************************/

  /**
  * Dispatches browser IPC messages to the correct call
  * @param evt: the event that fired
  */
  dispatchFromBrowserIPCMessage (evt) {
    switch (evt.channel.type) {
      case 'unread-count-changed': deezerActions.suggestSyncMusicboxUnreadCount(this.props.musicboxId); break
      case 'js-new-window': this.handleBrowserJSNewWindow(evt); break
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
    if (purl.host === 'inbox.deezer.com') {
      mode = 'source'
    } else if (purl.host === 'mail.deezer.com') {
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
        preload='../platform/webviewInjection/deezerStreaming'
        musicboxId={this.props.musicboxId}
        service={Musicbox.SERVICES.DEFAULT}
        newWindow={(evt) => { this.handleOpenNewWindow(evt.url) }}
        domReady={this.handleBrowserDomReady}
        controls={this.controls()}
        ipcMessage={this.dispatchFromBrowserIPCMessage} />
    )
  }
})
