const React = require('react')
const MusicboxWindows = require('./Musicbox/MusicboxWindows')
const MailboxComposePicker = require('./Mailbox/MailboxComposePicker')
const Sidelist = require('./Sidelist')
const shallowCompare = require('react-addons-shallow-compare')
const SettingsDialog = require('./Settings/SettingsDialog')
const DictionaryInstallHandler = require('./DictionaryInstaller/DictionaryInstallHandler')
const {navigationDispatch} = require('../Dispatch')
const UpdateCheckDialog = require('./UpdateCheckDialog')
const { settingsStore } = require('../stores/settings')
const MusicboxWizard = require('./MusicboxWizard')
const AppWizard = require('./AppWizard')
const NewsDialog = require('./NewsDialog')

const addLink = require('shared/addLink')
addLink(__dirname, '/layout.less')
addLink(__dirname, '/appContent.less')

const AppContent = React.createClass({
  displayName: 'AppContent',

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsDidUpdate)
    navigationDispatch.on('opensettings', this.handleOpenSettings)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsDidUpdate)
    navigationDispatch.off('opensettings', this.handleOpenSettings)
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    const settingsState = settingsStore.getState()
    return {
      sidebar: settingsState.ui.sidebarEnabled,
      titlebar: settingsState.ui.showTitlebar,
      settingsDialog: false,
      settingsRoute: null
    }
  },

  settingsDidUpdate (settingsStatee) {
    this.setState({
      sidebar: settingsStatee.ui.sidebarEnabled,
      titlebar: settingsStatee.ui.showTitlebar
    })
  },

  /* **************************************************************************/
  // Settings Interaction
  /* **************************************************************************/

  /**
  * Opens the settings dialog
  * @param evt: the event that fired if any
  */
  handleOpenSettings (evt) {
    this.setState({
      settingsDialog: true,
      settingsRoute: evt && evt.route ? evt.route : null
    })
  },

  handleCloseSettings () {
    this.setState({ settingsDialog: false, settingsRoute: null })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    return (
      <div>
        {!this.state.titlebar ? (<div className='titlebar' />) : undefined}
        <div className='master' style={{ display: this.state.sidebar ? 'block' : 'none' }}>
          <Sidelist />
        </div>
        <div className='detail' style={{ left: this.state.sidebar ? 70 : 0 }}>
          <MusicboxWindows />
        </div>
        <SettingsDialog
          open={this.state.settingsDialog}
          onRequestClose={this.handleCloseSettings}
          initialRoute={this.state.settingsRoute} />
        <DictionaryInstallHandler />
        <AppWizard />
        <MusicboxWizard />
        <NewsDialog />
        <UpdateCheckDialog />
        <MailboxComposePicker />
      </div>
    )
  }
})

// const AppContentClass = AppContent)
module.exports = AppContent
