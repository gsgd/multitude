const React = require('react')
const { musicboxStore, musicboxActions } = require('../../stores/musicbox')
const { settingsStore } = require('../../stores/settings')
const { ipcRenderer } = window.nativeRequire('electron')
const {musicboxDispatch, navigationDispatch} = require('../../Dispatch')
const { WebView } = require('../../Components')
const MusicboxSearch = require('./MusicboxSearch')
const MusicboxTargetUrl = require('./MusicboxTargetUrl')
const shallowCompare = require('react-addons-shallow-compare')

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
    musicboxDispatch.on('trackChanged', this.handleTrackChanged)
    musicboxDispatch.on('tracklistChanged', this.handleTracklistChanged)
    musicboxDispatch.on('playingChanged', this.handlePlayingChanged)
    musicboxDispatch.on('pageChanged', this.handlePageChanged)
    musicboxDispatch.on('musicboxInit', this.handleMusicboxInit)
    musicboxDispatch.respond('fetch-process-memory-info', this.handleFetchProcessMemoryInfo)
    ipcRenderer.on('musicbox-toggle-dev-tools', this.handleIPCToggleDevTools)
    ipcRenderer.on('musicbox-window-find-start', this.handleIPCSearchStart)
    ipcRenderer.on('musicbox-window-find-next', this.handleIPCSearchNext)
    ipcRenderer.on('musicbox-window-navigate-back', this.handleIPCNavigateBack)
    ipcRenderer.on('musicbox-window-navigate-forward', this.handleIPCNavigateForward)
    ipcRenderer.on('musicbox-stop-all', this.handleIPCPlayPause)
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
    musicboxDispatch.off('trackChanged', this.handleTrackChanged)
    musicboxDispatch.off('tracklistChanged', this.handleTracklistChanged)
    musicboxDispatch.off('playingChanged', this.handlePlayingChanged)
    musicboxDispatch.off('pageChanged', this.handlePageChanged)
    musicboxDispatch.off('musicboxInit', this.handleMusicboxInit)
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
          isSearching: musicboxState.isSearchingMusicbox(musicboxId, service),
          // browserSrc: this.props.src || musicbox.pageUrl || musicbox.resolveServiceUrl(service)
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

  customJS () {
    this.refs[BROWSER_REF].getWebviewNode().executeJavaScript(this.props.controls.customJS)
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
  * Handles the deezer config updating
  * @param id: the id of the musicbox
  * @param updates: the updates to merge in
  */
  handleMusicboxInit (musicboxId) {
    // console.log('handleMusicboxInit', this.state.musicbox, this.props.musicboxId, musicboxId);
    this.refs[BROWSER_REF].send(this.props.controls.init, this.state.musicbox.init)
  },

  /**
  * Handles track changing
  * @param evt: the event that fired
  */
  handleTrackChanged (track) {
    // console.log('MusicboxTab.handleTrackChanged', track);
    musicboxActions.trackChanged(this.props.musicboxId, track)
  },

  /**
  * Handles tracklist changing
  * @param evt: the event that fired
  */
  handleTracklistChanged (tracklist) {
    // console.log('handleTrackChanged', track);
    musicboxActions.tracklistChanged(this.props.musicboxId, tracklist)
  },

  /**
  * Handles track changing
  * @param evt: the event that fired
  */
  handlePlayingChanged (playing) {
    // console.log('handlePlayingChanged', playing);
    musicboxActions.playingChanged(this.props.musicboxId, playing)
  },

  handlePageChanged (pageUrl) {
    // console.log('MusicboxTab.handlePageChanged', pageUrl)
    musicboxActions.pageChanged(this.props.musicboxId, pageUrl)
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
  dispatchBrowserIPCMessage (evt) {
    // console.log('dispatchBrowserIPCMessage', evt);
    const musicboxId = evt.path[0].id
    switch (evt.channel.type) {
      case 'open-settings': navigationDispatch.openSettings(); break
      case 'musicbox-window-init': musicboxDispatch.musicboxInit(musicboxId, evt.channel.data); break
      case 'musicbox-window-track-changed': musicboxDispatch.trackChanged(musicboxId, evt.channel.data); break
      case 'musicbox-window-tracklist-changed': musicboxDispatch.tracklistChanged(musicboxId, evt.channel.data); break
      case 'musicbox-window-playing': musicboxDispatch.playingChanged(musicboxId, evt.channel.data); break
      case 'musicbox-window-page-changed': musicboxDispatch.pageChanged(musicboxId, evt.channel.data); break
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

    // custom for the tab
    this.customJS()

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
  handleIPCPlayPause () {
    if (this.state.isActive) {
      // console.log(this.props.controls.playPause);
      this.refs[BROWSER_REF].send(this.props.controls.playPause, { })
    }
  },

  /**
  * Handle nextTrack event
  */
  handleIPCNextTrack () { 
    if (this.state.isActive) {
      this.refs[BROWSER_REF].send(this.props.controls.nextTrack, { })
    }
  },

  /**
  * Handle previousTrack event
  */
  handleIPCPreviousTrack () { 
    if (this.state.isActive) {
      this.refs[BROWSER_REF].send(this.props.controls.previousTrack, { })
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
            this.multiCallBrowserEvent([this.dispatchBrowserIPCMessage, webviewEventProps.ipcMessage], [evt])
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
