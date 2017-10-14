const OvercastChangeEmitter = require('./OvercastChangeEmitter')
const StreamingService = require('../Service/StreamingService')

class OvercastStreaming extends StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    super()
    this.changeEmitter = new OvercastChangeEmitter()
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get volume () {
    return this.changeEmitter.player.volume
  }

  set volume (level) {
    this.changeEmitter.player.volume = level
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
    this.changeEmitter.player.paused ? this.handlePlay(evt, data) : this.handlePause(evt, data)
  }

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePlay (evt, data) {
    this.changeEmitter.player.play()
  }

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePause (evt, data) {
    this.changeEmitter.player.pause()
  }

  handleNextTrack (evt, data) {
    document.getElementById('seekforwardbutton').click()
  }

  handlePreviousTrack (evt, data) {
    document.getElementById('seekbackbutton').click()
  }

}

module.exports = OvercastStreaming
