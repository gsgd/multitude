const React = require('react')
const PropTypes = require('prop-types')
import { Switch, FormControlLabel, Paper, NativeSelect, FormHelperText, Grid } from '@material-ui/core'
const { TrayIconEditor } = require('../../../Components')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const Tray = require('../../Tray')
const createReactClass = require('create-react-class')

const TraySettingsSection = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'TraySettingsSection',
  propTypes: {
    tray: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {tray, ...passProps} = this.props

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <Grid container>
          <Grid item sm={6}>
            <h1 style={styles.subheading}>{process.platform === 'darwin' ? 'Menu Bar' : 'Tray'}</h1>
            <FormControlLabel
              control={<Switch/>}
              checked={tray.show}
              label='Show icon'
              onChange={(evt, toggled) => settingsActions.setShowTrayIcon(toggled)}/>
            <FormControlLabel
              control={<Switch/>}
              checked={tray.showActiveTrack}
              label='Show active track'
              disabled={!tray.show}
              onChange={(evt, toggled) => settingsActions.setShowTrayUnreadCount(toggled)}/>
            {Tray.platformSupportsDpiMultiplier() ? (
              <div>
                <NativeSelect
                  value={tray.dpiMultiplier}
                  onChange={(evt, index, value) => settingsActions.setDpiMultiplier(value)}>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                  <option value={4}>4x</option>
                  <option value={5}>5x</option>
                </NativeSelect>
                <FormHelperText>DPI Multiplier</FormHelperText>
              </div>
            ) : undefined}
          </Grid>
          <Grid item sm={6}>
            <TrayIconEditor tray={tray}/>
          </Grid>
        </Grid>
      </Paper>
    )
  }
})
module.exports = TraySettingsSection
