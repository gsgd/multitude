const injector = require('../injector')

class DeezerStreaming {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.sidebarStylesheet = document.createElement('style')

    // Inject some styles
    injector.injectStyle(`
      button[data-type="log_out"] {
        visibility: hidden !important;
      }
    `)
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get volume () {
    // console.log('dz get volume');
    return window.dzPlayer.getVolume()
  }

  set volume (level) {
    // console.log('dz set volume');
    window.dzPlayer.control.setVolume(level)
  }

  get username () {
    return window.USER.BLOG_NAME
  }

  get playing () {
    return window.dzPlayer.isPlaying()
  }

  get currentTrack () {
    const data = window.dzPlayer.getCurrentSong()
    if (data == null) { return undefined }
    let title = [data.SNG_TITLE]
    if (data.VERSION !== '') title.push(data.VERSION)
    return {
      title: title.join(' '),
      artist: data.ART_NAME,
      album: data.ALB_TITLE,
      imageUrl: `${window.SETTING_DOMAIN_IMG}/cover/${data.ALB_PICTURE}/250x250.jpg`
    }
  }

  get tracklist () {
    return {
      track: {
        data: window.dzPlayer.getTrackList()
      },
      index: window.dzPlayer.getIndexSong()
    }
  }

  get currentPage () {
    return window.location.pathname
  }

  /* **************************************************************************/
  // Loaders
  /* **************************************************************************/

  onLoaded (ChangeEmitter) {
    setTimeout(function () {
      window.dzPlayer.isAdvertisingAllowed = function () { return false }
      window.$('.ads').remove()
      window.$('body').removeClass('has-ads-bottom').removeClass('has-ads-top')
    }, 100)
    window.Events.ready(window.Events.user.loaded, ChangeEmitter.subscribeToEvents.bind(ChangeEmitter))
  }

  subscribeToEvents (ChangeEmitter) {
    // console.log('subscribe');
    window.Events.subscribe(window.Events.player.playing, ChangeEmitter.handlePlaying.bind(ChangeEmitter))
    window.Events.subscribe(window.Events.player.displayCurrentSong, ChangeEmitter.handleDisplayCurrentSong.bind(ChangeEmitter))
    window.Events.subscribe(window.Events.player.displayCurrentSong, ChangeEmitter.handleTracklistChanged.bind(ChangeEmitter))
    window.Events.subscribe(window.Events.player.tracklist_changed, ChangeEmitter.handleTracklistChanged.bind(ChangeEmitter))
    window.Events.subscribe(window.Events.navigation.page_changed, ChangeEmitter.handlePageChanged.bind(ChangeEmitter))
  }

  /* **************************************************************************/
  // Event handlers
  /* **************************************************************************/

  handleInit (evt, data) {
    if (!data || !data.track) { return }
    document.addEventListener('DOMContentLoaded', () => { window.PLAYER_INIT = data })
  }
  /**
  * Handles media events
  * @param evt: the event that fired
  * @param data: the data sent with the event
  */

  handlePlay (evt, data) {
    window.dzPlayer.control.play()
  }

  handlePause (evt, data) {
    window.dzPlayer.control.pause()
  }

  handlePlayPause (evt, data) {
    window.dzPlayer.control.togglePause()
  }

  handleNextTrack (evt, data) {
    window.dzPlayer.control.nextSong()
  }

  handlePreviousTrack (evt, data) {
    window.dzPlayer.control.prevSong()
  }

}

module.exports = DeezerStreaming