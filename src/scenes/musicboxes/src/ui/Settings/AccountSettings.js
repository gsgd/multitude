const React = require('react')
const PropTypes = require('prop-types')
import { NativeSelect, FormHelperText, Avatar, Paper, Grid } from '@material-ui/core'
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
const createReactClass = require('create-react-class')
import { withTheme } from '@material-ui/core/styles'

const AccountSettings = createReactClass({
  displayName: 'AccountSettings',
  propTypes: {
    showRestart: PropTypes.func.isRequired,
    initialMusicboxId: PropTypes.string
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

  handleAccountChange (evt) {
    const musicboxId = evt.target.value
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
        <Paper elevation={1} style={styles.paper}>
          <small>No accounts available</small>
        </Paper>
      </div>
    )
  },

  renderMusicboxes () {
    const {selected} = this.state || this.props.musicboxes[0]
    const {showRestart, theme, ...passProps} = this.props
    const spacing = 16

    delete passProps.initialMusicboxId

    let avatarSrc = ''
    if (selected && selected.hasCustomAvatar) {
      avatarSrc = musicboxStore.getState().getAvatar(selected.customAvatarId)
    } else if (selected && selected.avatarURL) {
      avatarSrc = selected.avatarURL
    }

    return (
      <div {...passProps}>
        <div style={styles.accountPicker}>
          <Avatar
            src={avatarSrc}
            size={80}
            style={Object.assign({backgroundColor: theme.palette.primary.main}, styles.accountPickerAvatar)} />
          <div style={styles.accountPickerContainer}>
            <NativeSelect
              value={selected.id}
              style={{marginTop: -14}}
              fullWidth
              onChange={this.handleAccountChange}>
              {
                this.state.musicboxes.map((m) => {
                  return (
                    <option
                      value={m.id}
                      key={m.id}>
                      {(m.typeWithUsername)}
                    </option>
                  )
                })
              }
            </NativeSelect>
            <FormHelperText>Pick your account</FormHelperText>
          </div>
        </div>
        <Grid container direction='row' spacing={spacing} alignItems='stretch'>
          <Grid item sm={12} md={6}>
            <AccountUnreadSettings musicbox={selected}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <AccountAvatarSettings musicbox={selected}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <AccountCustomCodeSettings musicbox={selected}/>
          </Grid>
          {pkg.prerelease ? (
            <Grid item sm={12}>
              <AccountServiceSettings musicbox={selected}/>
            </Grid>
          ) : undefined}
          <Grid item xs={12} sm={6}>
            <AccountAdvancedSettings musicbox={selected} showRestart={showRestart}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <AccountManagementSettings musicbox={selected} />
          </Grid>
        </Grid>
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

const themed = withTheme()(AccountSettings)
module.exports = themed
