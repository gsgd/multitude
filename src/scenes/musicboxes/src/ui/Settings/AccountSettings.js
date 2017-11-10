const React = require('react')
const {SelectField, MenuItem, Avatar, Paper} = require('material-ui')
const {
  Grid: { Container, Row, Col }
} = require('../../Components')
const musicboxStore = require('../../stores/musicbox/musicboxStore')
const styles = require('./settingStyles')

const AccountAvatarSettings = require('./Accounts/AccountAvatarSettings')
const AccountUnreadSettings = require('./Accounts/AccountUnreadSettings')
const AccountCustomCodeSettings = require('./Accounts/AccountCustomCodeSettings')
const AccountAdvancedSettings = require('./Accounts/AccountAdvancedSettings')
const AccountManagementSettings = require('./Accounts/AccountManagementSettings')
const AccountServiceSettings = require('./Accounts/AccountServiceSettings')
const pkg = require('shared/appPackage')

module.exports = React.createClass({
  displayName: 'AccountSettings',
  propTypes: {
    showRestart: React.PropTypes.func.isRequired,
    initialMusicboxId: React.PropTypes.string
  },

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxStore.listen(this.musicboxesChanged)
  },

  componentWillUnmount () {
    musicboxStore.unlisten(this.musicboxesChanged)
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.initialMusicboxId !== nextProps.initialMusicboxId) {
      const musicbox = musicboxStore.getState().getMusicbox(nextProps.initialMusicboxId)
      if (musicbox) {
        this.setState({ selected: musicbox })
      }
    }
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const { initialMusicboxId } = this.props
    const store = musicboxStore.getState()
    const all = store.allMusicboxes()
    return {
      musicboxes: all,
      selected: (initialMusicboxId ? store.getMusicbox(initialMusicboxId) : all[0]) || all[0]
    }
  },

  musicboxesChanged (store) {
    const all = store.allMusicboxes()
    if (this.state.selected) {
      this.setState({
        musicboxes: all,
        selected: store.getMusicbox(this.state.selected.id) || all[0]
      })
    } else {
      this.setState({ musicboxes: all, selected: all[0] })
    }
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  handleAccountChange (evt, index, musicboxId) {
    this.setState({ selected: musicboxStore.getState().getMusicbox(musicboxId) })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  renderNoMusicboxes () {
    const passProps = Object.assign({}, this.props)
    delete passProps.showRestart
    delete passProps.initialMusicboxId

    return (
      <div {...passProps}>
        <Paper zDepth={1} style={styles.paper}>
          <small>No accounts available</small>
        </Paper>
      </div>
    )
  },

  renderMusicboxes () {
    const {selected} = this.state
    const {showRestart, ...passProps} = this.props
    delete passProps.initialMusicboxId

    let avatarSrc = ''
    if (selected.hasCustomAvatar) {
      avatarSrc = musicboxStore.getState().getAvatar(selected.customAvatarId)
    } else if (selected.avatarURL) {
      avatarSrc = selected.avatarURL
    }

    return (
      <div {...passProps}>
        <div style={styles.accountPicker}>
          <Avatar
            src={avatarSrc}
            size={60}
            backgroundColor='white'
            style={styles.accountPickerAvatar} />
          <div style={styles.accountPickerContainer}>
            <SelectField
              value={selected.id}
              style={{marginTop: -14}}
              floatingLabelText='Pick your account'
              fullWidth
              onChange={this.handleAccountChange}>
              {
                this.state.musicboxes.map((m) => {
                  return (
                    <MenuItem
                      value={m.id}
                      key={m.id}
                      primaryText={(m.typeWithUsername)}/>
                  )
                })
              }
            </SelectField>
          </div>
        </div>
        <Container fluid>
          <Row>
            <Col md={6}>
              <AccountUnreadSettings musicbox={selected} />
              <AccountAvatarSettings musicbox={selected} />
              <AccountCustomCodeSettings musicbox={selected} />
            </Col>
            <Col md={6}>
              {pkg.prerelease ? (
                <AccountServiceSettings musicbox={selected} />
              ) : undefined}
              <AccountAdvancedSettings musicbox={selected} showRestart={showRestart} />
              <AccountManagementSettings musicbox={selected} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  },

  render () {
    if (this.state.musicboxes.length) {
      return this.renderMusicboxes()
    } else {
      return this.renderNoMusicboxes()
    }
  }
})
