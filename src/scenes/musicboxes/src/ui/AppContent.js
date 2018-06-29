const React = require('react')
const PropTypes = require('prop-types')
const MusicboxWindows = require('./Musicbox/MusicboxWindows')
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
import { Drawer } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const addLink = require('shared/addLink')
addLink(__dirname, '/layout.less')
addLink(__dirname, '/appContent.less')
const createReactClass = require('create-react-class')

const styles = {
  sidebarMargin: {marginLeft: 70},
  sidebarWidth: {width: 'calc(100% - 70px)'}
}

const AppContent = createReactClass({
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
      sidebar: settingsState.ui ? settingsState.ui.sidebarEnabled : true,
      titlebar: settingsState.ui ? settingsState.ui.showTitlebar : false,
      settingsDialog: false,
      settingsRoute: null
    }
  },

  settingsDidUpdate (settingsState) {
    this.setState({
      sidebar: settingsState.ui.sidebarEnabled,
      titlebar: settingsState.ui.showTitlebar
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
    const {sidebar, titlebar, settingsDialog, settingsRoute} = this.state
    const {classes} = this.props
    const sidebarClasses = {root: sidebar ? [classes.sidebarMargin, classes.sidebarWidth].join(' ') : ''}
    const detail = sidebar ? 'detail with-sidebar' : 'detail'
    const content = titlebar ? 'content with-titlebar' : 'content'

    return (
      <div>
        {titlebar ? (<div className='titlebar' />) : null}
        <div className={content}>
          <Drawer variant='persistent'
            className='master sidebar'
            open={sidebar}>
            <Sidelist />
          </Drawer>
          <div className={detail}>
            <MusicboxWindows />
          </div>
          <SettingsDialog
            sidebarClasses={sidebarClasses}
            // className={sidebarClass}
            open={settingsDialog}
            onClose={this.handleCloseSettings}
            initialRoute={settingsRoute}/>
          <DictionaryInstallHandler />
          <AppWizard sidebarClasses={sidebarClasses}/>
          <MusicboxWizard sidebarClasses={sidebarClasses}/>
          <NewsDialog sidebarClasses={sidebarClasses}/>
          <UpdateCheckDialog sidebarClasses={sidebarClasses}/>
        </div>
      </div>
    )
  }
})

const styledAppContent = withStyles(styles)(AppContent)
// const AppContentClass = AppContent)
module.exports = styledAppContent
