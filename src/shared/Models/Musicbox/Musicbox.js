const Model = require('../Model')
const uuid = require('uuid')
const Streaming = require('./Streaming')
const SERVICES = require('./MusicboxServices')
const TYPES = require('./MusicboxTypes')
const URLS = require('./MusicboxURLs')
const COLORS = require('./MusicboxColors')

class Musicbox extends Model {

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static provisionId () { return uuid.v4() }
  static get TYPES () { return Object.assign({}, TYPES) }
  static get SERVICES () { return Object.assign({}, SERVICES) }

  static get TYPE_DEEZER () { return Musicbox.TYPES.DEEZER }

  static get TYPE_MFP () { return Musicbox.TYPES.MFP }

  static get TYPE_OVERCAST () { return Musicbox.TYPES.OVERCAST }

  static get TYPE_SPOTIFY () { return Musicbox.TYPES.SPOTIFY }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor (id, data) {
    // console.log('Musicbox.constructor', id, data);
    super(data)
    this.__id__ = id

    switch (this.type) {
      case Musicbox.TYPE_DEEZER:
        this.__musicbox__ = new Streaming(
          this.type,
          this.__data__.deezerConf
        )
        break
      case Musicbox.TYPE_MFP:
        this.__musicbox__ = new Streaming(
          this.type,
          this.__data__.mfpConf
        )
        break
      case Musicbox.TYPE_OVERCAST:
        this.__musicbox__ = new Streaming(
          this.type,
          this.__data__.overcastConf
        )
        break
      case Musicbox.TYPE_SPOTIFY:
        this.__musicbox__ = new Streaming(
          this.type,
          this.__data__.spotifyConf
        )
        break
    }
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get username () { return this._value_('username', false) }

  get trackTime () { return this._value_('trackTime', 0) }

  get typeWithUsername () { return this.username ? `${this.typeName} (${this.username})` : this.typeName }
  get id () { return this.__id__ }
  get type () { return this._value_('type', Musicbox.TYPE_DEEZER) }

  /* **************************************************************************/
  // Properties: Constants
  /* **************************************************************************/

  get typeName () {
    switch (this.type) {
      case Musicbox.TYPE_DEEZER: return 'Deezer'
      case Musicbox.TYPE_MFP: return 'musicForProgramming'
      case Musicbox.TYPE_OVERCAST: return 'Overcast'
      case Musicbox.TYPE_SPOTIFY: return 'Spotify'
      default: return undefined
    }
  }
  get url () {
    // console.log('Musicbox.get url', this.type, Musicbox.TYPE_DEEZER, `http://www.deezer.com`);
    if (typeof URLS[this.type] !== 'undefined') { return URLS[this.type] }
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
      case Musicbox.TYPE_MFP:
      case Musicbox.TYPE_OVERCAST:
      case Musicbox.TYPE_SPOTIFY:
        return Array.from(Streaming.SUPPORTED_SERVICES)
      default:
        return []
    }
  }
  get defaultServices () {
    switch (this.type) {
      case Musicbox.TYPE_DEEZER:
      case Musicbox.TYPE_MFP:
      case Musicbox.TYPE_OVERCAST:
      case Musicbox.TYPE_SPOTIFY:
        return Array.from(Streaming.DEFAULT_SERVICES)
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
        case Musicbox.TYPE_MFP:
        case Musicbox.TYPE_OVERCAST:
        case Musicbox.TYPE_SPOTIFY:
          return Streaming.SERVICE_URLS[service]
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
        case Musicbox.TYPE_MFP:
        case Musicbox.TYPE_OVERCAST:
        case Musicbox.TYPE_SPOTIFY:
          return Streaming.SERVICE_NAMES[service]
        default:
          return undefined
      }
    }
  }

  /* **************************************************************************/
  // Properties : Options
  /* **************************************************************************/

  get zoomFactor () { return this._value_('zoomFactor', 1.0) }
  get showNotifications () { return this._value_('showNotifications', true) }
  get isPlaying () { return this._value_('isPlaying', undefined) }
  get artificiallyPersistCookies () { return this._value_('artificiallyPersistCookies', false) }
  get init () {
    let data = this._value_('tracklist', {
      track: {'data': []},
      index: 0
    })
    if (this.type === Musicbox.TYPE_DEEZER) {
      data.type = 'player_default_playlist'
      data.show_lyrics = false
    }
    data.auto_play = this.isPlaying
    data.track_position = this.trackTime
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
    return this.style.color
  }

  get backgroundColor () {
    return this.style.backgroundColor
  }

  get style () {
    const customStyle = this.__data__.color ? {color: this.__data__.color} : {}
    const musicBoxStyle = COLORS[this.type] || {}
    return Object.assign({}, COLORS['default'], musicBoxStyle, customStyle)
  }

  get name () { return this.__data__.name }

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
