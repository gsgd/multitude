const React = require('react')
const {Toggle, Paper, SelectField, MenuItem} = require('material-ui')
const settingsActions = require('../../../stores/settings/settingsActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const {getVoices} = require('shared/voices')

const NotificationSettingsSection = React.createClass({

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
    os: React.PropTypes.object.isRequired
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
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Notifications</h1>
        <Toggle
          toggled={os.notificationsEnabled}
          labelPosition='right'
          label='Show track notifications'
          onToggle={(evt, toggled) => settingsActions.setNotificationsEnabled(toggled)} />
        <Toggle
          toggled={!os.notificationsSilent}
          label='Speak track names'
          labelPosition='right'
          disabled={!os.notificationsEnabled}
          onToggle={(evt, toggled) => settingsActions.setNotificationsSilent(!toggled)} />
        <SelectField
          fullWidth
          floatingLabelText='Choose voice for track names'
          disabled={!os.notificationsEnabled}
          onChange={this.handleNotificationVoiceChanged}
          value={os.notificationsVoice}>
          {voices.map((voice, index) => {
            return (<MenuItem key={voice.voiceURI} value={index} primaryText={`${voice.voiceURI} (${voice.lang})`}/>)
          })}
        </SelectField>

      </Paper>
    )
  }
})
module.exports = NotificationSettingsSection
