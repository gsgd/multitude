const injector = require('../injector')

class OvercastStreaming {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.__data__ = {}
    // Inject some styles
    injector.injectStyle(`
      body {
        background: #f2f2f2;
      }
    `)
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get player () {
    return this.__data__.player
  }

  set player (player) {
    this.__data__.player = player
  }

  get volume () {
    return this.player.volume
  }

  set volume (level) {
    this.player.volume = level
  }

  get username () {
    return undefined
  }

  get playing () {
    return !this.player.paused
  }

  get currentTrack () {
    const img = window.$('img.art.fullart').attr('src')
    return {
      title: window.$('div.titlestack .title').text(),
      artist: '',
      album: window.$('div.titlestack .caption2').text(),
      imageUrl: img.startsWith('http') ? img : `${window.location.protocol}//${window.location.hostname}${img}`
    }
  }

  get tracklist () {
    return undefined
  }

  get currentPage () {
    return window.location.pathname
  }

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

  onLoaded (ChangeEmitter) {
    console.log('OvercastStreaming.onLoaded')
    let interval = setInterval(() => {
      if (!document.getElementById('audioplayer')) { return }
      this.player = document.getElementById('audioplayer')
      console.log('OvercastStreaming.onLoaded', this.player)
      this.player.setAttribute('data-autoplay', 0)
      this.subscribeToEvents(ChangeEmitter)
      clearInterval(interval)
    }, 100)
  }

  subscribeToEvents (ChangeEmitter) {
    // console.log('OvercastStreaming.subscribeToEvents', ChangeEmitter)
    this.player.onloadstart = ChangeEmitter.handleDisplayCurrentSong.bind(ChangeEmitter)
    this.player.onplay = ChangeEmitter.handlePlaying.bind(ChangeEmitter)
    this.player.onpause = ChangeEmitter.handlePlaying.bind(ChangeEmitter)
  }

  /* **************************************************************************/
  // Event handlers
  /* **************************************************************************/

  /**
   * Handles media events
   */
  handlePlayPause () {
    this.player.paused ? this.handlePlay() : this.handlePause()
  }

  /**
   * Handles media events
   */
  handlePlay () {
    this.player.play()
  }

  /**
   * Handles media events
   */
  handlePause () {
    this.player.pause()
  }

  handleNextTrack () {
    document.getElementById('seekforwardbutton').click()
  }

  handlePreviousTrack () {
    document.getElementById('seekbackbutton').click()
  }

}

module.exports = OvercastStreaming
