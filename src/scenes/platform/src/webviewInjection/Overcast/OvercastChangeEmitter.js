const {ipcRenderer} = require('electron')

class OvercastChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
  * @param gmailApi: the gmail api instance
  */
  constructor () {
    this.__data__ = {
      intervals: []
    }
    // console.log('constructor');
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this))
    // console.log('constructor.done');
  }

  onLoaded(event) {
    // console.log('onLoaded');

    this.transmitEvent('musicbox-window-page-changed', window.location.pathname)

    this.__data__.player = document.getElementById('audioplayer')
    if (this.player) {
      this.player.setAttribute('data-autoplay', 0)
      this.player.onloadstart = this.subscribeToEvents.bind(this)
      this.player.onload = this.handleDisplayCurrentSong.bind(this);
    }
    // console.log('onLoaded.done');
  }

  subscribeToEvents(event, data) {
    // console.log('subscribe');
    this.player.onplay = this.handlePlaying.bind(this)
    this.player.onpause = this.handlePlaying.bind(this)
  }

  /* **************************************************************************/
  // Getters
  /* **************************************************************************/

  get player () {
    return this.__data__.player
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying(event, playing) {
    // console.log('handlePlaying', event, playing);
    this.transmitEvent('musicbox-window-playing', !this.player.paused)
  }

  handleDisplayCurrentSong() {
    // console.log('handleDisplayCurrentSong', event, data);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(()  => {
      this.handleDisplayCurrentSong.call(this)
    }, 1000)
  }

  handleDisplayCurrentSong() {
    const img = $('meta[name="og:image"]').attr('content');
    // const title = window.$('meta[name="og:title"]').attr('content');
    const podcast = $('div.titlestack .caption2').text();
    const title   = $('div.titlestack .title').text();

    const trackDetail = {
      title: title,
      artist: '',
      album: podcast,
      imageUrl: img,
    }

    // console.log('handleDisplayCurrentSong', trackDetail);
    this.transmitEvent('musicbox-window-track-changed', trackDetail)
  }

  handlePageChanged(event, data) {
    // console.log('handlePageChanged', event, data);
    this.transmitEvent('musicbox-window-page-changed', data.path)
  }
  /* **************************************************************************/
  // Event Emitter
  /* **************************************************************************/

  /**
  * Passing events up across the bridge
  */
  transmitEvent (type, data) {
    ipcRenderer.sendToHost({
      type: type,
      data: data
    })
  }
}

module.exports = OvercastChangeEmitter
