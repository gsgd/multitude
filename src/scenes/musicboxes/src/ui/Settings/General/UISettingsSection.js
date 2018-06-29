const React = require('react')
const PropTypes = require('prop-types')
import { Switch, Paper, FormControlLabel } from '@material-ui/core'
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const UISettingsSection = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'UISettingsSection',
  propTypes: {
    ui: PropTypes.object.isRequired,
    os: PropTypes.object.isRequired,
    news: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {
      ui,
      os,
      news,
      showRestart,
      ...passProps
    } = this.props

    return (
      <div {...passProps}>
        <Paper elevation={1} style={styles.paper}>
          <h1 style={styles.subheading}>User Interface</h1>
          {process.platform !== 'darwin' ? undefined : (
            <FormControlLabel
              control={
                <Switch />
              }
              checked={ui.showTitlebar}
              label='Show titlebar (Requires Restart)'
              onChange={(evt, toggled) => {
                showRestart()
                settingsActions.setShowTitlebar(toggled)
              }} />
          )}
          {process.platform === 'darwin' ? undefined : (
            <FormControlLabel
              control={
                <Switch />
              }
              checked={ui.showAppMenu}
              label='Show App Menu (Ctrl+\)'
              onChange={(evt, toggled) => settingsActions.setShowAppMenu(toggled)} />
          )}
          <FormControlLabel
            control={
              <Switch />
            }
            checked={ui.sidebarEnabled}
            label={`Show Sidebar (${process.platform === 'darwin' ? 'Ctrl+cmd+S' : 'Ctrl+shift+S'})`}
            onChange={(evt, toggled) => settingsActions.setEnableSidebar(toggled)} />
          <FormControlLabel
            control={
              <Switch />
            }
            checked={ui.showAppBadge}
            label='Show app unread badge'
            onChange={(evt, toggled) => settingsActions.setShowAppBadge(toggled)} />
          <FormControlLabel
            control={
              <Switch />
            }
            checked={ui.showTitlebarTrack}
            label='Show track in titlebar'
            onChange={(evt, toggled) => settingsActions.setShowTitlebarTrack(toggled)} />
          {process.platform === 'darwin' ? (
            <FormControlLabel
              control={
                <Switch />
              }
              checked={os.openLinksInBackground}
              label='Open links in background'
              onChange={(evt, toggled) => settingsActions.setOpenLinksInBackground(toggled)} />
          ) : undefined}
          <FormControlLabel
            control={
              <Switch />
            }
            checked={ui.openHidden}
            label='Always Start minimized'
            onChange={(evt, toggled) => settingsActions.setOpenHidden(toggled)} />
          <FormControlLabel
            control={
              <Switch />
            }
            checked={news.showNewsInSidebar}
            label='Always show news in sidebar'
            onChange={(evt, toggled) => { settingsActions.setShowNewsInSidebar(toggled) }} />
        </Paper>
      </div>
    )
  }
})
module.exports = UISettingsSection
