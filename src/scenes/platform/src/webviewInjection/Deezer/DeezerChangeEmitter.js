const ChangeEmitter = require('../ChangeEmitter/ChangeEmitter')
const { MUSICBOX_WINDOW_PLAYING, MUSICBOX_WINDOW_TRACK_CHANGED,
  MUSICBOX_WINDOW_TRACKLIST_CHANGED,
  MUSICBOX_WINDOW_PAGE_CHANGED } = require('shared/constants')

class DeezerChangeEmitter extends ChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  onLoaded (event) {
    setTimeout(function () {
      window.dzPlayer.isAdvertisingAllowed = function () { return false }
      window.$('.ads').remove()
      window.$('body').removeClass('has-ads-bottom').removeClass('has-ads-top')
    }, 1000)
    window.Events.ready(window.Events.user.loaded, this.subscribeToEvents.bind(this))
  }

  subscribeToEvents (event, data) {
    // console.log('subscribe');
    window.Events.subscribe(window.Events.player.playing, this.handlePlaying.bind(this))
    window.Events.subscribe(window.Events.player.displayCurrentSong, this.handleDisplayCurrentSong.bind(this))
    window.Events.subscribe(window.Events.player.displayCurrentSong, this.handleTracklistChanged.bind(this))
    window.Events.subscribe(window.Events.player.tracklist_changed, this.handleTracklistChanged.bind(this))
    window.Events.subscribe(window.Events.navigation.page_changed, this.handlePageChanged.bind(this))
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  handlePlaying (event, playing) {
    // console.log('handlePlaying', event, playing);
    this.transmitEvent(MUSICBOX_WINDOW_PLAYING, playing)
  }

  handleDisplayCurrentSong (event, data) {
    // console.log('handleDisplayCurrentSong', event, data);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(() => {
      this.displayCurrentSong(data)
    }, 1000)
  }

  displayCurrentSong (data) {
    // console.log('displayCurrentSong', data);
    let title = [data.SNG_TITLE]
    if (data.VERSION !== '') title.push(data.VERSION)
    const trackDetail = {
      title: title.join(' '),
      artist: data.ART_NAME,
      album: data.ALB_TITLE,
      imageUrl: `${window.SETTING_DOMAIN_IMG}/cover/${data.ALB_PICTURE}/250x250.jpg`
    }
    // console.log('notifyTrack', trackDetail);
    this.transmitEvent(MUSICBOX_WINDOW_TRACK_CHANGED, trackDetail)
  }

  handleTracklistChanged (event, tracklist) {
    const data = {
      track: {
        data: window.dzPlayer.getTrackList()
      },
      index: window.dzPlayer.getIndexSong()
    }
    // console.log('handleTracklistChanged', data)
    this.transmitEvent(MUSICBOX_WINDOW_TRACKLIST_CHANGED, data)
  }

  handlePageChanged (event, data) {
    // console.log('handlePageChanged', event, data);
    this.transmitEvent(MUSICBOX_WINDOW_PAGE_CHANGED, data.path)
  }
  /* **************************************************************************/
  // Event Emitter
  /* **************************************************************************/
}

// const EXAMPLE = {
//   "ALB_ID": "10726686",
//   "ALB_PICTURE": "61aa0304d3566b24587d20eff8ee72ba",
//   "ALB_TITLE": "We Love... Detroit",
//   "ART_ID": "614419",
//   "ART_NAME": "Lando Kal",
//   "DATE_START": "2000-01-01",
//   "DATE_START_PREMIUM": "2000-01-01",
//   "DURATION": "336",
//   "FALLBACK": {
//     "ALB_ID": "10726686",
//     "ALB_PICTURE": "61aa0304d3566b24587d20eff8ee72ba",
//     "ALB_TITLE": "We Love... Detroit",
//     "ART_ID": "614419",
//     "ART_NAME": "Lando Kal",
//     "DATE_START": "2000-01-01",
//     "DATE_START_PREMIUM": "2000-01-01",
//     "DURATION": "336",
//     "FILESIZE": "5378715",
//     "FILESIZE_MP3_64": "2689357",
//     "FILESIZE_MP3_128": "5378715",
//     "FILESIZE_MP3_256": 0,
//     "FILESIZE_MP3_320": "13446791",
//     "FILESIZE_FLAC": "36811605",
//     "GAIN": "0",
//     "HIERARCHICAL_TITLE": "",
//     "ISRC": "GBZ8R1100013",
//     "LYRICS_ID": 0,
//     "MD5_ORIGIN": "372116aca3de01a825ebd1964e1b4b98",
//     "MEDIA_VERSION": "0",
//     "RANK_SNG": "180685",
//     "RIGHTS": {
//       "STREAM_ADS_AVAILABLE": true,
//       "STREAM_ADS": "2000-01-01",
//       "STREAM_SUB_AVAILABLE": true,
//       "STREAM_SUB": "2000-01-01"
//     },
//     "SMARTRADIO": "1",
//     "SNG_CONTRIBUTORS": {
//       "main_artist": [
//         "Lando Kal"
//       ],
//       "composer": [
//         "Lando Kal"
//       ],
//       "misc": [
//         "D.R"
//       ]
//     },
//     "SNG_ID": "103182520",
//     "SNG_TITLE": "Clockin",
//     "STATUS": 1,
//     "S_MOD": 1,
//     "S_PREMIUM": 1,
//     "S_WIDGET": 0,
//     "TRACK_NUMBER": "9",
//     "TYPE": 0,
//     "UPLOAD_ID": 0,
//     "USER_ID": 0,
//     "VERSION": "",
//     "PROVIDER_ID": "1",
//     "__TYPE__": "song"
//   },
//   "FILESIZE": "5378715",
//   "FILESIZE_MP3_64": "2689357",
//   "FILESIZE_MP3_128": "5378715",
//   "FILESIZE_MP3_256": 0,
//   "FILESIZE_MP3_320": "13446791",
//   "FILESIZE_FLAC": "36811605",
//   "GAIN": "0",
//   "HIERARCHICAL_TITLE": "",
//   "ISRC": "GBZ8R1100013",
//   "LYRICS_ID": 0,
//   "MD5_ORIGIN": "372116aca3de01a825ebd1964e1b4b98",
//   "MEDIA_VERSION": "0",
//   "RANK_SNG": "180685",
//   "RIGHTS": {
//     "STREAM_ADS_AVAILABLE": true,
//     "STREAM_ADS": "2000-01-01",
//     "STREAM_SUB_AVAILABLE": true,
//     "STREAM_SUB": "2000-01-01"
//   },
//   "SMARTRADIO": "1",
//   "SNG_CONTRIBUTORS": {
//     "main_artist": [
//       "Lando Kal"
//     ],
//     "composer": [
//       "Lando Kal"
//     ],
//     "misc": [
//       "D.R"
//     ]
//   },
//   "SNG_ID": "103182520",
//   "SNG_TITLE": "Clockin",
//   "STATUS": 1,
//   "S_MOD": 1,
//   "S_PREMIUM": 1,
//   "S_WIDGET": 0,
//   "TRACK_NUMBER": "9",
//   "TYPE": 0,
//   "UPLOAD_ID": 0,
//   "USER_ID": 0,
//   "VERSION": "",
//   "__TYPE__": "song",
//   "UID": "0059c9e4e5759c8d7",
//   "SNG_ID_ORIGIN": "62561221",
//   "PROVIDER_ID": "1"
// }

module.exports = DeezerChangeEmitter
