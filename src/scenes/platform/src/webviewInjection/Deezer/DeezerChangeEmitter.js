const {ipcRenderer} = require('electron')

class DeezerChangeEmitter {

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
    this.transmitEvent('musicbox-window-playing', false)
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this))
  }

  onLoaded(event) {
    // console.log(window.dzPlayer);
    // // console.log(window.__DZR_APP_STATE__);
    this.__data__.utterance = new window.SpeechSynthesisUtterance('');
    this.__data__.utterance.lang = 'en'
    this.__data__.utterance.onstart = function() {this.fadeTo(0.3, 200)}.bind(this)
    this.__data__.utterance.onend = function() {this.fadeTo(1)}.bind(this)

    this.speak('Ready')
    // window.location = "http://www.deezer.com/en/playlist/1265657051";
    window.Events.ready(window.Events.user.loaded, this.subscribeToEvents.bind(this));
  }

  fadeTo(value, time, step) {
    this.clearIntervals()
    time = time || 500
    step = step || 50
    if (value < 0) value = 0
    if (value > 1) value = 1
    
    const initial = dzPlayer.getVolume()
    const direction = value < initial ? -1 : 1
    const distance = value-initial*direction
    const each = distance/(time/step) * direction

    const interval = setInterval(function() {
      let newValue = dzPlayer.getVolume() + each;
      if (newValue > 1) newValue = 1
      if (newValue < 0) newValue = 0
      if (value < initial && newValue <= value) newValue = value
      if (value > initial && newValue >= value) newValue = value

      dzPlayer.control.setVolume(newValue)
      if (newValue == value) return clearInterval(interval)
    }, step);
    this.__data__.intervals.push(interval)
  }

  clearIntervals() {
    while (this.__data__.intervals.length) {
      clearInterval(this.__data__.intervals.shift())
    }
  }

  subscribeToEvents(event, data) {
    // console.log('subscribe');
    // window.Events.subscribe(window.Events.player.playing, this.handlePlaying.bind(this))
    window.Events.subscribe(window.Events.player.displayCurrentSong, this.handleDisplayCurrentSong.bind(this))
    window.Events.subscribe(window.Events.player.tracklist_changed, this.handleTracklistChanged.bind(this))
  }

  speak(text) {
    window.speechSynthesis.cancel()
    this.__data__.utterance.text = text;
    // console.log(this.__data__.utterance)
    window.speechSynthesis.speak(this.__data__.utterance)
    window.dzPlayer.control.setVolume(1)
  }
  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying(event, playing) {
    // console.log('handlePlaying', event, playing);
    this.transmitEvent('musicbox-window-playing', playing)
  }

  handleDisplayCurrentSong(event, data) {
    // console.log('handleDisplayCurrentSong', event, data);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(()  => {
      this.displayCurrentSong.call(this, data)
    }, 5000)
  }

  displayCurrentSong(data) {
    const playing = window.dzPlayer.isLoading() || window.dzPlayer.isPlaying() 
    // console.log('displayCurrentSong', data, playing);
    let title = [data.SNG_TITLE]
    if (data.VERSION != '') title.push(data.VERSION)
    const trackDetail = {
      title: title.join(' '),
      artist: data.ART_NAME,
      album: data.ALB_TITLE,
      imageUrl: `${SETTING_DOMAIN_IMG}/cover/${data.ALB_PICTURE}/250x250.jpg`,
      playing: playing
    }
    this.transmitEvent('musicbox-window-track-changed', trackDetail)
    if (playing) {
      this.speak(`Now Playing ${trackDetail.title}, by ${trackDetail.artist}, from ${trackDetail.album}`)
    }
  }

  handleTracklistChanged(event, data) {
    // this.transmitEvent('musicbox-state-update', window.__DZR_APP_STATE__)
    // console.log('handleTracklistChanged', event, data, window.__DZR_APP_STATE__);
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

const EXAMPLE = {
  "ALB_ID": "10726686",
  "ALB_PICTURE": "61aa0304d3566b24587d20eff8ee72ba",
  "ALB_TITLE": "We Love... Detroit",
  "ART_ID": "614419",
  "ART_NAME": "Lando Kal",
  "DATE_START": "2000-01-01",
  "DATE_START_PREMIUM": "2000-01-01",
  "DURATION": "336",
  "FALLBACK": {
    "ALB_ID": "10726686",
    "ALB_PICTURE": "61aa0304d3566b24587d20eff8ee72ba",
    "ALB_TITLE": "We Love... Detroit",
    "ART_ID": "614419",
    "ART_NAME": "Lando Kal",
    "DATE_START": "2000-01-01",
    "DATE_START_PREMIUM": "2000-01-01",
    "DURATION": "336",
    "FILESIZE": "5378715",
    "FILESIZE_MP3_64": "2689357",
    "FILESIZE_MP3_128": "5378715",
    "FILESIZE_MP3_256": 0,
    "FILESIZE_MP3_320": "13446791",
    "FILESIZE_FLAC": "36811605",
    "GAIN": "0",
    "HIERARCHICAL_TITLE": "",
    "ISRC": "GBZ8R1100013",
    "LYRICS_ID": 0,
    "MD5_ORIGIN": "372116aca3de01a825ebd1964e1b4b98",
    "MEDIA_VERSION": "0",
    "RANK_SNG": "180685",
    "RIGHTS": {
      "STREAM_ADS_AVAILABLE": true,
      "STREAM_ADS": "2000-01-01",
      "STREAM_SUB_AVAILABLE": true,
      "STREAM_SUB": "2000-01-01"
    },
    "SMARTRADIO": "1",
    "SNG_CONTRIBUTORS": {
      "main_artist": [
        "Lando Kal"
      ],
      "composer": [
        "Lando Kal"
      ],
      "misc": [
        "D.R"
      ]
    },
    "SNG_ID": "103182520",
    "SNG_TITLE": "Clockin",
    "STATUS": 1,
    "S_MOD": 1,
    "S_PREMIUM": 1,
    "S_WIDGET": 0,
    "TRACK_NUMBER": "9",
    "TYPE": 0,
    "UPLOAD_ID": 0,
    "USER_ID": 0,
    "VERSION": "",
    "PROVIDER_ID": "1",
    "__TYPE__": "song"
  },
  "FILESIZE": "5378715",
  "FILESIZE_MP3_64": "2689357",
  "FILESIZE_MP3_128": "5378715",
  "FILESIZE_MP3_256": 0,
  "FILESIZE_MP3_320": "13446791",
  "FILESIZE_FLAC": "36811605",
  "GAIN": "0",
  "HIERARCHICAL_TITLE": "",
  "ISRC": "GBZ8R1100013",
  "LYRICS_ID": 0,
  "MD5_ORIGIN": "372116aca3de01a825ebd1964e1b4b98",
  "MEDIA_VERSION": "0",
  "RANK_SNG": "180685",
  "RIGHTS": {
    "STREAM_ADS_AVAILABLE": true,
    "STREAM_ADS": "2000-01-01",
    "STREAM_SUB_AVAILABLE": true,
    "STREAM_SUB": "2000-01-01"
  },
  "SMARTRADIO": "1",
  "SNG_CONTRIBUTORS": {
    "main_artist": [
      "Lando Kal"
    ],
    "composer": [
      "Lando Kal"
    ],
    "misc": [
      "D.R"
    ]
  },
  "SNG_ID": "103182520",
  "SNG_TITLE": "Clockin",
  "STATUS": 1,
  "S_MOD": 1,
  "S_PREMIUM": 1,
  "S_WIDGET": 0,
  "TRACK_NUMBER": "9",
  "TYPE": 0,
  "UPLOAD_ID": 0,
  "USER_ID": 0,
  "VERSION": "",
  "__TYPE__": "song",
  "UID": "0059c9e4e5759c8d7",
  "SNG_ID_ORIGIN": "62561221",
  "PROVIDER_ID": "1"
}

module.exports = DeezerChangeEmitter
