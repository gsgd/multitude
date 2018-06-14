const injector = require('../injector')
const {clickMove} = require('shared/mouseEvents')
const MediaPlayer = require('./MediaPlayer')

const config = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
}

const selectors = {
  volumeNub: '.volume__sliderWrapper .volume__sliderHandle',
  volumeBounds: '.volume__sliderWrapper .volume__sliderBackground',
  username: '.userNav__username',
  pageChanged: '#app',
  trackDetails: '.playControls__soundBadge',
  playPause: '.playControls__elements button.playControls__play',
  playing: 'playing',
  previous: 'button.skipControl__previous',
  next: 'button.skipControl__next',
  trackTitle: '.playbackSoundBadge .playbackSoundBadge__title a[title]',
  trackArtist: null,
  trackAlbum: '.playbackSoundBadge .playbackSoundBadge__lightLink',
  trackImage: '.playbackSoundBadge .playbackSoundBadge__avatar span[style]'
}

class SoundcloudStreaming extends MediaPlayer {

  constructor () {
    super()
    // Inject some styles
    injector.injectStyle(`
    `)
  }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get trackObserver () {
    return this.__data__.trackObserver
  }

  get pageObserver () {
    return this.__data__.pageObserver
  }

  get playingObserver () {
    return this.__data__.playingObserver
  }

  get volume () {
    return this.__volume__
  }

  set volume (level) {
    this.__volume__ = level
    const nub = document.querySelector(selectors.volumeNub)
    const bounds = document.querySelector(selectors.volumeBounds).getBoundingClientRect()
    const x = document.querySelector(selectors.volumeNub).getBoundingClientRect().x
    const y = Number(bounds.bottom - (bounds.height * level)).toFixed()
    clickMove(nub, x, y)
  }

  get username () {
    if (document.querySelector(selectors.username) === null) { return undefined }
    return document.querySelector(selectors.username).innerText
  }

  get playing () {
    // console.log(document.querySelector(selectors.playPause))
    if (document.querySelector(selectors.playPause) === null) { return undefined }
    return document.querySelector(selectors.playPause).classList.contains(selectors.playing)
  }

  get currentTrack () {
    if (document.querySelector(selectors.trackTitle) === null ||
      document.querySelector(selectors.trackArtist) === null ||
      document.querySelector(selectors.trackImage) === null
    ) { return undefined }

    return {
      title: document.querySelector(selectors.trackTitle).title,
      artist: document.querySelector(selectors.trackArtist).title,
      album: document.querySelector(selectors.trackAlbum).title,
      imageUrl: document.querySelector(selectors.trackImage).style.backgroundImage.split('"')[1]
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

  /**
   * @param {ChangeEmitter} ChangeEmitter
   */
  onLoaded (ChangeEmitter) {
    this.__data__.trackObserver = new window.MutationObserver(ChangeEmitter.throttleDisplayCurrentSong().bind(ChangeEmitter))
    this.__data__.playingObserver = new window.MutationObserver(ChangeEmitter.handlePlaying.bind(ChangeEmitter))
    this.__data__.pageObserver = new window.MutationObserver(ChangeEmitter.handlePageChanged.bind(ChangeEmitter))

    const interval = setInterval(() => {
      // wait until it's all there before subscribing
      if (!document.querySelector(selectors.trackDetails) ||
        !document.querySelector(selectors.pageChanged) ||
      !document.querySelector(selectors.playPause)) { return }
      this.subscribeToEvents()
      ChangeEmitter.handleDisplayCurrentSong()
      clearInterval(interval)
    }, 500)
  }

  subscribeToEvents () {
    // console.log('subscribeToEvents')
    this.trackObserver.observe(document.querySelector(selectors.trackDetails), config)
    this.pageObserver.observe(document.querySelector(selectors.pageChanged), config)
    this.playingObserver.observe(document.querySelector(selectors.playPause), config)
  }

  /* **************************************************************************/
  // Event handlers
  /* **************************************************************************/

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlayPause (evt, data) {
    document.querySelector(selectors.playPause).click()
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlay (evt, data) {
    if (!this.playing) {
      document.querySelector(selectors.playPause).click()
    }
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePause (evt, data) {
    if (this.playing) {
      document.querySelector(selectors.playPause).click()
    }
  }

  handleNextTrack (evt, data) {
    document.querySelector(selectors.next).click()
  }

  handlePreviousTrack (evt, data) {
    document.querySelector(selectors.previous).click()
  }

}

module.exports = SoundcloudStreaming
