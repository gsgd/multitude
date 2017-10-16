const MFPChangeEmitter = require('./MFPChangeEmitter')
const StreamingService = require('../Service/StreamingService')

class MFPStreaming extends StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    super()
    this.changeEmitter = new MFPChangeEmitter()
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
    this.changeEmitter.player.playPause()
  }

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePlay (evt, data) {
    if (this.changeEmitter.player.audio.paused) {
      this.changeEmitter.player.playPause()
    }
  }

  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */
  handlePause (evt, data) {
    if (!this.changeEmitter.player.audio.paused) {
      this.changeEmitter.player.playPause()
    }
  }

  handleNextTrack (evt, data) {
    this.changeEmitter.player.ffw()
  }

  handlePreviousTrack (evt, data) {
    this.changeEmitter.player.rew()
  }

}

module.exports = MFPStreaming
