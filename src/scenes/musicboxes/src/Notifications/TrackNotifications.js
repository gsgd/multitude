const flux = {
  musicbox: require('../stores/musicbox'),
  settings: require('../stores/settings')
}
const constants = require('shared/constants')
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
 /* window.NNotification = require('./Notification')
 window.nn = new window.NNotification('my test title', {
   body: 'Test body is here are it is my body and it is about some stuff and stuff and stuff that just seems to go on and on'
 }) */
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

  /**
  * Handles the musicboxes changing by dropping out any notifications
  */
  musicboxesUpdated (store) {
    // console.log('musicboxesUpdated', store);
    if (this.__dispatching__) { return }
    if (flux.settings.S.getState().os.notificationsEnabled === false) { return }
    const now = new Date().getTime()
    const firstRun = now - this.__constructTime__ < constants.GMAIL_NOTIFICATION_FIRST_RUN_GRACE_MS

    store.allMusicboxes().forEach((musicbox, k) => {
      if (!musicbox.showNotifications || musicbox.currentTrack == undefined || !musicbox.currentTrack.playing) { return }

      this.showNotification(musicbox, musicbox.currentTrack)

      // return now

      // if (lastInternalDate !== 0) {
      //   flux.musicbox.A.setGoogleLastNotifiedInternalDate.defer(musicbox.id, lastInternalDate)
      // }
    })
  }

  /**
  * Shows a notification
  * @param musicbox: the musicbox to show it for
  * @param message: the message notification to show
  * @return the notification
  */
  showNotification (musicbox, track) {
    const notification = new window.Notification(track.title, {
      body: [track.artist, track.album].join('\n'),
      silent: true, //flux.settings.S.getState().os.notificationsSilent,
      icon: [track.imageUrl],
      'tag': 'TrackNotifications',
      data: { musicbox: musicbox.id }
    })
    notification.onclick = this.handleNotificationClicked
    return notification
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
