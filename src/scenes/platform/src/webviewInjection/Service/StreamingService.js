const ChangeEmitter = require('../ChangeEmitter/ChangeEmitter')
const {ipcRenderer} = require('electron')
const {
  MUSICBOX_WINDOW_INIT_REQUEST,
  MUSICBOX_WINDOW_INIT,
  MUSICBOX_WINDOW_PLAY,
  MUSICBOX_WINDOW_PAUSE,
  MUSICBOX_WINDOW_PLAY_PAUSE,
  MUSICBOX_WINDOW_FADE_TO,
  MUSICBOX_WINDOW_NEXT_TRACK,
  MUSICBOX_WINDOW_PREVIOUS_TRACK
} = require('shared/constants')

class StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
   * @param {MediaPlayer} player: the media player to use
   */
  constructor (player) {
    this.player = player
    this.__data__ = {
      intervals: []
    }

    this.changeEmitter = new ChangeEmitter(this.player)
    // before anythign else we request init
    ipcRenderer.on(MUSICBOX_WINDOW_INIT, this.handleInit.bind(this))
    this.changeEmitter.transmitEvent(MUSICBOX_WINDOW_INIT_REQUEST, true)

    document.addEventListener('DOMContentLoaded', this.addBindings.bind(this))
    // window.addEventListener('beforeunload', this.removeBindings.bind(this))
  }

  get player () {
    return this.__player__
  }

  set player (player) {
    this.__player__ = player
  }

  addBindings () {
    console.log('addBindings')
    // Bind our listeners
    ipcRenderer.on(MUSICBOX_WINDOW_FADE_TO, this.handleFadeTo.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PLAY, this.handlePlay.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PAUSE, this.handlePause.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PLAY_PAUSE, this.handlePlayPause.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_NEXT_TRACK, this.handleNextTrack.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PREVIOUS_TRACK, this.handlePreviousTrack.bind(this))
  }

  removeBindings () {
    console.log('removeBindings')
    // unbind our listeners
    ipcRenderer.removeListener(MUSICBOX_WINDOW_FADE_TO, this.handleFadeTo.bind(this))
    ipcRenderer.removeListener(MUSICBOX_WINDOW_INIT, this.handleInit.bind(this))
    ipcRenderer.removeListener(MUSICBOX_WINDOW_PLAY, this.handlePlay.bind(this))
    ipcRenderer.removeListener(MUSICBOX_WINDOW_PAUSE, this.handlePause.bind(this))
    ipcRenderer.removeListener(MUSICBOX_WINDOW_PLAY_PAUSE, this.handlePlayPause.bind(this))
    ipcRenderer.removeListener(MUSICBOX_WINDOW_NEXT_TRACK, this.handleNextTrack.bind(this))
    ipcRenderer.removeListener(MUSICBOX_WINDOW_PREVIOUS_TRACK, this.handlePreviousTrack.bind(this))
  }

  fadeTo (value, time, step) {
    // console.log('fadeTo', value, time, step);
    this.clearIntervals()
    time = time || 500
    step = step || 50
    if (value < 0) value = 0
    if (value > 1) value = 1

    let count = 0

    const initial = this.player.volume
    const direction = value < initial ? -1 : 1
    const distance = value - initial * direction
    const each = distance / (time / step) * direction

    const interval = setInterval(() => {
      let newValue = Number((Number(this.player.volume) + each).toPrecision(4))
      if (newValue > 1) newValue = 1
      if (newValue < 0) newValue = 0
      if (value < initial && newValue <= value) newValue = value
      if (value > initial && newValue >= value) newValue = value

      this.player.volume = newValue
      // bust out for matching values or overtime
      if (newValue === value || ++count * step > time) return clearInterval(interval)
    }, step)
    this.__data__.intervals.push(interval)
  }

  clearIntervals () {
    while (this.__data__.intervals.length) {
      clearInterval(this.__data__.intervals.shift())
    }
  }

  handleFadeTo (evt, data) {
    // console.log('handleFadeTo', evt, data);
    const { volume, duration } = data
    this.fadeTo(volume, duration)
  }

  handleInit (evt, data) {
    console.log('handleInit', evt, data)
    if (this.player.handleInit !== undefined) { this.player.handleInit(evt, data) }
  }
  handlePlay (evt, data) {
    if (this.player.handlePlay !== undefined) { this.player.handlePlay(evt, data) }
  }
  handlePause (evt, data) {
    if (this.player.handlePause !== undefined) { this.player.handlePause(evt, data) }
  }
  handlePlayPause (evt, data) {
    if (this.player.handlePlayPause !== undefined) { this.player.handlePlayPause(evt, data) }
  }
  handleNextTrack (evt, data) {
    if (this.player.handleNextTrack !== undefined) { this.player.handleNextTrack(evt, data) }
  }
  handlePreviousTrack (evt, data) {
    if (this.player.handlePreviousTrack !== undefined) { this.player.handlePreviousTrack(evt, data) }
  }

}

module.exports = StreamingService
