const Minivents = require('minivents')

class MusicboxDispatch {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.__responders__ = {}
    Minivents(this)
  }

  /* **************************************************************************/
  // Responders
  /* **************************************************************************/

  /**
  * Adds a responder
  * @param name: the name of the responder
  * @param fn: the function to respond with
  */
  respond (name, fn) {
    if (this.__responders__[name]) {
      this.__responders__[name].push(fn)
    } else {
      this.__responders__[name] = [fn]
    }
  }

  /**
  * Unregisteres a responder
  * @param name: the name of the responder
  * @param fn: the function to remove
  */
  unrespond (name, fn) {
    if (this.__responders__[name]) {
      this.__responders__[name] = this.__responders__[name].filter((f) => f !== fn)
    }
  }

  /**
  * Makes a fetch to a set of responders
  * @param name: the name of the responder to call
  * @param args=undefined: arguments to pass to the responders
  * @param timeout=undefined: set to a ms to provide a timeout
  * @return promise
  */
  request (name, args = undefined, timeout = undefined) {
    if (!this.__responders__[name] || this.__responders__[name].length === 0) {
      return Promise.resolve([])
    }

    const requestPromise = Promise.all(this.__responders__[name].map((fn) => fn(args)))
    if (timeout === undefined) {
      return requestPromise
    } else {
      return Promise.race([
        requestPromise,
        new Promise((resolve, reject) => {
          setTimeout(() => reject({ timeout: true }), timeout)
        })
      ])
    }
  }

  /* **************************************************************************/
  // Responders : Higher level
  /* **************************************************************************/

  /**
  * Fetches the process memory info for all webviews
  * @return promise with the array of infos
  */
  fetchProcessMemoryInfo () {
    return this.request('fetch-process-memory-info')
  }

  /**
  * Fetches the deezer unread count
  * @param musicboxId: the id of the musicbox
  * @return promise with the unread count or undefined
  */
  fetchDeezerUnreadCount (musicboxId) {
    return this.request('get-deezer-unread-count:' + musicboxId, {}, 1000)
      .then((responses) => {
        return Promise.resolve((responses[0] || {}))
      })
  }

  /**
  * Fetches the deezer unread count and retries on timeout
  * @param musicboxId: the id of the musicbox
  * @param maxRetries=30: the number of retries to attempt. A second between each
  * @return promise with the unread count or undefined
  */
  fetchDeezerUnreadCountWithRetry (musicboxId, maxRetries = 30) {
    return new Promise((resolve, reject) => {
      const tryFetch = (tries) => {
        this.fetchDeezerUnreadCount(musicboxId).then(
          (res) => resolve(res),
          (err) => {
            if (err.timeout && tries < maxRetries) {
              setTimeout(() => tryFetch(tries + 1), 1000)
            } else {
              reject(err)
            }
          })
      }
      tryFetch(0)
    })
  }

  /* **************************************************************************/
  // Event Fires
  /* **************************************************************************/

  /**
  * Emits a open dev tools command
  * @param musicboxId: the id of the musicbox
  * @param service: the service to open for
  */
  toggleDevTools (musicboxId, service) {
    // console.log('musicboxDispatch.toggleDevTools');
    this.emit('devtools', { musicboxId: musicboxId, service: service })
  }

  /**
  * Emits a focus event for a musicbox
  * @param musicboxId=undefined: the id of the musicbox
  * @param service=undefined: the service of the musicbox
  */
  refocus (musicboxId = undefined, service = undefined) {
    this.emit('refocus', { musicboxId: musicboxId, service: service })
  }

  /**
  * Reloads a musicbox
  * @param musicboxId: the id of musicbox
  * @param service: the service of the musicbox
  */
  reload (musicboxId, service) {
    this.emit('reload', { musicboxId: musicboxId, service: service, allServices: false })
  }

  /**
  * Reloads all musicboxes services with the given id
  * @param musicboxId: the id of musicbox
  */
  reloadAllServices (musicboxId) {
    this.emit('reload', { musicboxId: musicboxId, allServices: true })
  }

  /**
  * Emis a blurred event for a musicbox
  * @param musicboxId: the id of the musicbox
  * @param service: the service of the musicbox
  */
  blurred (musicboxId, service) {
    this.emit('blurred', { musicboxId: musicboxId, service: service })
  }

  /**
  * Emis a focused event for a musicbox
  * @param musicboxId: the id of the musicbox
  * @param service: the service of the musicbox
  */
  focused (musicboxId, service) {
    this.emit('focused', { musicboxId: musicboxId, service: service })
  }

  /**
  * Emits an open message event for a musicbox
  * @param musicboxId: the id of the musicbox
  * @param threadId: the id of the thread
  * @param messageId: the id of the message to open
  */
  openMessage (musicboxId, threadId, messageId) {
    this.emit('openMessage', {
      musicboxId: musicboxId,
      threadId: threadId,
      messageId: messageId
    })
  }

  fadeTo (volume, duration) {
    this.emit('fadeTo', {
      volume: volume,
      duration: duration
    })
  }

  musicboxInitRequest (musicboxId) {
    // console.log('musicboxInit', musicboxId)
    this.emit('musicboxInitRequest', { musicboxId })
  }

  musicboxUsername (musicboxId, username) {
    // console.log('musicboxUsername', musicboxId, username)
    this.emit('musicboxUsername', {musicboxId, username})
  }

  trackChanged (musicboxId, trackDetail) {
    // console.log('mbD.trackChanged', musicboxId, trackDetail)
    this.emit('trackChanged', { musicboxId, trackDetail })
  }

  tracklistChanged (musicboxId, tracklist) {
    // console.log('trackChanged', trackDetail)
    this.emit('tracklistChanged', { musicboxId, tracklist })
  }

  playingChanged (musicboxId, playing) {
    // console.log('playingChanged', musicboxId, playing)
    this.emit('playingChanged', { musicboxId, playing })
  }

  stopOthers (musicboxId) {
    // console.log('playingChanged', musicboxId, playing)
    this.emit('stopOthers', { musicboxId })
  }

  pageChanged (musicboxId, pageUrl) {
    // console.log('musicboxDispatch.pageChanged', pageUrl)
    this.emit('pageChanged', { musicboxId, pageUrl })
  }
}

module.exports = new MusicboxDispatch()
