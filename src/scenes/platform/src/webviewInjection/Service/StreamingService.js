const Browser = require('../Browser/Browser')
const WMail = require('../WMail/WMail')
const {ipcRenderer} = require('electron')
const { MUSICBOX_WINDOW_INIT, MUSICBOX_WINDOW_PLAY,
  MUSICBOX_WINDOW_PAUSE, MUSICBOX_WINDOW_PLAY_PAUSE,
  MUSICBOX_WINDOW_NEXT_TRACK, MUSICBOX_WINDOW_PREVIOUS_TRACK } = require('shared/constants')

class StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.__data__ = {
      intervals: []
    }

    this.browser = new Browser()
    this.wmail = new WMail()

    // Bind our listeners
    ipcRenderer.on('musicbox-fade-to', this.handleFadeTo.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_INIT, this.handleInit.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PLAY, this.handlePlay.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PAUSE, this.handlePause.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PLAY_PAUSE, this.handlePlayPause.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_NEXT_TRACK, this.handleNextTrack.bind(this))
    ipcRenderer.on(MUSICBOX_WINDOW_PREVIOUS_TRACK, this.handlePreviousTrack.bind(this))
  }

  fadeTo (value, time, step) {
    // console.log('fadeTo', value, time, step);
    this.clearIntervals()
    time = time || 500
    step = step || 50
    if (value < 0) value = 0
    if (value > 1) value = 1

    let count = 0

    const initial = this.volume
    const direction = value < initial ? -1 : 1
    const distance = value - initial * direction
    const each = distance / (time / step) * direction

    const interval = setInterval(() => {
      let newValue = Number((Number(this.volume) + each).toPrecision(4))
      if (newValue > 1) newValue = 1
      if (newValue < 0) newValue = 0
      if (value < initial && newValue <= value) newValue = value
      if (value > initial && newValue >= value) newValue = value

      this.volume = newValue
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

  handleInit (evt, data) {
  }

  handleFadeTo (evt, data) {
    // console.log('handleFadeTo', evt, data);
    const { volume, duration } = data
    this.fadeTo(volume, duration)
  }
}

module.exports = StreamingService
