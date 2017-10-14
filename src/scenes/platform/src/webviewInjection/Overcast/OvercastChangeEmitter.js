const ChangeEmitter = require('../ChangeEmitter/ChangeEmitter')

const { MUSICBOX_WINDOW_PLAYING, MUSICBOX_WINDOW_PAGE_CHANGED,
  MUSICBOX_WINDOW_TRACK_CHANGED } = require('shared/constants')

class OvercastChangeEmitter extends ChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  onLoaded (event) {
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, window.location.pathname)

    this.__data__.player = document.getElementById('audioplayer')
    if (this.player) {
      this.player.setAttribute('data-autoplay', 0)
      this.player.onloadstart = this.subscribeToEvents.bind(this)
    }
  }

  subscribeToEvents (event, data) {
    // console.log('subscribe');
    this.handleDisplayCurrentSong()
    this.player.onplay = this.handlePlaying.bind(this)
    this.player.onpause = this.handlePlaying.bind(this)
  }

  /* **************************************************************************/
  // Getters
  /* **************************************************************************/

  get player () {
    return this.__data__.player
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying (event, playing) {
    // console.log('handlePlaying', event, playing);
    this.transmitEvent(MUSICBOX_WINDOW_PLAYING, !this.player.paused)
  }

  handleDisplayCurrentSong () {
    // console.log('handleDisplayCurrentSong', event, data);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(() => {
      this.displayCurrentSong()
    }, 1000)
  }

  displayCurrentSong () {
    const img = window.$('meta[name="og:image"]').attr('content')
    // const title = window.$('meta[name="og:title"]').attr('content');
    const podcast = window.$('div.titlestack .caption2').text()
    const title = window.$('div.titlestack .title').text()

    const trackDetail = {
      title: title,
      artist: '',
      album: podcast,
      imageUrl: img
    }

    // console.log('handleDisplayCurrentSong', trackDetail);
    this.transmitEvent(MUSICBOX_WINDOW_TRACK_CHANGED, trackDetail)
  }

  handlePageChanged (event, data) {
    // console.log('handlePageChanged', event, data);
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, data.path)
  }
}

module.exports = OvercastChangeEmitter
