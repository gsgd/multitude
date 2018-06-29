const React = require('react')
const PropTypes = require('prop-types')
import {Switch, FormControlLabel, FormControl, NativeSelect, FormHelperText, Paper} from '@material-ui/core'
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const {getVoices} = require('shared/voices')
const createReactClass = require('create-react-class')

const NotificationSettingsSection = createReactClass({

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
   * Handles the notification voice changing
   */
  handleNotificationVoiceChanged (evt, index, voice) {
    // console.log(evt, index, voice)
    settingsActions.setNotificationsVoice(voice)
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  displayName: 'NotificationSettingsSection',
  propTypes: {
    os: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    window.speechSynthesis.onvoiceschanged = this.settingsDidUpdate
  },

  componentWillUnmount () {
    window.speechSynthesis.onvoiceschanged = null
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      voices: getVoices()
    }
  },

  settingsDidUpdate (settingsState) {
    this.setState({
      voices: getVoices()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { os, ...passProps } = this.props
    const { voices } = this.state

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Notifications</h1>
        <FormControlLabel
          control={<Switch />}
          checked={os.notificationsEnabled}
          label='Show track notifications'
          onChange={(evt, toggled) => settingsActions.setNotificationsEnabled(toggled)} />
        <FormControlLabel
          control={<Switch />}
          checked={!os.notificationsSilent}
          label='Speak track names'
          disabled={!os.notificationsEnabled}
          onChange={(evt, toggled) => settingsActions.setNotificationsSilent(!toggled)} />
        <FormControl>
          <NativeSelect
            fullWidth
            disabled={!os.notificationsEnabled}
            onChange={this.handleNotificationVoiceChanged}
            value={os.notificationsVoice}>
            {voices.map((voice, index) => {
              return (<option key={voice.voiceURI} value={index}>{`${voice.voiceURI} (${voice.lang})`}</option>)
            })}
          </NativeSelect>
          <FormHelperText>Choose voice for track names</FormHelperText>
        </FormControl>
      </Paper>
    )
  }
})
module.exports = NotificationSettingsSection
