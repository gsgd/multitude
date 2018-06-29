const React = require('react')
const PropTypes = require('prop-types')
const ReactDOM = require('react-dom')
import { Switch, FormControlLabel, Paper, Button, Icon } from '@material-ui/core'
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const DownloadSettingsSection = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'DownloadSettingsSection',
  propTypes: {
    os: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  },

  componentDidUpdate () {
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {os, ...passProps} = this.props

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Downloads</h1>
        <div>
          <FormControlLabel
            control={<Switch />}
            checked={os.alwaysAskDownloadLocation}
            label='Always ask download location'
            onChange={(evt, toggled) => settingsActions.setAlwaysAskDownloadLocation(toggled)} />
        </div>
        <div style={Object.assign({}, styles.button, { display: 'flex', alignItems: 'center' })}>
          <Button
            variant='raised'
            disabled={os.alwaysAskDownloadLocation}
            style={styles.fileInputButton}>
            <Icon className='material-icons'>folder</Icon>
            <input
              type='file'
              style={styles.fileInput}
              ref='defaultDownloadInput'
              disabled={os.alwaysAskDownloadLocation}
              onChange={(evt) => settingsActions.setDefaultDownloadLocation(evt.target.files[0].path)} />
            Select location
          </Button>
          {os.alwaysAskDownloadLocation ? undefined : <small>{os.defaultDownloadLocation}</small>}
        </div>
      </Paper>
    )
  }
})
module.exports = DownloadSettingsSection
