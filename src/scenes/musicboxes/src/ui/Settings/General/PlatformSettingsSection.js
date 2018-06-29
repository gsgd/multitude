const React = require('react')
const PropTypes = require('prop-types')
import { Switch, FormControlLabel, Paper, NativeSelect, FormHelperText } from '@material-ui/core'
const platformActions = require('../../../stores/platform/platformActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')

const LOGIN_OPEN_MODES = {
  OFF: 'false|false',
  ON: 'true|false',
  ON_BACKGROUND: 'true|true'
}
const createReactClass = require('create-react-class')

const PlatformSettingsSection = createReactClass({
  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  displayName: 'PlatformSettingsSection',
  propTypes: {
    mailtoLinkHandlerSupported: PropTypes.bool.isRequired,
    isMailtoLinkHandler: PropTypes.bool.isRequired,
    openAtLoginSupported: PropTypes.bool.isRequired,
    openAtLogin: PropTypes.bool.isRequired,
    openAsHiddenAtLogin: PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the open at login state chaning
  */
  handleOpenAtLoginChanged (evt, index, value) {
    switch (value) {
      case LOGIN_OPEN_MODES.OFF:
        platformActions.changeLoginPref(false, false)
        break
      case LOGIN_OPEN_MODES.ON:
        platformActions.changeLoginPref(true, false)
        break
      case LOGIN_OPEN_MODES.ON_BACKGROUND:
        platformActions.changeLoginPref(true, true)
        break
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {
      mailtoLinkHandlerSupported,
      isMailtoLinkHandler,
      openAtLoginSupported,
      openAtLogin,
      openAsHiddenAtLogin,
      ...passProps
    } = this.props

    if (!mailtoLinkHandlerSupported && !openAtLoginSupported) { return null }

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Platform</h1>
        {mailtoLinkHandlerSupported ? (
          <FormControlLabel
            control={<Switch />}
            checked={isMailtoLinkHandler}
            label='Handle mailto links'
            onChange={(evt, toggled) => platformActions.changeMailtoLinkHandler(toggled)} />
        ) : undefined}
        {openAtLoginSupported ? (
          <div>
            <NativeSelect
              fullWidth
              onChange={this.handleOpenAtLoginChanged}
              value={`${openAtLogin}|${openAsHiddenAtLogin}`}>
              <option value={LOGIN_OPEN_MODES.OFF} >{'Don\'t open at login'}</option>
              <option value={LOGIN_OPEN_MODES.ON}>Open at login</option>
              <option value={LOGIN_OPEN_MODES.ON_BACKGROUND}>Open at login (in background)</option>
            </NativeSelect>
            <FormHelperText>Open at Login</FormHelperText>
          </div>
        ) : undefined}
      </Paper>
    )
  }
})
module.exports = PlatformSettingsSection
