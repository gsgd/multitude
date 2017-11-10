const React = require('react')
const { musicboxStore, musicboxActions } = require('../../stores/musicbox')
const { settingsStore } = require('../../stores/settings')
const { ipcRenderer } = require('electron')
const {musicboxDispatch, navigationDispatch} = require('../../Dispatch')
const { WebView } = require('../../Components')
const MusicboxSearch = require('./MusicboxSearch')
const MusicboxTargetUrl = require('./MusicboxTargetUrl')
const shallowCompare = require('react-addons-shallow-compare')

const {
  MUSICBOX_WINDOW_INIT, MUSICBOX_WINDOW_INIT_REQUEST,
  MUSICBOX_WINDOW_PAUSE, MUSICBOX_WINDOW_PLAY_PAUSE, MUSICBOX_WINDOW_FADE_TO,
  MUSICBOX_WINDOW_NEXT_TRACK, MUSICBOX_WINDOW_PREVIOUS_TRACK,
  MUSICBOX_WINDOW_TRACK_CHANGED, MUSICBOX_WINDOW_TRACKLIST_CHANGED,
  MUSICBOX_WINDOW_PLAYING, MUSICBOX_WINDOW_PAGE_CHANGED, MUSICBOX_WINDOW_USERNAME,
  MUSICBOX_WINDOW_TIME_UPDATED
} = require('shared/constants')

const BROWSER_REF = 'browser'
const SEARCH_REF = 'search'

module.exports = React.createClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxTab',
  propTypes: Object.assign({
    service: React.PropTypes.string.isRequired,
    preload: React.PropTypes.string,
    src: React.PropTypes.string,
    controls: React.PropTypes.object
  }, WebView.REACT_WEBVIEW_EVENTS.reduce((acc, name) => {
    acc[name] = React.PropTypes.func
    return acc
  }, {})),

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    // Stores
    musicboxStore.listen(this.musicboxesChanged)
    settingsStore.listen(this.settingsChanged)

    // Handle dispatch events
    musicboxDispatch.on('devtools', this.handleOpenDevTools)
    musicboxDispatch.on('refocus', this.handleRefocus)
    musicboxDispatch.on('load', this.handleReload)
    musicboxDispatch.on('reload', this.handleReload)
    musicboxDispatch.on('fadeTo', this.handleFadeTo)
    musicboxDispatch.on('playPause', this.handlePlayPause)
    musicboxDispatch.on('trackChanged', this.handleTrackChanged)
    musicboxDispatch.on('tracklistChanged', this.handleTracklistChanged)
    musicboxDispatch.on('playingChanged', this.handlePlayingChanged)
    musicboxDispatch.on('stopOthers', this.handleStopOthers)
    musicboxDispatch.on('pageChanged', this.handlePageChanged)
    musicboxDispatch.on('musicboxInitRequest', this.handleMusicboxInitRequest)
    musicboxDispatch.on('musicboxUsername', this.handleMusicboxUsername)
    musicboxDispatch.on('timeUpdated', this.handleTimeUpdated)
    musicboxDispatch.respond('fetch-process-memory-info', this.handleFetchProcessMemoryInfo)
    ipcRenderer.on('musicbox-toggle-dev-tools', this.handleIPCToggleDevTools)
    ipcRenderer.on('musicbox-window-find-start', this.handleIPCSearchStart)
    ipcRenderer.on('musicbox-window-find-next', this.handleIPCSearchNext)
    ipcRenderer.on('musicbox-window-navigate-back', this.handleIPCNavigateBack)
    ipcRenderer.on('musicbox-window-navigate-forward', this.handleIPCNavigateForward)
    ipcRenderer.on('musicbox-stop-all', this.handleIPCPause)
    ipcRenderer.on('musicbox-play-pause', this.handleIPCPlayPause)
    ipcRenderer.on('musicbox-next-track', this.handleIPCNextTrack)
    ipcRenderer.on('musicbox-previous-track', this.handleIPCPreviousTrack)

    // Autofocus on the first run
    if (this.state.isActive) {
      setTimeout(() => { this.refs[BROWSER_REF].focus() })
    }
  },

  componentWillUnmount () {
    // Stores
    musicboxStore.unlisten(this.musicboxesChanged)
    settingsStore.unlisten(this.settingsChanged)

    // Handle dispatch events
    musicboxDispatch.off('devtools', this.handleOpenDevTools)
    musicboxDispatch.off('refocus', this.handleRefocus)
    musicboxDispatch.off('load', this.handleReload)
    musicboxDispatch.off('reload', this.handleReload)
    musicboxDispatch.off('fadeTo', this.handleFadeTo)
    musicboxDispatch.off('playPause', this.handlePlayPause)
    musicboxDispatch.off('trackChanged', this.handleTrackChanged)
    musicboxDispatch.off('tracklistChanged', this.handleTracklistChanged)
    musicboxDispatch.off('playingChanged', this.handlePlayingChanged)
    musicboxDispatch.off('pageChanged', this.handlePageChanged)
    musicboxDispatch.off('musicboxInitRequest', this.handleMusicboxInit)
    musicboxDispatch.off('stopOthers', this.handleStopOthers)
    musicboxDispatch.off('pageChanged', this.handlePageChanged)
    musicboxDispatch.off('musicboxInitRequest', this.handleMusicboxInitRequest)
    musicboxDispatch.unrespond('fetch-process-memory-info', this.handleFetchProcessMemoryInfo)
    ipcRenderer.removeListener('musicbox-toggle-dev-tools', this.handleIPCToggleDevTools)
    ipcRenderer.removeListener('musicbox-window-find-start', this.handleIPCSearchStart)
    ipcRenderer.removeListener('musicbox-window-find-next', this.handleIPCSearchNext)
    ipcRenderer.removeListener('musicbox-window-navigate-back', this.handleIPCNavigateBack)
    ipcRenderer.removeListener('musicbox-window-navigate-forward', this.handleIPCNavigateForward)
    ipcRenderer.removeListener('musicbox-play-pause', this.handleIPCPlayPause)
    ipcRenderer.removeListener('musicbox-next-track', this.handleIPCNextTrack)
    ipcRenderer.removeListener('musicbox-previous-track', this.handleIPCPreviousTrack)
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.musicboxId !== nextProps.musicboxId || this.props.service !== nextProps.service || this.props.src !== nextProps.src) {
      this.setState(this.getInitialState(nextProps))
    }
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState (props = this.props) {
    const musicboxState = musicboxStore.getState()
    const musicbox = musicboxState.getMusicbox(props.musicboxId)
    const settingState = settingsStore.getState()

    const isActive = musicboxState.isActive(props.musicboxId, props.service)
    return {
      musicbox: musicbox,
      currentTrack: musicbox.currentTrack,
      isActive: isActive,
      isSearching: musicboxState.isSearchingMusicbox(props.musicboxId, props.service),
      browserSrc: props.src || musicbox.pageUrl || musicbox.resolveServiceUrl(props.service),
      language: settingState.language,
      focusedUrl: null
    }
  },

  musicboxesChanged (musicboxState) {
    const { musicboxId, service } = this.props
    const musicbox = musicboxState.getMusicbox(musicboxId)
    if (musicbox) {
      this.setState((prevState) => {
        const isActive = musicboxState.isActive(musicboxId, service)

        // Submit zoom state
        if (prevState.musicbox.zoomFactor !== musicbox.zoomFactor) {
          this.refs[BROWSER_REF].setZoomLevel(musicbox.zoomFactor)
        }

        // Return state
        return {
          musicbox: musicbox,
          isActive: isActive,
          isSearching: musicboxState.isSearchingMusicbox(musicboxId, service)
        }
      })
    } else {
      this.setState({ musicbox: null })
    }
  },

  settingsChanged (settingsState) {
    this.setState((prevState) => {
      if (settingsState.language !== prevState.language) {
        const prevLanguage = prevState.language
        const nextLanguage = settingsState.language

        if (prevLanguage.spellcheckerLanguage !== nextLanguage.spellcheckerLanguage || prevLanguage.secondarySpellcheckerLanguage !== nextLanguage.secondarySpellcheckerLanguage) {
          this.refs[BROWSER_REF].send('start-spellcheck', {
            language: nextLanguage.spellcheckerLanguage,
            secondaryLanguage: nextLanguage.secondarySpellcheckerLanguage
          })
        }

        return { language: nextLanguage }
      } else {
        return undefined
      }
    })
  },

  /* **************************************************************************/
  // Webview pass throughs
  /* **************************************************************************/

  send () { return this.refs[BROWSER_REF].send.apply(this, Array.from(arguments)) },
  sendWithResponse () { return this.refs[BROWSER_REF].sendWithResponse.apply(this, Array.from(arguments)) },

  /* **************************************************************************/
  // Dispatcher Events
  /* **************************************************************************/

  /**
  * Handles the inspector dispatch event
  * @param evt: the event that fired
  */
  handleOpenDevTools (evt) {
    // console.log('handleOpenDevTools', evt);
    if (evt.musicboxId === this.props.musicboxId) {
      if (!evt.service && this.state.isActive) {
        this.refs[BROWSER_REF].toggleDevTools()
      } else if (evt.service === this.props.service) {
        this.refs[BROWSER_REF].toggleDevTools()
      }
    }
  },

  /**
  * Handles refocusing the musicbox
  * @param evt: the event that fired
  */
  handleRefocus (evt) {
    if (!evt.musicboxId || !evt.service || (evt.musicboxId === this.props.musicboxId && evt.service === this.props.service)) {
      setTimeout(() => { this.refs[BROWSER_REF].focus() })
    }
  },

  /**
  * Handles reloading the musicbox
  * @param evt: the event that fired
  */
  handleReload (evt) {
    if (evt.musicboxId === this.props.musicboxId) {
      if (evt.allServices) {
        this.refs[BROWSER_REF].reload()
      } else if (!evt.service && this.state.isActive) {
        this.refs[BROWSER_REF].reload()
      } else if (evt.service === this.props.service) {
        this.refs[BROWSER_REF].reload()
      }
    }
  },

  /**
  * Fetches the webviews process memory info
  * @return promise
  */
  handleFetchProcessMemoryInfo () {
    return this.refs[BROWSER_REF].getProcessMemoryInfo().then((memoryInfo) => {
      return Promise.resolve({
        musicboxId: this.props.musicboxId,
        memoryInfo: memoryInfo
      })
    })
  },

  /**
  * Handles request for init data
  * @param musicboxId: int the id of the musicbox
  */
  handleMusicboxInitRequest ({musicboxId}) {
    console.log('handleMusicboxInit.1', this.props.musicboxId, musicboxId, this.state.musicbox.init)
    if (this.props.musicboxId !== musicboxId) { return }
    console.log('handleMusicboxInit.2', this.props.musicboxId, musicboxId, this.state.musicbox.init)
    this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_INIT, this.state.musicbox.init)
  },

  /**
  * Handles volume fading
  * @param evt: the event that fired
  */
  handleFadeTo (evt) {
    this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_FADE_TO, evt)
  },

  /**
  * Handles volume fading
  * @param evt: the event that fired
  */
  handlePlayPause ({musicboxId}) {
    // console.log('mbT.handlePlayPause', this.props.musicboxId, { musicboxId });
    if (this.props.musicboxId !== musicboxId) { return }
    this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_PLAY_PAUSE, {})
  },

  /**
   * Handles track changing
   * @param evt: the event that fired
   */
  handleMusicboxUsername ({musicboxId, username}) {
    // console.log('mbT.handleMusicboxUsername', this.props.musicboxId, { musicboxId, username });
    if (this.props.musicboxId !== musicboxId) { return }
    musicboxActions.setUsername(this.props.musicboxId, {musicboxId, username})
  },

  /**
   * Handles track changing
   * @param evt: the event that fired
   */
  handleTimeUpdated ({musicboxId, trackTime}) {
    // console.log('mbT.handleMusicboxUsername', this.props.musicboxId, { musicboxId, username });
    if (this.props.musicboxId !== musicboxId) { return }
    musicboxActions.setTrackTime(this.props.musicboxId, {musicboxId, trackTime})
  },

  /**
  * Handles track changing
  * @param evt: the event that fired
  */
  handleTrackChanged ({ musicboxId, trackDetail }) {
    // console.log('mbT.handleTrackChanged', this.props.musicboxId, { musicboxId, trackDetail });
    if (this.props.musicboxId !== musicboxId) { return }
    musicboxActions.trackChanged(this.props.musicboxId, { musicboxId, trackDetail })
  },

  /**
  * Handles tracklist changing
  * @param evt: the event that fired
  */
  handleTracklistChanged ({ musicboxId, tracklist }) {
    // console.log('handleTrackChanged', { musicboxId, tracklist });
    if (this.props.musicboxId !== musicboxId) { return }
    musicboxActions.tracklistChanged(this.props.musicboxId, { musicboxId, tracklist })
  },

  /**
  * Handles playing changing
  * @param evt: the event that fired
  */
  handlePlayingChanged ({ musicboxId, playing }) {
    // console.log('mbS.handlePlayingChanged', this.props.musicboxId, { musicboxId, playing });
    if (this.props.musicboxId !== musicboxId) { return }

    musicboxActions.playingChanged(this.props.musicboxId, { musicboxId, playing })
    // notify other musicboxes that we don't want them to play
    if (playing) {
      musicboxDispatch.stopOthers(musicboxId)
    }
  },

  /**
  * Stop other player
  * @param evt: the event that fired
  */
  handleStopOthers ({ musicboxId }) {
    // console.log('handleStopOthers', { musicboxId });
    if (this.props.musicboxId !== musicboxId) {
      this.send(MUSICBOX_WINDOW_PAUSE)
    }
  },

  handlePageChanged ({ musicboxId, pageUrl }) {
    // console.log('MusicboxTab.handlePageChanged', pageUrl)
    if (this.props.musicboxId !== musicboxId) { return }
    musicboxActions.pageChanged(this.props.musicboxId, { musicboxId, pageUrl })
  },

  /* **************************************************************************/
  // Browser Events
  /* **************************************************************************/

  /**
  * Calls multiple handlers for browser events
  * @param callers: a list of callers to execute
  * @param args: the arguments to supply them with
  */
  multiCallBrowserEvent (callers, args) {
    callers.forEach((caller) => {
      if (caller) {
        caller.apply(this, args)
      }
    })
  },

  /* **************************************************************************/
  // Browser Events : Dispatcher
  /* **************************************************************************/

  /**
  * Dispatches browser IPC messages to the correct call
  * @param evt: the event that fired
  */
  dispatchFromBrowserIPCMessage (evt) {
    console.log('dispatchFromBrowserIPCMessage', evt.path[0].id, evt.channel.type, evt.channel.data)
    const musicboxId = evt.path[0].id
    switch (evt.channel.type) {
      case 'open-settings': navigationDispatch.openSettings(); break
      case MUSICBOX_WINDOW_INIT_REQUEST: this.handleMusicboxInitRequest({musicboxId}); break
      // case MUSICBOX_WINDOW_INIT_REQUEST: musicboxDispatch.musicboxInitRequest(musicboxId, evt.channel.data); break
      case MUSICBOX_WINDOW_TRACK_CHANGED: musicboxDispatch.trackChanged(musicboxId, evt.channel.data); break
      case MUSICBOX_WINDOW_TRACKLIST_CHANGED: musicboxDispatch.tracklistChanged(musicboxId, evt.channel.data); break
      case MUSICBOX_WINDOW_PLAYING: musicboxDispatch.playingChanged(musicboxId, evt.channel.data); break
      case MUSICBOX_WINDOW_PAGE_CHANGED: musicboxDispatch.pageChanged(musicboxId, evt.channel.data); break
      case MUSICBOX_WINDOW_USERNAME:
        musicboxDispatch.musicboxUsername(musicboxId, evt.channel.data)
        break
      case MUSICBOX_WINDOW_TIME_UPDATED:
        musicboxDispatch.timeUpdated(musicboxId, evt.channel.data)
        break
      default: break
    }
  },

  /* **************************************************************************/
  // Browser Events
  /* **************************************************************************/

  /**
  * Handles the Browser DOM becoming ready
  */
  handleBrowserDomReady () {
    // Push the settings across
    this.refs[BROWSER_REF].setZoomLevel(this.state.musicbox.zoomFactor)

    // Language
    const languageSettings = this.state.language
    if (languageSettings.spellcheckerEnabled) {
      this.refs[BROWSER_REF].send('start-spellcheck', {
        language: languageSettings.spellcheckerLanguage,
        secondaryLanguage: languageSettings.secondarySpellcheckerLanguage
      })
    }

    // Push the custom user content
    if (this.state.musicbox.hasCustomCSS || this.state.musicbox.hasCustomJS) {
      this.refs[BROWSER_REF].send('inject-custom-content', {
        css: this.state.musicbox.customCSS,
        js: this.state.musicbox.customJS
      })
    }
  },

  /**
  * Until https://github.com/electron/electron/issues/6958 is fixed we need to
  * be really agressive about setting zoom levels
  */
  handleZoomFixEvent () {
    this.refs[BROWSER_REF].setZoomLevel(this.state.musicbox.zoomFactor)
  },

  /**
  * Updates the target url that the user is hovering over
  * @param evt: the event that fired
  */
  handleBrowserUpdateTargetUrl (evt) {
    this.setState({ focusedUrl: evt.url !== '' ? evt.url : null })
  },

  /* **************************************************************************/
  // Browser Events : Navigation
  /* **************************************************************************/

  /**
  * Handles a browser preparing to navigate
  * @param evt: the event that fired
  */
  handleBrowserWillNavigate (evt) {
    // the lamest protection again dragging files into the window
    // but this is the only thing I could find that leaves file drag working
    if (evt.url.indexOf('file://') === 0) {
      this.setState({ browserSrc: this.state.musicbox.resolveServiceUrl(this.props.service) })
    }
  },

  /* **************************************************************************/
  // Browser Events : Focus
  /* **************************************************************************/

  /**
  * Handles a browser focusing
  */
  handleBrowserFocused () {
    musicboxDispatch.focused(this.props.musicboxId, this.props.service)
  },

  /**
  * Handles a browser un-focusing
  */
  handleBrowserBlurred () {
    musicboxDispatch.blurred(this.props.musicboxId, this.props.service)
  },

  /* **************************************************************************/
  // UI Events : Search
  /* **************************************************************************/

  /**
  * Handles the search text changing
  * @param str: the search string
  */
  handleSearchChanged (str) {
    if (str.length) {
      this.refs[BROWSER_REF].findInPage(str)
    } else {
      this.refs[BROWSER_REF].stopFindInPage('clearSelection')
    }
  },

  /**
  * Handles searching for the next occurance
  */
  handleSearchNext (str) {
    if (str.length) {
      this.refs[BROWSER_REF].findInPage(str, { findNext: true })
    }
  },

  /**
  * Handles cancelling searching
  */
  handleSearchCancel () {
    musicboxActions.stopSearchingMusicbox(this.props.musicboxId, this.props.service)
    this.refs[BROWSER_REF].stopFindInPage('clearSelection')
  },

  /* **************************************************************************/
  // IPC Events
  /* **************************************************************************/

  /**
  * Handles an ipc search start event coming in
  */
  handleIPCSearchStart () {
    if (this.state.isActive) {
      setTimeout(() => { this.refs[SEARCH_REF].focus() })
    }
  },

  /**
  * Handles an ipc search next event coming in
  */
  handleIPCSearchNext () {
    if (this.state.isActive) {
      this.handleSearchNext(this.refs[SEARCH_REF].searchQuery())
    }
  },

  /**
  * Handles navigating the musicbox back
  */
  handleIPCNavigateBack () {
    if (this.state.isActive) {
      this.refs[BROWSER_REF].navigateBack()
    }
  },

  /**
  * Handles navigating the musicbox forward
  */
  handleIPCNavigateForward () {
    if (this.state.isActive) {
      this.refs[BROWSER_REF].navigateForward()
    }
  },

  /**
  * Handle playPause event
  */
  handleIPCToggleDevTools () {
    if (this.state.isActive) {
      this.refs[BROWSER_REF].toggleDevTools()
    }
  },

  /**
  * Handle playPause event
  */
  handleIPCPlayPause ({ musicboxId }) {
    // console.log('handleIPCPlayPause', musicboxId)
    if (this.state.isActive) {
      this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_PLAY_PAUSE, { })
    }
  },

  /**
  * Handle playPause event
  */
  handleIPCPause () {
    if (this.state.isActive) {
      this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_PAUSE, { })
    }
  },

  /**
  * Handle nextTrack event
  */
  handleIPCNextTrack () {
    if (this.state.isActive) {
      this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_NEXT_TRACK, { })
    }
  },

  /**
  * Handle previousTrack event
  */
  handleIPCPreviousTrack () {
    if (this.state.isActive) {
      this.refs[BROWSER_REF].send(MUSICBOX_WINDOW_PREVIOUS_TRACK, { })
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * Renders the app
  */
  render () {
    // Extract our props and pass props
    const { isActive, browserSrc, focusedUrl, isSearching, musicbox } = this.state
    const { musicboxId, className, preload, ...passProps } = this.props
    delete passProps.service
    const webviewEventProps = WebView.REACT_WEBVIEW_EVENTS.reduce((acc, name) => {
      acc[name] = this.props[name]
      delete passProps[name]
      return acc
    }, {})

    // See if we should render
    if (!musicbox) { return false }

    // Prep Clasnames and running functions
    const saltedClassName = [
      className,
      'ReactComponent-MusicboxTab',
      isActive ? 'active' : undefined
    ].filter((c) => !!c).join(' ')
    const zoomFixFn = musicbox.zoomFactor === 1 ? undefined : this.handleZoomFixEvent

    if (isActive) {
      setTimeout(() => { this.refs[BROWSER_REF].focus() })
    }

    // console.log('MusicboxTab.render', browserSrc);
    return (
      <div className={saltedClassName}>
        <WebView
          ref={BROWSER_REF}
          preload={preload}
          partition={'persist:' + musicboxId}
          src={browserSrc}
          id={musicboxId}
          plugins

          {...webviewEventProps}
          loadCommit={(evt) => {
            this.multiCallBrowserEvent([zoomFixFn, webviewEventProps.loadCommit], [evt])
          }}
          didGetResponseDetails={(evt) => {
            this.multiCallBrowserEvent([zoomFixFn, webviewEventProps.didGetResponseDetails], [evt])
          }}
          didNavigate={(evt) => {
            this.multiCallBrowserEvent([zoomFixFn, webviewEventProps.didNavigate], [evt])
          }}
          didNavigateInPage={(evt) => {
            this.multiCallBrowserEvent([zoomFixFn, webviewEventProps.didNavigateInPage], [evt])
          }}
          domReady={(evt) => {
            this.multiCallBrowserEvent([this.handleBrowserDomReady, webviewEventProps.domReady], [evt])
          }}
          ipcMessage={(evt) => {
            this.multiCallBrowserEvent([this.dispatchFromBrowserIPCMessage, webviewEventProps.ipcMessage], [evt])
          }}
          willNavigate={(evt) => {
            this.multiCallBrowserEvent([zoomFixFn, this.handleBrowserWillNavigate, webviewEventProps.willNavigate], [evt])
          }}
          focus={(evt) => {
            this.multiCallBrowserEvent([this.handleBrowserFocused, webviewEventProps.focus], [evt])
          }}
          blur={(evt) => {
            this.multiCallBrowserEvent([this.handleBrowserBlurred, webviewEventProps.blur], [evt])
          }}
          updateTargetUrl={(evt) => {
            this.multiCallBrowserEvent([this.handleBrowserUpdateTargetUrl, webviewEventProps.updateTargetUrl], [evt])
          }} />
        <MusicboxTargetUrl url={focusedUrl} />
        <MusicboxSearch
          ref={SEARCH_REF}
          isSearching={isSearching}
          onSearchChange={this.handleSearchChanged}
          onSearchNext={this.handleSearchNext}
          onSearchCancel={this.handleSearchCancel} />
      </div>
    )
  }
})
