const Model = require('../Model')
const SERVICES = require('./MusicboxServices')

const SERVICE_URLS = { }

const SERVICE_NAMES = { }

class Streaming extends Model {

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  static get SUPPORTED_SERVICES () { return Object.keys(SERVICES).map((k) => SERVICES[k]) }
  static get DEFAULT_SERVICES () { return [] }
  static get SERVICE_URLS () { return SERVICE_URLS }
  static get SERVICE_NAMES () { return SERVICE_NAMES }

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor (type, config) {
    super({
      config: config || {}
    })
    this.__type__ = type
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get type () { return this.__type__ }

  get lastNotifiedInternalDate () {
    return this.__data__.unreadMessages.lastNotifiedInternalDate || 0
  }

}

module.exports = Streaming
