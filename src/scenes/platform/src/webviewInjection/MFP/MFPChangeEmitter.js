const ChangeEmitter = require('../ChangeEmitter/ChangeEmitter')

const { MUSICBOX_WINDOW_PLAYING, MUSICBOX_WINDOW_PAGE_CHANGED,
  MUSICBOX_WINDOW_TRACK_CHANGED } = require('shared/constants')

class MFPChangeEmitter extends ChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  onLoaded (event) {
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, window.location.pathname)

    this.__data__.player = window.player
    if (this.player) {
      this.player.audio.setAttribute('data-autoplay', 0)
      this.player.audio.onloadstart = this.subscribeToEvents.bind(this)
    }
  }

  subscribeToEvents (event, data) {
    // console.log('subscribe', event, data, this)
    this.handleDisplayCurrentSong()
    this.player.audio.onchange = this.handleDisplayCurrentSong.bind(this)
    this.player.audio.onplay = this.handlePlaying.bind(this)
    this.player.audio.onpause = this.handlePlaying.bind(this)
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
    this.transmitEvent(MUSICBOX_WINDOW_PLAYING, !this.player.audio.paused)
  }

  handleDisplayCurrentSong () {
    // console.log('handleDisplayCurrentSong', event, data);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(() => {
      this.displayCurrentSong()
    }, 1000)
  }

  displayCurrentSong () {
    const img = window.$('a[href="img/folder.jpg"]').attr('href')
    const selected = window.$('.multi-column .selected').text().split(': ')

    const trackDetail = {
      title: selected[0],
      artist: selected[1],
      album: 'Music For Programming',
      imageUrl: `http://musicforprogramming.net/${img}`
    }

    // console.log('handleDisplayCurrentSong', trackDetail);
    this.transmitEvent(MUSICBOX_WINDOW_TRACK_CHANGED, trackDetail)
  }

  handlePageChanged (event, data) {
    // console.log('handlePageChanged', event, data);
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, data.path)
  }
}

module.exports = MFPChangeEmitter
