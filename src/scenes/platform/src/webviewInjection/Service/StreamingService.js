const ChangeEmitter = require('../ChangeEmitter/ChangeEmitter')
const {ipcRenderer} = require('electron')
const { MUSICBOX_WINDOW_INIT, MUSICBOX_WINDOW_PLAY,
  MUSICBOX_WINDOW_PAUSE, MUSICBOX_WINDOW_PLAY_PAUSE, MUSICBOX_WINDOW_FADE_TO,
  MUSICBOX_WINDOW_NEXT_TRACK, MUSICBOX_WINDOW_PREVIOUS_TRACK } = require('shared/constants')

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
    document.addEventListener('DOMContentLoaded', this.addBindings.bind(this))
    window.addEventListener('beforeunload', this.removeBindings.bind(this))
  }

  get player () {
    return this.__player__
  }

  set player (player) {
    this.__player__ = player
  }

  addBindings () {
    // Bind our listeners
    ipcRenderer.on(MUSICBOX_WINDOW_FADE_TO, this.handleFadeTo.bind(this))
    // Bind our strategies if they are there
    if (this.player.handleInit !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_INIT, this.player.handleInit.bind(this.player)) }
    if (this.player.handlePlay !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PLAY, this.player.handlePlay.bind(this.player)) }
    if (this.player.handlePause !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PAUSE, this.player.handlePause.bind(this.player)) }
    if (this.player.handlePlayPause !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PLAY_PAUSE, this.player.handlePlayPause.bind(this.player)) }
    if (this.player.handleNextTrack !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_NEXT_TRACK, this.player.handleNextTrack.bind(this.player)) }
    if (this.player.handlePreviousTrack !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PREVIOUS_TRACK, this.player.handlePreviousTrack.bind(this.player)) }
  }

  removeBindings () {
    // Bind our listeners
    ipcRenderer.removeListener(MUSICBOX_WINDOW_FADE_TO, this.handleFadeTo.bind(this))
    // Bind our strategies if they are there
    if (this.player.handleInit !== undefined) { ipcRenderer.removeListener(MUSICBOX_WINDOW_INIT, this.player.handleInit.bind(this.player)) }
    if (this.player.handlePlay !== undefined) { ipcRenderer.removeListener(MUSICBOX_WINDOW_PLAY, this.player.handlePlay.bind(this.player)) }
    if (this.player.handlePause !== undefined) { ipcRenderer.removeListener(MUSICBOX_WINDOW_PAUSE, this.player.handlePause.bind(this.player)) }
    if (this.player.handlePlayPause !== undefined) { ipcRenderer.removeListener(MUSICBOX_WINDOW_PLAY_PAUSE, this.player.handlePlayPause.bind(this.player)) }
    if (this.player.handleNextTrack !== undefined) { ipcRenderer.removeListener(MUSICBOX_WINDOW_NEXT_TRACK, this.player.handleNextTrack.bind(this.player)) }
    if (this.player.handlePreviousTrack !== undefined) { ipcRenderer.removeListener(MUSICBOX_WINDOW_PREVIOUS_TRACK, this.player.handlePreviousTrack.bind(this.player)) }
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
}

module.exports = StreamingService
