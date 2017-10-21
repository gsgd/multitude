const ChangeEmitter = require('../ChangeEmitter/ChangeEmitter')

const { MUSICBOX_WINDOW_PLAYING, MUSICBOX_WINDOW_PAGE_CHANGED,
  MUSICBOX_WINDOW_TRACK_CHANGED, MUSICBOX_WINDOW_USERNAME
} = require('shared/constants')

const config = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
}

class SpotifyChangeEmitter extends ChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  onLoaded (event) {
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, window.location.pathname)

    this.__data__.player = window.player
    this.__data__.trackObserver = new window.MutationObserver(this.handleDisplayCurrentSong.bind(this))
    this.__data__.playingObserver = new window.MutationObserver(this.handlePlaying.bind(this))
    this.__data__.pageObserver = new window.MutationObserver(this.handlePageChanged.bind(this))

    const interval = setInterval(() => {
      // wait until it's all there before subscribing
      if (!document.querySelector('.now-playing') ||
        !document.querySelector('.user-link') ||
        !document.querySelector('.track-info') ||
        !document.querySelector('.spoticon-play-16') ||
        !document.querySelector('.ads-container')) { return }
      document.querySelector('.ads-container').style.display = 'none'
      this.transmitEvent(MUSICBOX_WINDOW_USERNAME, document.querySelector('.user-link').innerText)
      this.subscribeToEvents()
      clearInterval(interval)
    }, 500)
  }

  subscribeToEvents (event, data) {
    // console.log('subscribe', event, data, this)
    this.handleDisplayCurrentSong()
    this.trackObserver.observe(document.querySelector('.now-playing'), config)
    this.pageObserver.observe(document.querySelector('.hw-accelerate'), config)
    this.playingObserver.observe(document.querySelector('.spoticon-play-16'), config)
  }

  /* **************************************************************************/
  // Getters
  /* **************************************************************************/

  get player () {
    return this.__data__.player
  }

  get trackObserver () {
    return this.__data__.trackObserver
  }
  get pageObserver () {
    return this.__data__.pageObserver
  }

  get playingObserver () {
    return this.__data__.playingObserver
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying () {
    // console.log('handlePlaying', document.querySelector('.control-button--circled').classList.contains('spoticon-pause-16'))
    this.transmitEvent(MUSICBOX_WINDOW_PLAYING, document.querySelector('.control-button--circled').classList.contains('spoticon-pause-16'))
  }

  handleDisplayCurrentSong () {
    // console.log('handleDisplayCurrentSong', event, data);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(() => {
      this.displayCurrentSong()
    }, 1000)
  }

  displayCurrentSong () {
    const img = document.querySelector('.now-playing .cover-art-image').style.backgroundImage.split('"')[1]
    const title = document.querySelector('.track-info__name a').innerText
    const artist = document.querySelector('.track-info__artists a').innerText
    // const artist = document.querySelector('.track-info__name a').innerText

    const trackDetail = {
      title: title,
      artist: artist,
      album: '',
      imageUrl: img
    }

    // console.log('handleDisplayCurrentSong', trackDetail)
    this.transmitEvent(MUSICBOX_WINDOW_TRACK_CHANGED, trackDetail)
  }

  handlePageChanged () {
    // console.log('handlePageChanged', window.location.pathname)
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, window.location.pathname)
  }
}

module.exports = SpotifyChangeEmitter
