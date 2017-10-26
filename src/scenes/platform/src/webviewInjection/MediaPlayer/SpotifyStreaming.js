const {clickMove} = require('shared/mouseEvents')

const config = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
}

class SpotifyStreaming {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.__data__ = {}
    this.__volume__ = 1
  }

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
    const nub = document.querySelector('.volume-bar .progress-bar__slider')
    const bounds = document.querySelector('.volume-bar .progress-bar__bg').getBoundingClientRect()
    const x = Number(bounds.left + (bounds.width * level)).toFixed()
    // console.log('set volume', {nub, bounds, x})
    clickMove(nub, x, bounds.top)
  }

  get username () {
    if (document.querySelector('.user-link') === null) { return undefined }
    return document.querySelector('.user-link').innerText
  }

  get playing () {
    if (document.querySelector('.control-button--circled') === null) { return undefined }
    return document.querySelector('.control-button--circled').classList.contains('spoticon-pause-16')
  }

  get currentTrack () {
    if (document.querySelector('.track-info__name a') === null ||
      document.querySelector('.track-info__artists a') === null ||
      document.querySelector('.now-playing .cover-art-image') === null
    ) { return undefined }

    return {
      title: document.querySelector('.track-info__name a').innerText,
      artist: document.querySelector('.track-info__artists a').innerText,
      album: '',
      imageUrl: document.querySelector('.now-playing .cover-art-image').style.backgroundImage.split('"')[1]
    }
  }

  get currentPage () {
    return window.location.pathname
  }

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

  onLoaded (ChangeEmitter) {
    this.__data__.trackObserver = new window.MutationObserver(ChangeEmitter.handleDisplayCurrentSong.bind(ChangeEmitter))
    this.__data__.playingObserver = new window.MutationObserver(ChangeEmitter.handlePlaying.bind(ChangeEmitter))
    this.__data__.pageObserver = new window.MutationObserver(ChangeEmitter.handlePageChanged.bind(ChangeEmitter))

    const interval = setInterval(() => {
      // wait until it's all there before subscribing
      if (!document.querySelector('.now-playing') ||
        !document.querySelector('.user-link') ||
        !document.querySelector('.track-info') ||
        !document.querySelector('.spoticon-play-16') ||
        !document.querySelector('.ads-container')) { return }
      document.querySelector('.ads-container').style.display = 'none'
      this.subscribeToEvents()
      ChangeEmitter.handleDisplayCurrentSong()
      clearInterval(interval)
    }, 500)
  }

  subscribeToEvents () {
    // console.log('subscribe', event, data, this)
    this.trackObserver.observe(document.querySelector('.now-playing'), config)
    this.pageObserver.observe(document.querySelector('.hw-accelerate'), config)
    this.playingObserver.observe(document.querySelector('.spoticon-play-16'), config)
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
    document.querySelector('.control-button--circled').click()
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePlay (evt, data) {
    if (!document.querySelector('.control-button--circled').classList.contains('spoticon-pause-16')) {
      document.querySelector('.control-button--circled').click()
    }
  }

  /**
   * Handles media events
   * @param evt: the event that fired
   * @param data: the data sent with the event
   */
  handlePause (evt, data) {
    if (document.querySelector('.control-button--circled').classList.contains('spoticon-pause-16')) {
      document.querySelector('.control-button--circled').click()
    }
  }

  handleNextTrack (evt, data) {
    document.querySelector('.spoticon-skip-forward-16').click()
  }

  handlePreviousTrack (evt, data) {
    document.querySelector('.spoticon-skip-back-16').click()
  }

}

module.exports = SpotifyStreaming
