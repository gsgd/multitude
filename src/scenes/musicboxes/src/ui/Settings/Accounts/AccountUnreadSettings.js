const React = require('react')
const {Paper, Toggle, SelectField, MenuItem} = require('material-ui')
const Musicbox = require('shared/Models/Musicbox/Musicbox')
const Streaming = require('shared/Models/Musicbox/Streaming')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const Colors = require('material-ui/styles/colors')

module.exports = React.createClass({
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  displayName: 'AccountUnreadSettings',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired
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
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Unread &amp; Notifications</h1>
        <Toggle
          defaultToggled={musicbox.showUnreadBadge}
          label='Show unread badge'
          labelPosition='right'
          onToggle={(evt, toggled) => musicboxActions.setShowUnreadBage(musicbox.id, toggled)} />
        <Toggle
          defaultToggled={musicbox.unreadCountsTowardsAppUnread}
          label='Add unread messages to app unread count'
          labelPosition='right'
          onToggle={(evt, toggled) => musicboxActions.setUnreadCountsTowardsAppUnread(musicbox.id, toggled)} />
        <Toggle
          defaultToggled={musicbox.showNotifications}
          label='Show notifications'
          labelPosition='right'
          onToggle={(evt, toggled) => musicboxActions.setShowNotifications(musicbox.id, toggled)} />
        {musicbox.type === Musicbox.TYPE_GINBOX ? (
          <SelectField
            fullWidth
            value={musicbox.google.unreadMode}
            onChange={(evt, index, unreadMode) => {
              musicboxActions.updateStreamingConfig(musicbox.id, { unreadMode: unreadMode })
            }}
            floatingLabelText='Unread Mode'>
            <MenuItem
              key={Streaming.UNREAD_MODES.GINBOX_DEFAULT}
              value={Streaming.UNREAD_MODES.GINBOX_DEFAULT}
              primaryText='All Unread Unbundled Messages' />
            <MenuItem
              key={Streaming.UNREAD_MODES.INBOX_UNREAD}
              value={Streaming.UNREAD_MODES.INBOX_UNREAD}
              primaryText='All Unread Messages' />
            <MenuItem
              key={Streaming.UNREAD_MODES.INBOX}
              value={Streaming.UNREAD_MODES.INBOX}
              primaryText='All Messages in inbox' />
          </SelectField>
        ) : undefined}
        {musicbox.type === Musicbox.TYPE_GMAIL ? (
          <SelectField
            fullWidth
            value={musicbox.google.unreadMode}
            onChange={(evt, index, unreadMode) => {
              musicboxActions.updateStreamingConfig(musicbox.id, { unreadMode: unreadMode })
            }}
            floatingLabelText='Unread Mode'>
            <MenuItem
              key={Streaming.UNREAD_MODES.INBOX_UNREAD}
              value={Streaming.UNREAD_MODES.INBOX_UNREAD}
              primaryText='All Unread Messages' />
            <MenuItem
              key={Streaming.UNREAD_MODES.PRIMARY_INBOX_UNREAD}
              value={Streaming.UNREAD_MODES.PRIMARY_INBOX_UNREAD}
              primaryText='Unread Messages in Primary Category' />
            <MenuItem
              key={Streaming.UNREAD_MODES.INBOX_UNREAD_IMPORTANT}
              value={Streaming.UNREAD_MODES.INBOX_UNREAD_IMPORTANT}
              primaryText='Unread Important Messages' />
            <MenuItem
              key={Streaming.UNREAD_MODES.INBOX}
              value={Streaming.UNREAD_MODES.INBOX}
              primaryText='All Messages in inbox' />
          </SelectField>
        ) : undefined}
        {musicbox.type === Musicbox.TYPE_GMAIL ? (
          <div>
            <Toggle
              defaultToggled={musicbox.google.takeLabelCountFromUI}
              label='Scrape unread count directly from UI'
              labelPosition='right'
              disabled={!musicbox.google.canChangeTakeLabelCountFromUI}
              onToggle={(evt, toggled) => {
                musicboxActions.updateStreamingConfig(musicbox.id, { takeLabelCountFromUI: toggled })
              }} />
            <div style={{color: Colors.grey500}}>
              <small>This will take the unread count directly from the Gmail user interface. This can improve unread count accuracy</small>
            </div>
          </div>
        ) : undefined}
      </Paper>
    )
  }
})
