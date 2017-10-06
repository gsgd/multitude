const Model = require('../Model')
const uuid = require('uuid')
const Deezer = require('./Deezer')
const Overcast = require('./Overcast')
const SERVICES = require('./MusicboxServices')
const TYPES = require('./MusicboxTypes')

class Musicbox extends Model {

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static provisionId () { return uuid.v4() }
  static get TYPES () { return Object.assign({}, TYPES) }
  static get SERVICES () { return Object.assign({}, SERVICES) }

  static get TYPE_DEEZER () { return TYPES.DEEZER }
  static get TYPE_OVERCAST () { return TYPES.OVERCAST }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor (id, data) {
    // console.log('Musicbox.constructor', id, data);
    super(data)
    this.__id__ = id

    switch (this.type) {
    case Musicbox.TYPE_DEEZER:
      this.__musicbox__ = new Deezer(
        this.type,
        this.__data__.deezerAuth,
        this.__data__.deezerConf,
        this.__data__.deezerLabelInfo_v2,
        this.__data__.deezerUnreadMessageInfo_v2
      )
      break
    case Musicbox.TYPE_OVERCAST:
      this.__musicbox__ = new Overcast(
        this.type,
        this.__data__.overcastAuth,
        this.__data__.overcastConf,
        this.__data__.overcastLabelInfo_v2,
        this.__data__.overcastUnreadMessageInfo_v2
      )
      break
    }
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get id () { return this.__id__ }
  get type () { return this._value_('type', Musicbox.TYPE_DEEZER) }

  /* **************************************************************************/
  // Properties: Constants
  /* **************************************************************************/

  get typeName () {
    switch (this.type) {
      case Musicbox.TYPE_DEEZER: return 'Deezer'
      case Musicbox.TYPE_OVERCAST: return 'Overcast'
      default: return undefined
    }
  }
  get url () {
    // console.log('Musicbox.get url', this.type, Musicbox.TYPE_DEEZER, `http://www.deezer.com`);
    switch (this.type) {
      case Musicbox.TYPE_DEEZER: return `http://www.deezer.com`
      case Musicbox.TYPE_OVERCAST: return `https://overcast.fm`
      default: return undefined
    }
  }

  get pageUrl () {
    // console.log('get pageUrl', this.__data__.pageUrl);
    if (this.__data__.pageUrl) { return `${this.url}${this.__data__.pageUrl}` }
  }

  /* **************************************************************************/
  // Properties : Services
  /* **************************************************************************/

  get supportedServices () {
    switch (this.type) {
      case Musicbox.TYPE_DEEZER:
        return Array.from(Deezer.SUPPORTED_SERVICES)
      case Musicbox.TYPE_OVERCAST:
        return Array.from(Overcast.SUPPORTED_SERVICES)
      default:
        return []
    }
  }
  get defaultServices () {
    switch (this.type) {
      case Musicbox.TYPE_DEEZER:
        return Array.from(Deezer.DEFAULT_SERVICES)
      case Musicbox.TYPE_OVERCAST:
        return Array.from(Overcast.DEFAULT_SERVICES)
      default:
        return []
    }
  }
  get enabledServies () { return this._value_('services', this.defaultServices) }
  get hasEnabledServices () { return this.enabledServies.length !== 0 }
  get sleepableServices () { return this._value_('sleepableServices', this.supportedServices) }
  get compactServicesUI () { return this._value_('compactServicesUI', false) }

  /**
  * Resolves the url for a service
  * @param service: the type of service to resolve for
  * @return the url for the service or undefined
  */
  resolveServiceUrl (service) {
    if (service === SERVICES.DEFAULT) {
      return this.url
    } else {
      switch (this.type) {
        case Musicbox.TYPE_DEEZER:
          return Deezer.SERVICE_URLS[service]
        case Musicbox.TYPE_OVERCAST:
          return Overcast.SERVICE_URLS[service]
        default:
          return undefined
      }
    }
  }

  /**
  * Resolves the human name for a service
  * @param service: the type of service to resolve for
  * @return the url for the service or undefined
  */
  resolveServiceName (service) {
    if (service === SERVICES.DEFAULT) {
      return this.typeName
    } else {
      switch (this.type) {
        case Musicbox.TYPE_DEEZER:
          return Deezer.SERVICE_NAMES[service]
        case Musicbox.TYPE_OVERCAST:
          return Overcast.SERVICE_NAMES[service]
        default:
          return undefined
      }
    }
  }

  /* **************************************************************************/
  // Properties : Options
  /* **************************************************************************/

  get zoomFactor () { return this._value_('zoomFactor', 1.0) }
  get showUnreadBadge () { return this._value_('showUnreadBadge', true) }
  get unreadCountsTowardsAppUnread () { return this._value_('unreadCountsTowardsAppUnread', true) }
  get showNotifications () { return this._value_('showNotifications', true) }
  get isPlaying () { return this._value_('isPlaying', false) }
  get artificiallyPersistCookies () { return this._value_('artificiallyPersistCookies', false) }
  get init () {
    let data = this._value_('tracklist', {
      track: {"data":[]},
      index: 0,
    });
    data.type = 'player_default_playlist'
    data.auto_play = this.isPlaying
    data.show_lyrics = false
    return data
  }

  /* **************************************************************************/
  // Properties : Account Details
  /* **************************************************************************/

  get avatarURL () { return this.__data__.avatar }
  get hasCustomAvatar () { return this.__data__.customAvatar !== undefined }
  get customAvatarId () { return this.__data__.customAvatar }
  get currentTrack () { return this._value_('currentTrack', false) }

  get color () {
    if (this.__data__.color) {
      return this.__data__.color
    } else if (this.type === Musicbox.TYPE_DEEZER) {
      return 'rgb(66, 133, 244)'
    } else {
      return 'rgb(0,0,0)'
    }
  }
  get email () { return this.__data__.email }
  get name () { return this.__data__.name }
  get unread () { return this.__musicbox__.unreadCount }

  /* **************************************************************************/
  // Properties : Auth types
  /* **************************************************************************/

  get musicbox () { return this.__musicbox__ }

  /* **************************************************************************/
  // Properties : Custom injectables
  /* **************************************************************************/

  get customCSS () { return this.__data__.customCSS }
  get hasCustomCSS () { return !!this.customCSS }

  get customJS () { return this.__data__.customJS }
  get hasCustomJS () { return !!this.customJS }
}

module.exports = Musicbox
