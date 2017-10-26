class OvercastStreaming {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.__data__ = {}
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get player () {
    return this.__data__.player
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
    return {
      title: window.$('div.titlestack .title').text(),
      artist: '',
      album: window.$('div.titlestack .caption2').text(),
      imageUrl: window.$('meta[name="og:image"]').attr('content')
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
    // console.log('OvercastStreaming.onLoaded')
    let interval = setInterval(() => {
      if (!document.getElementById('audioplayer')) { return }
      this.__data__.player = document.getElementById('audioplayer')
      // console.log('OvercastStreaming.onLoaded', this.player)
      this.player.setAttribute('data-autoplay', 0)
      this.player.onloadstart = ChangeEmitter.subscribeToEvents.bind(ChangeEmitter)
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
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlayPause () {
    this.player.paused ? this.handlePlay() : this.handlePause()
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlay () {
    this.player.play()
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
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
