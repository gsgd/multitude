const React = require('react')
const PropTypes = require('prop-types')
const {
  Dialog, DialogTitle, DialogContent, DialogActions, AppBar, Button,
  Tabs, Tab
} = require('@material-ui/core')
const GeneralSettings = require('./GeneralSettings')
const AccountSettings = require('./AccountSettings')
const AdvancedSettings = require('./AdvancedSettings')
import * as Colors from '@material-ui/core/colors'
const styles = require('./settingStyles')
const { ipcRenderer } = require('electron')
const createReactClass = require('create-react-class')

const SettingsDialog = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SettingsDialog',
  propTypes: {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    initialRoute: PropTypes.object
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillReceiveProps (nextProps) {
    if (this.props.open !== nextProps.open) {
      const updates = { showRestart: false }
      if (nextProps.open) {
        updates.currentTab = (nextProps.initialRoute || {}).tab || 'general'
      }
      this.setState(updates)
    }
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      currentTab: (this.props.initialRoute || {}).tab || 'general',
      showRestart: false
    }
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Changes the tab
  */
  handleTabChange (event, value) {
    if (typeof (value) === 'string') {
      this.setState({ currentTab: value })
    }
  },

  handleClose () {
    this.setState({open: false})
  },
  /**
  * Shows the option to restart
  */
  handleShowRestart () {
    this.setState({ showRestart: true })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.currentTab !== nextState.currentTab) { return true }
    if (this.state.showRestart !== nextState.showRestart) { return true }
    if (nextProps.open !== this.props.open) { return true }

    return false
  },

  render () {
    const { showRestart, currentTab } = this.state
    const {onClose, initialRoute, open, sidebarClasses} = this.props

    const buttons = showRestart ? (
      <div style={{ textAlign: 'right' }}>
        <Button style={{marginRight: 16}} onClick={onClose}>Close</Button>
        <Button color='primary' onClick={() => ipcRenderer.send('relaunch-app', {})}>Restart</Button>
      </div>
    ) : (
      <div style={{ textAlign: 'right' }}>
        <Button color='primary' onClick={onClose}>Close</Button>
      </div>
    )

    return (
      <Dialog
        classes={sidebarClasses}
        fullScreen
        maxWidth={false}
        open={open}
        onClose={onClose}>
        <DialogTitle>
          <AppBar
            classes={sidebarClasses}>
            <Tabs
              value={currentTab}
              fullWidth
              onChange={this.handleTabChange}
              centered>
              <Tab label='General' value='general'/>
              <Tab label='Accounts' value='accounts'/>
              <Tab label='Advanced' value='advanced'/>
            </Tabs>
          </AppBar>
        </DialogTitle>
        <DialogContent>
          {currentTab === 'general' && <GeneralSettings showRestart={this.handleShowRestart}/>}
          {currentTab === 'advanced' && <AdvancedSettings showRestart={this.handleShowRestart}/>}
          {currentTab === 'accounts' && <AccountSettings
            showRestart={this.handleShowRestart}
            initialMusicboxId={(initialRoute || {}).musicboxId}/>}
        </DialogContent>
        <DialogActions>
          {showRestart && <Button
            variant='raised'
            color='primary' onClick={() => ipcRenderer.send('relaunch-app', {})}>Restart</Button>}
          <Button variant='raised' color='primary' onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = SettingsDialog
