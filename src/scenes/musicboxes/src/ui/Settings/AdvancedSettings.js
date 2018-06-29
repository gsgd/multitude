const React = require('react')
const PropTypes = require('prop-types')
import { Switch, FormControlLabel, TextField, Paper, Grid } from '@material-ui/core'
const { Container, Row, Col } = require('../../Components/Grid')

const flux = {
  settings: require('../../stores/settings')
}
const styles = require('./settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const AdvancedSettings = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AdvancedSettings',
  propTypes: {
    showRestart: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    flux.settings.S.listen(this.settingsChanged)
  },

  componentWillUnmount () {
    flux.settings.S.unlisten(this.settingsChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  /**
  * Generates the state from the settings
  * @param store=settingsStore: the store to use
  */
  generateState (store = flux.settings.S.getState()) {
    return {
      proxyEnabled: store.proxy.enabled,
      proxyHost: store.proxy.host || '',
      proxyPort: store.proxy.port || '',
      app: store.app
    }
  },

  getInitialState () {
    return this.generateState()
  },

  settingsChanged (store) {
    this.setState(this.generateState(store))
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Enables / disables the proxy server
  */
  handleProxyToggle (evt, toggled) {
    flux.settings.A[toggled ? 'enableProxyServer' : 'disableProxyServer']()
  },

  handleProxyValueChanged (event) {
    flux.settings.A.enableProxyServer(
      this.refs.proxy_host.getValue(),
      this.refs.proxy_port.getValue()
    )
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { proxyEnabled, proxyPort, proxyHost, app } = this.state
    const { showRestart, ...passProps } = this.props
    const spacing = 16

    return (
      <div>
        <Grid container direction='row' spacing={spacing} alignItems='stretch'>
          <Grid item sm={12} md={6}>
            <Paper elevation={1} style={styles.paper}>
              <h1 style={styles.subheading}>Proxy Server</h1>
              <FormControlLabel
                control={<Switch/>}
                name='proxyEnabled'
                checked={proxyEnabled}
                label='Enable Proxy Server'
                onChange={this.handleProxyToggle}/>
              <small>You also need to set the proxy settings on your OS to ensure all requests use the server</small>
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                    id='proxy_host'
                    placeholder='http://192.168.1.1'
                    helperText='Proxy Server Host'
                    defaultValue={proxyHost}
                    onChange={this.handleProxyValueChanged}
                    disabled={!proxyEnabled}/>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id='proxy_port'
                    placeholder='8080'
                    helperText='Proxy Server Port'
                    defaultValue={proxyPort}
                    onChange={this.handleProxyValueChanged}
                    disabled={!proxyEnabled}/>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper elevation={1} style={styles.paper}>
              <FormControlLabel
                control={<Switch/>}
                checked={app.ignoreGPUBlacklist}
                label='Ignore GPU Blacklist (Requires Restart)'
                onChange={(evt, toggled) => {
                  showRestart()
                  flux.settings.A.ignoreGPUBlacklist(toggled)
                }} />
              <FormControlLabel
                control={<Switch/>}
                checked={app.enableUseZoomForDSF}
                label='Use Zoom For DSF (Requires Restart)'
                onChange={(evt, toggled) => {
                  showRestart()
                  flux.settings.A.enableUseZoomForDSF(toggled)
                }} />
              <FormControlLabel
                control={<Switch/>}
                checked={app.disableSmoothScrolling}
                label='Disable Smooth Scrolling (Requires Restart)'
                onChange={(evt, toggled) => {
                  showRestart()
                  flux.settings.A.disableSmoothScrolling(toggled)
                }} />
              <FormControlLabel
                control={<Switch/>}
                checked={app.checkForUpdates}
                label='Check for updates'
                onChange={(evt, toggled) => {
                  showRestart()
                  flux.settings.A.checkForUpdates(toggled)
                }} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
})
module.exports = AdvancedSettings
