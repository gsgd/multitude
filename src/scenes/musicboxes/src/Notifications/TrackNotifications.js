const flux = {
  musicbox: require('../stores/musicbox'),
  settings: require('../stores/settings')
}
const constants = require('shared/constants')
const {getVoices, getIntro} = require('shared/voices')
const {musicboxDispatch} = require('../Dispatch')
const {ipcRenderer} = window.nativeRequire('electron')

class TrackNotifications {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.__s_musicboxesUpdated = (store) => this.musicboxesUpdated(store)
    this.__constructTime__ = new Date().getTime()
    this.__dispatching__ = false
    this.__data__ = {
      currentTrack: ''
    }
 /* window.NNotification = require('./Notification')
 window.nn = new window.NNotification('my test title', {
   body: 'Test body is here are it is my body and it is about some stuff and stuff and stuff that just seems to go on and on'
 }) */

    this.__utterance__ = new window.SpeechSynthesisUtterance('')
    this.__utterance__.onstart = function () { musicboxDispatch.fadeTo(0.3, 200) }
    this.__utterance__.onend = function () { musicboxDispatch.fadeTo(1) }
  }

  get currentTrack () {
    return this.__data__.currentTrack
  }

  set currentTrack (newTrack) {
    this.__data__.currentTrack = JSON.stringify(newTrack)
  }

  /**
  * Starts listening for changes
  */
  start () {
    flux.musicbox.S.listen(this.__s_musicboxesUpdated)
    this.musicboxesUpdated(flux.musicbox.S.getState())
    this.__dispatching__ = false
  }

  /**
  * Stops listening for changes
  */
  stop () {
    flux.musicbox.S.unlisten(this.__s_musicboxesUpdated)
    this.__dispatching__ = false
  }

  /* **************************************************************************/
  // Events
  /* **************************************************************************/

  musicboxesUpdated (store) {
    // console.log('musicboxesUpdated', store);
    clearTimeout(this.__data__.currentDisplayDelay)
    this.__data__.currentDisplayDelay = setTimeout(() => {
      this.sendTrackNotification(store)
    }, 1000)
  }

  /**
  * Handles the musicboxes changing by dropping out any notifications
  */
  sendTrackNotification (store) {
    // console.log('sendTrackNotification', store);
    if (this.__dispatching__) { return }
    if (flux.settings.S.getState().os.notificationsEnabled === false) { return }
    const now = new Date().getTime()

    const firstRun = now - this.__constructTime__ < constants.TRACK_NOTIFICATION_FIRST_RUN_GRACE_MS
    // console.log('sendTrackNotification.firstRun', firstRun)
    if (firstRun) { return }

    store.allMusicboxes().forEach((musicbox, k) => {
      // console.log('sendTrackNotification:store.allMusicboxes().forEach', firstRun, musicbox.currentTrack, musicbox.showNotifications);
      if (!musicbox.showNotifications || typeof musicbox.currentTrack === 'undefined') { return }

      const { currentTrack, isPlaying } = musicbox

      // console.log('sendTrackNotification.this.currentTrack', this.currentTrack);
      // console.log('sendTrackNotification.stringify', JSON.stringify(currentTrack));
      // console.log('sendTrackNotification.other', currentTrack, isPlaying);
      if (this.currentTrack === JSON.stringify(currentTrack) || !isPlaying) { return }
      this.currentTrack = currentTrack

      this.showNotification(musicbox, currentTrack)
      if (flux.settings.S.getState().os.notificationsSilent) { return }
      if (!getVoices().length && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.speakNotification(musicbox, currentTrack)
          window.speechSynthesis.onvoiceschanged = undefined
        }
      } else {
        this.speakNotification(musicbox, currentTrack)
      }
    })
  }

  /**
  * Shows a notification
  * @param musicbox: the musicbox to show it for
   * @param currentTrack: the track notification to show
  * @return the notification
  */
  showNotification (musicbox, currentTrack) {
    const notification = new window.Notification(currentTrack.title, {
      body: [currentTrack.artist, currentTrack.album].join('\n'),
      silent: true,
      icon: [currentTrack.imageUrl],
      image: [currentTrack.imageUrl],
      persitent: true,
      tag: 'track-notification',
      renotify: false,
      data: { musicbox: musicbox.id }
    })
    notification.onclick = this.handleNotificationClicked
  }

  /**
   * Speaks a notification
   * @param musicbox: the musicbox to show it for
   * @param currentTrack: the track notification to show
   */
  speakNotification (musicbox, currentTrack) {
    let speech = [`${getIntro()}: ${currentTrack.title}`]
    if (currentTrack.artist) {
      speech.push(`by ${currentTrack.artist}`)
    } else if (currentTrack.album) {
      speech.push(`from ${currentTrack.album}`)
    }
    this.speak(speech.join(', '))
  }

  speak (text) {
    window.speechSynthesis.cancel()
    this.__utterance__.text = text
    this.__utterance__.voice = getVoices()[flux.settings.S.getState().os.notificationsVoice]
    // console.log('speak', this.__utterance__)
    window.speechSynthesis.speak(this.__utterance__)
  }
  /**
  * Handles a notification being clicked
  * @param evt: the event that fired
  */
  handleNotificationClicked (evt) {
    if (evt.target && evt.target.data) {
      const data = evt.target.data
      if (data.musicbox) {
        ipcRenderer.send('focus-app', { })
        flux.musicbox.A.changeActive(data.musicbox)
        // musicboxDispatch.openMessage(data.musicbox, data.threadId, data.messageId)
      }
    }
  }
}

module.exports = TrackNotifications
