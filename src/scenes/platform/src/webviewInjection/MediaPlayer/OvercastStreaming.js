const injector = require('../injector')
const MediaPlayer = require('./MediaPlayer')

class OvercastStreaming extends MediaPlayer {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    super()
    // Inject some styles
    injector.injectStyle(`
      body {
        background: #f2f2f2 !important;
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
    const username = document.querySelector('body > div.container.pure-g > div > b')
    return username ? username.innerText : undefined
  }

  get playing () {
    return this.player && !this.player.paused
  }

  get currentTrack () {
    const title = document.querySelector('div.titlestack .title')
    const img = document.querySelector('img.art.fullart')
    const album = document.querySelector('div.titlestack .caption2').innerText
    if (!title || !album || !img) { return undefined }
    return {
      title: title.innerText,
      artist: '',
      album: album.innerText,
      imageUrl: img.getAttribute('src').startsWith('http') ? img.getAttribute('src') : `${window.location.protocol}//${window.location.hostname}${img.getAttribute('src')}`
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

  /**
   * @param {ChangeEmitter} ChangeEmitter
   */
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

  /**
   * @param {ChangeEmitter} ChangeEmitter
   */
  subscribeToEvents (ChangeEmitter) {
    // console.log('OvercastStreaming.subscribeToEvents', ChangeEmitter)
    this.player.onloadstart = ChangeEmitter.throttleDisplayCurrentSong().bind(ChangeEmitter)
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
