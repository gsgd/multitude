const MediaPlayer = require('./MediaPlayer')

class MFPStreaming extends MediaPlayer {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
   * @param {ChangeEmitter} ChangeEmitter
   */
  onLoaded (ChangeEmitter) {
    // console.log('onLoaded', ChangeEmitter, this)
    let interval = setInterval(() => {
      // console.log('onLoaded.interval', ChangeEmitter, this, document.querySelector('audio'))
      if (!document.querySelector('audio') || !window.player) { return }
      this.player = window.player
      this.player.audio.setAttribute('data-autoplay', 0)
      ChangeEmitter.subscribeToEvents()
      // console.log('onLoaded.interval.done', this.player)
      clearInterval(interval)
    }, 100)
  }

  /**
   * @param {ChangeEmitter} ChangeEmitter
   */
  onUnload (ChangeEmitter) {
    // console.log('onUnload', ChangeEmitter, this)
    this.handlePause()
    ChangeEmitter.handlePlaying()
  }

  /**
   * @param {ChangeEmitter} ChangeEmitter
   */
  subscribeToEvents (ChangeEmitter) {
    // console.log('subscribeToEvents', ChangeEmitter, this)
    this.player.audio.onchange = ChangeEmitter.throttleDisplayCurrentSong().bind(ChangeEmitter)
    this.player.audio.onplay = ChangeEmitter.handlePlaying.bind(ChangeEmitter)
    this.player.audio.onpause = ChangeEmitter.handlePlaying.bind(ChangeEmitter)
    this.player.audio.ontimeupdate = ChangeEmitter.throttleTimeUpdated().bind(ChangeEmitter)
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

  get playing () {
    return !this.player.audio.paused
  }

  get currentTrack () {
    const img = window.$('a[href="img/folder.jpg"]').attr('href')
    const selected = window.$('.multi-column .selected').text().split(': ')

    return {
      title: selected[0],
      artist: selected[1],
      album: 'Music For Programming',
      imageUrl: `http://musicforprogramming.net/${img}`
    }
  }

  get currentTime () {
    return {
      trackTime: Number(this.player.audio.currentTime).toFixed(),
      track: this.currentTrack.title
    }
  }

  get currentPageInfo () {
    return {
      location: window.location.pathname + window.location.search
    }
  }

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

  /* **************************************************************************/
  // Event handlers
  /* **************************************************************************/

  handleInit (evt, data) {
    // console.log('handleInit', evt, data)
    let interval = setInterval(() => {
      if (!document.querySelector('audio')) { return }
      // console.log('handleInit.interval', data)
      if (data.track_position) {
        const {trackTime, track} = data.track_position
        // console.log('handleInit.track_position', trackTime, track)
        if (track === this.currentTrack.title) {
          document.querySelector('audio').currentTime = trackTime
        }
      }
      if (data.auto_play) {
        this.handlePlay()
      }
      clearInterval(interval)
    }, 100)
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlayPause (evt, data) {
    this.player.playPause()
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlay (evt, data) {
    if (this.player.audio.paused) {
      this.player.playPause()
    }
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePause (evt, data) {
    if (!this.player.audio.paused) {
      this.player.playPause()
    }
  }

  handleNextTrack (evt, data) {
    this.player.ffw()
  }

  handlePreviousTrack (evt, data) {
    this.player.rew()
  }

}

module.exports = MFPStreaming
