const React = require('react')
const PropTypes = require('prop-types')
const {
  Grid: { Container, Row, Col }
} = require('../../Components')
const settingsStore = require('../../stores/settings/settingsStore')
const platformStore = require('../../stores/platform/platformStore')

const DownloadSettingsSection = require('./General/DownloadSettingsSection')
const LanguageSettingsSection = require('./General/LanguageSettingsSection')
const NotificationSettingsSection = require('./General/NotificationSettingsSection')
const TraySettingsSection = require('./General/TraySettingsSection')
const UISettingsSection = require('./General/UISettingsSection')
const InfoSettingsSection = require('./General/InfoSettingsSection')
const PlatformSettingsSection = require('./General/PlatformSettingsSection')
const createReactClass = require('create-react-class')
import { Grid } from '@material-ui/core'

const GeneralSettings = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'GeneralSettings',
  propTypes: {
    showRestart: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsChanged)
    platformStore.listen(this.platformChanged)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsChanged)
    platformStore.unlisten(this.platformChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  /**
  * Generates the settings state from the settings
  * @param store=settingsStore: the store to use
  */
  generateSettingsState (store = settingsStore.getState()) {
    return {
      ui: store.ui,
      os: store.os,
      news: store.news,
      language: store.language,
      tray: store.tray
    }
  },

  /**
  * Generates the platform state from the settings
  * @param store=platformStore: the store to use
  */
  generatePlatformState (store = platformStore.getState()) {
    const loginPref = store.loginPrefAssumed()
    return {
      openAtLoginSupported: store.loginPrefSupported(),
      openAtLogin: loginPref.openAtLogin,
      openAsHiddenAtLogin: loginPref.openAsHidden,
      mailtoLinkHandlerSupported: store.mailtoLinkHandlerSupported(),
      isMailtoLinkHandler: store.isMailtoLinkHandler()
    }
  },

  getInitialState () {
    return Object.assign({}, this.generateSettingsState(), this.generatePlatformState())
  },

  settingsChanged (store) {
    this.setState(this.generateSettingsState(store))
  },

  platformChanged (store) {
    this.setState(this.generatePlatformState(store))
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the app
  */
  render () {
    const {
      ui,
      os,
      language,
      tray,
      news,
      openAtLoginSupported,
      openAtLogin,
      openAsHiddenAtLogin,
      mailtoLinkHandlerSupported,
      isMailtoLinkHandler
    } = this.state
    const {showRestart, ...passProps} = this.props
    const spacing = 16

    return (
      <div {...passProps}>
        <Grid container direction='row' spacing={spacing} alignItems='stretch'>
          <Grid item sm={12}>
            <UISettingsSection
              ui={ui}
              os={os}
              news={news}
              showRestart={showRestart} />
          </Grid>
          <Grid container item sm={6} xs={12}>
            <NotificationSettingsSection os={os} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <DownloadSettingsSection os={os}/>
          </Grid>
          <Grid item md={6} xs={12}>
            <LanguageSettingsSection language={language} showRestart={showRestart}/>
          </Grid>
          <Grid item md={6} xs={12}>
            <TraySettingsSection tray={tray}/>
          </Grid>
          <Grid item md={6} xs={12}>
            <PlatformSettingsSection
              mailtoLinkHandlerSupported={mailtoLinkHandlerSupported}
              isMailtoLinkHandler={isMailtoLinkHandler}
              openAtLoginSupported={openAtLoginSupported}
              openAtLogin={openAtLogin}
              openAsHiddenAtLogin={openAsHiddenAtLogin}/>
          </Grid>
          <Grid item md={6} xs={12}>
            <InfoSettingsSection/>
          </Grid>
        </Grid>
      </div>
    )
  }
})
module.exports = GeneralSettings
