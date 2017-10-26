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
   * @param strategy: the media strategy to use
   */
  constructor (strategy) {
    this.strategy = strategy
    this.__data__ = {
      intervals: []
    }

    this.changeEmitter = new ChangeEmitter(this.strategy)

    // Bind our listeners
    ipcRenderer.on(MUSICBOX_WINDOW_FADE_TO, this.handleFadeTo.bind(this))
    // Bind our strategies if they are there
    if (this.strategy.handleInit !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_INIT, this.strategy.handleInit.bind(this.strategy)) }
    if (this.strategy.handlePlay !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PLAY, this.strategy.handlePlay.bind(this.strategy)) }
    if (this.strategy.handlePause !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PAUSE, this.strategy.handlePause.bind(this.strategy)) }
    if (this.strategy.handlePlayPause !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PLAY_PAUSE, this.strategy.handlePlayPause.bind(this.strategy)) }
    if (this.strategy.handleNextTrack !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_NEXT_TRACK, this.strategy.handleNextTrack.bind(this.strategy)) }
    if (this.strategy.handlePreviousTrack !== undefined) { ipcRenderer.on(MUSICBOX_WINDOW_PREVIOUS_TRACK, this.strategy.handlePreviousTrack.bind(this.strategy)) }
  }

  get strategy () {
    return this.__strategy__
  }

  set strategy (strategy) {
    this.__strategy__ = strategy
  }

  fadeTo (value, time, step) {
    // console.log('fadeTo', value, time, step);
    this.clearIntervals()
    time = time || 500
    step = step || 50
    if (value < 0) value = 0
    if (value > 1) value = 1

    let count = 0

    const initial = this.strategy.volume
    const direction = value < initial ? -1 : 1
    const distance = value - initial * direction
    const each = distance / (time / step) * direction

    const interval = setInterval(() => {
      let newValue = Number((Number(this.strategy.volume) + each).toPrecision(4))
      if (newValue > 1) newValue = 1
      if (newValue < 0) newValue = 0
      if (value < initial && newValue <= value) newValue = value
      if (value > initial && newValue >= value) newValue = value

      this.strategy.volume = newValue
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
