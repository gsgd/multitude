const Model = require('../Model')

class TraySettings extends Model {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
  * @param data: the tray data
  * @param themedDefaults: the default values for the tray
  */
  constructor (data, themedDefaults = {}) {
    super(data)
    this.__themedDefaults__ = Object.freeze(Object.assign({}, themedDefaults))
  }

  /* **************************************************************************/
  // Properties
  /* **************************************************************************/

  get show () { return this._value_('show', true) }
  get showActiveTrack () { return this._value_('showActiveTrack', true) }
  get color () { return this._value_('color', this.__themedDefaults__.color) }
  get backgroundColor () { return this._value_('backgroundColor', this.__themedDefaults__.backgroundColor) }
  get pressedColor () { return this._value_('pressedColor', this.__themedDefaults__.pressedColor) }
  get pressedBackgroundColor () { return this._value_('pressedBackgroundColor', this.__themedDefaults__.pressedBackgroundColor) }

  get dpiMultiplier () {
    let defaultValue = 1
    try {
      defaultValue = window.devicePixelRatio
    } catch (ex) { }
    return this._value_('dpiMultiplier', defaultValue)
  }
}

module.exports = TraySettings
