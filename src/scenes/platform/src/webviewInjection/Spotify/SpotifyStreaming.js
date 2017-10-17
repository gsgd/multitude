const SpotifyChangeEmitter = require('./SpotifyChangeEmitter')
const StreamingService = require('../Service/StreamingService')

class SpotifyStreaming extends StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    super()
    this.changeEmitter = new SpotifyChangeEmitter()
    this.__volume__ = 1
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get volume () {
    return this.__volume__
  }

  set volume (level) {
    this.__volume__ = level
  }

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

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
