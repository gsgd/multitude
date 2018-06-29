const React = require('react')
const PropTypes = require('prop-types')
import { Paper, Switch, FormControlLabel } from '@material-ui/core'
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const AccountAdvancedSettings = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountAdvancedSettings',
  propTypes: {
    musicbox: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, showRestart, ...passProps } = this.props

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Advanced</h1>
        <FormControlLabel
          control={<Switch />}
          checked={musicbox.artificiallyPersistCookies}
          label='Artificially Persist Cookies. Use if you are signed out every restart. (Requires Restart)'
          onChange={(evt, toggled) => {
            showRestart()
            musicboxActions.artificiallyPersistCookies(musicbox.id, toggled)
          }} />
      </Paper>
    )
  }
})
module.exports = AccountAdvancedSettings
