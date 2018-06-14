const Model = require('../Model')
const uuid = require('uuid')
const Streaming = require('./Streaming')
const SERVICES = require('./MusicboxServices')
const { MusicboxTypes, MusicboxData, Default } = require('./MusicboxConfiguration')

class Musicbox extends Model {

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static provisionId () { return uuid.v4() }
  static get TYPES () { return Object.assign({}, MusicboxTypes) }
  static get SERVICES () { return Object.assign({}, SERVICES) }

  static get TYPE_DEEZER () { return Musicbox.TYPES.DEEZER }

  static get TYPE_MFP () { return Musicbox.TYPES.MFP }

  static get TYPE_OVERCAST () { return Musicbox.TYPES.OVERCAST }

  static get TYPE_SOUNDCLOUD () { return Musicbox.TYPES.SOUNDCLOUD }

  static get TYPE_SPOTIFY () { return Musicbox.TYPES.SPOTIFY }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor (id, data) {
    // console.log('Musicbox.constructor', id, data);
    super(data)
    this.__id__ = id

    this.__musicbox__ = new Streaming(
      this.type,
      this.config
    )
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get username () { return this._value_('username', false) }

  get trackTime () { return this._value_('trackTime', 0) }

  get typeWithUsername () { return this.username ? `${this.typeName} (${this.username})` : this.typeName }
  get id () { return this.__id__ }
  get type () { return this._value_('type', Musicbox.TYPES.DEEZER) }
  get knownType () { return !!Musicbox.TYPES[this.type] }
  get config () { return this._value_(this.type.toLowerCase() + 'Conf', {}) }

  /* **************************************************************************/
  // Properties: Constants
  /* **************************************************************************/

  get typeName () {
    return MusicboxData[this.type] ? MusicboxData[this.type].title : undefined
  }
  get url () {
    if (typeof MusicboxData[this.type] !== 'undefined') { return MusicboxData[this.type].url }
  }

  get pageUrl () {
    // console.log('get pageUrl', this.__data__.pageUrl)
    if (this.__data__.pageUrl && typeof this.__data__.pageUrl === 'string') { return `${this.url}${this.__data__.pageUrl}` }
  }

  /* **************************************************************************/
  // Properties : Services
  /* **************************************************************************/

  get supportedServices () {
    return this.knownType ? Array.from(Streaming.SUPPORTED_SERVICES) : []
  }
  get defaultServices () {
    return this.knownType ? Array.from(Streaming.DEFAULT_SERVICES) : []
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
      return this.knownType ? Streaming.SERVICE_URLS[service] : undefined
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
      return this.knownType ? Streaming.SERVICE_NAMES[service] : undefined
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
    const tracklist = this._value_('tracklist', {
      track: {'data': []},
      index: 0
    })
    const playInfo = {
      auto_play: this.isPlaying,
      track_position: this.trackTime
    }
    return Object.assign({}, tracklist, playInfo)
  }

  /* **************************************************************************/
  // Properties : Account Details
  /* **************************************************************************/

  get avatarURL () {
    // console.log('avatarURL', this.__data__.avatar)
    return this.__data__.avatar ? this.__data__.avatar : MusicboxData[this.type].img
  }
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
    const musicBoxStyle = MusicboxData[this.type].style || {}
    return Object.assign({}, Default.style, musicBoxStyle, customStyle, this.__data__.style || {})
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
