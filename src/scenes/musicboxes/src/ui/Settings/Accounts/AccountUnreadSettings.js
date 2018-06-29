const React = require('react')
const PropTypes = require('prop-types')
import {Paper, Switch, FormControlLabel, NativeSelect, FormHelperText} from '@material-ui/core'
const Musicbox = require('shared/Models/Musicbox/Musicbox')
const Streaming = require('shared/Models/Musicbox/Streaming')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
import grey from '@material-ui/core/colors'
const createReactClass = require('create-react-class')

const AccountUnreadSettings = createReactClass({
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  displayName: 'AccountUnreadSettings',
  propTypes: {
    musicbox: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, ...passProps } = this.props

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Unread &amp; Notifications</h1>
        <FormControlLabel
          control={<Switch />}
          checked={musicbox.showUnreadBadge}
          label='Show unread badge'
          onChange={(evt, toggled) => musicboxActions.setShowUnreadBage(musicbox.id, toggled)} />
        <FormControlLabel
          control={<Switch />}
          checked={musicbox.unreadCountsTowardsAppUnread}
          label='Add unread messages to app unread count'
          onChange={(evt, toggled) => musicboxActions.setUnreadCountsTowardsAppUnread(musicbox.id, toggled)} />
        <FormControlLabel
          control={<Switch />}
          checked={musicbox.showNotifications}
          label='Show notifications'
          onChange={(evt, toggled) => musicboxActions.setShowNotifications(musicbox.id, toggled)} />
        {musicbox.type === Musicbox.TYPE_GINBOX ? (
          <div>
            <NativeSelect
              fullWidth
              value={musicbox.google.unreadMode}
              onChange={(evt, index, unreadMode) => {
                musicboxActions.updateStreamingConfig(musicbox.id, { unreadMode: unreadMode })
              }}
            >
              <option
                key={Streaming.UNREAD_MODES.GINBOX_DEFAULT}
                value={Streaming.UNREAD_MODES.GINBOX_DEFAULT}>
                All Unread Unbundled Messages
              </option>
              <option
                key={Streaming.UNREAD_MODES.INBOX_UNREAD}
                value={Streaming.UNREAD_MODES.INBOX_UNREAD}>
                All Unread Messages
              </option>
              <option
                key={Streaming.UNREAD_MODES.INBOX}
                value={Streaming.UNREAD_MODES.INBOX}>
                All Messages in inbox
              </option>
            </NativeSelect>
            <FormHelperText>Unread Mode</FormHelperText>
          </div>
        ) : undefined}
        {musicbox.type === Musicbox.TYPE_GMAIL ? (
          <div>
            <NativeSelect
              fullWidth
              value={musicbox.google.unreadMode}
              onChange={(evt, index, unreadMode) => {
                musicboxActions.updateStreamingConfig(musicbox.id, { unreadMode: unreadMode })
              }}>
              <option
                key={Streaming.UNREAD_MODES.INBOX_UNREAD}
                value={Streaming.UNREAD_MODES.INBOX_UNREAD}>
                All Unread Messages
              </option>
              <option
                key={Streaming.UNREAD_MODES.PRIMARY_INBOX_UNREAD}
                value={Streaming.UNREAD_MODES.PRIMARY_INBOX_UNREAD}>
                Unread Messages in Primary Category
              </option>
              <option
                key={Streaming.UNREAD_MODES.INBOX_UNREAD_IMPORTANT}
                value={Streaming.UNREAD_MODES.INBOX_UNREAD_IMPORTANT}>
                Unread Important Messages
              </option>
              <option
                key={Streaming.UNREAD_MODES.INBOX}
                value={Streaming.UNREAD_MODES.INBOX}>
                All Messages in inbox
              </option>
            </NativeSelect>
            <FormHelperText>Unread Mode</FormHelperText>
          </div>
        ) : undefined}
        {musicbox.type === Musicbox.TYPE_GMAIL ? (
          <div>
            <FormControlLabel
              control={<Switch />}
              checked={musicbox.google.takeLabelCountFromUI}
              label='Scrape unread count directly from UI'
              disabled={!musicbox.google.canChangeTakeLabelCountFromUI}
              onChange={(evt, toggled) => {
                musicboxActions.updateStreamingConfig(musicbox.id, { takeLabelCountFromUI: toggled })
              }} />
            <div style={{color: grey[500]}}>
              <small>This will take the unread count directly from the Gmail user interface. This can improve unread count accuracy</small>
            </div>
          </div>
        ) : undefined}
      </Paper>
    )
  }
})
module.exports = AccountUnreadSettings
