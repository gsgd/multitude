const alt = require('../alt')
const actions = require('./musicboxWizardActions')
const { Musicbox, Deezer } = require('shared/Models/Musicbox')
const { ipcRenderer } = window.nativeRequire('electron')
const reporter = require('../../reporter')
const musicboxActions = require('../musicbox/musicboxActions')
const deezerActions = require('../deezer/deezerActions')
// const deezerHTTP = require('../deezer/deezerHTTP')
const pkg = window.appPackage()

// console.log(actions);

class MusicboxWizardStore {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.addMusicboxOpen = false
    this.configurationOpen = false
    this.configureServicesOpen = false
    this.configurationCompleteOpen = false

    this.provisionalId = null
    this.provisionalJS = null

    /* ****************************************/
    // Query
    /* ****************************************/

    /**
    * @return true if any configuration dialogs are open
    */
    this.hasAnyItemsOpen = () => {
      return this.addMusicboxOpen || this.configurationOpen || this.configureServicesOpen || this.configurationCompleteOpen
    }

    /**
    * @return the type of the provisional musicbox or undefined
    */
    this.provisonaMusicboxType = () => {
      return (this.provisionalJS || {}).type
    }

    /**
    * @return the type of provisional services for the musicbox
    */
    this.provisionalMusicboxSupportedServices = () => {
      const type = this.provisonaMusicboxType()
      if (type === Musicbox.TYPE_DEEZER) {
        return Deezer.SUPPORTED_SERVICES.filter((s) => s !== Musicbox.SERVICES.DEFAULT)
      } else {
        return []
      }
    }

    /**
    * @return the default musicbox services for the musicbox
    */
    this.provisionalDefaultMusicboxServices = () => {
      const type = this.provisonaMusicboxType()
      if (type === Musicbox.TYPE_DEEZER) {
        return Deezer.DEFAULT_SERVICES
      } else {
        return []
      }
    }

    /* ****************************************/
    // Listeners
    /* ****************************************/

    this.bindListeners({
      handleOpenAddMusicbox: actions.OPEN_ADD_MUSICBOX,
      handleCancelAddMusicbox: actions.CANCEL_ADD_MUSICBOX,

      handleAuthDeezerMusicbox: actions.AUTH_DEEZER_MUSICBOX,
      handleAuthOvercastMusicbox: actions.AUTH_OVERCAST_MUSICBOX,
      // handleAuthDeezerMusicboxSuccess: actions.AUTH_DEEZER_MUSICBOX,
      handleReauthDeezerMusicbox: actions.REAUTH_DEEZER_MUSICBOX,

      handleAuthDeezerMusicboxSuccess: actions.AUTH_DEEZER_MUSICBOX_SUCCESS,
      handleAuthDeezerMusicboxFailure: actions.AUTH_DEEZER_MUSICBOX_FAILURE,

      handleConfigureMusicbox: actions.CONFIGURE_MUSICBOX,
      handleConfigureServices: actions.CONFIGURE_MUSICBOX_SERVICES,
      handleConfigurationComplete: actions.CONFIGURATION_COMPLETE
    })
  }

  /* **************************************************************************/
  // Utils
  /* **************************************************************************/

  /**
  * Resets everything to the original values
  */
  completeClear () {
    this.addMusicboxOpen = false
    this.configurationOpen = false
    this.configureServicesOpen = false
    this.configurationCompleteOpen = false
    this.provisionalId = null
    this.provisionalJS = null
  }

  /**
  * Creates the musicbox from the provisional js
  */
  createMusicbox () {
    const provisionalType = this.provisonaMusicboxType()
    musicboxActions.create.defer(this.provisionalId, this.provisionalJS)
    if (provisionalType === Musicbox.TYPE_DEEZER) {
      deezerActions.syncMusicboxProfile.defer(this.provisionalId)
      deezerActions.syncMusicboxUnreadCount.defer(this.provisionalId)
    }
  }

  /* **************************************************************************/
  // Wizard lifecycle
  /* **************************************************************************/

  handleOpenAddMusicbox () {
    this.addMusicboxOpen = true
  }

  handleCancelAddMusicbox () {
    this.completeClear()
  }

  /* **************************************************************************/
  // Starting Authentication
  /* **************************************************************************/

  handleAuthDeezerMusicbox ({ provisionalId }) {
    this.addMusicboxOpen = false
    return this.handleAuthDeezerMusicboxSuccess( { provisionalId, type: Musicbox.TYPE_DEEZER })
    ipcRenderer.send('auth-deezer', { id: provisionalId, type: Musicbox.TYPE_DEEZER })
  }

  handleAuthOvercastMusicbox ({ provisionalId }) {
    this.addMusicboxOpen = false
    return this.handleAuthOvercastMusicboxSuccess( { provisionalId, type: Musicbox.TYPE_OVERCAST })
    ipcRenderer.send('auth-overcast', { id: provisionalId, type: Musicbox.TYPE_OVERCAST })
  }

  handleReauthDeezerMusicbox ({ musicboxId }) {
    this.addMusicboxOpen = false
    ipcRenderer.send('auth-deezer', { id: musicboxId, mode: 'reauth' })
  }

  /* **************************************************************************/
  // Authentication Callbacks
  /* **************************************************************************/

  handleAuthDeezerMusicboxSuccess ({ provisionalId, type, temporaryAuth, mode }) {
    // console.log('handleAuthDeezerMusicboxSuccess');
    // musicboxActions.setDeezerAuth.defer(provisionalId, true)
    // deezerActions.syncMusicboxProfile.defer(provisionalId)
    // deezerActions.syncMusicboxUnreadCount.defer(provisionalId)
    this.provisionalId = provisionalId
    this.provisionalJS = {
      type: type,
      deezerAuth: temporaryAuth
    }
    this.createMusicbox()
    this.completeClear()
    this.configurationCompleteOpen = true
    // deezerHTTP.upgradeAuthCodeToPermenant(temporaryAuth).then((auth) => {
    //   if (mode === 'reauth') {
    //     musicboxActions.setDeezerAuth.defer(provisionalId, auth)
    //     deezerActions.syncMusicboxProfile.defer(provisionalId)
    //     deezerActions.syncMusicboxUnreadCount.defer(provisionalId)
    //     this.completeClear()
    //   } else {
    //     this.provisionalId = provisionalId
    //     this.provisionalJS = {
    //       type: type,
    //       deezerAuth: auth
    //     }
    //
    //     this.configurationOpen = true
    //     this.emitChange()
    //   }
    // }).catch((err) => {
    //   console.error('[AUTH ERR]', err)
    //   console.error(err.errorString)
    //   console.error(err.errorStack)
    //   reporter.reportError('[AUTH ERR]' + err.errorString)
    //   this.completeClear()
    // })
  }
  handleAuthOvercastMusicboxSuccess ({ provisionalId, type, temporaryAuth, mode }) {
    // console.log('handleAuthOvercastMusicboxSuccess', provisionalId, type, temporaryAuth, mode);
    this.provisionalId = provisionalId
    this.provisionalJS = {
      type: type,
      overcastAuth: temporaryAuth
    }
    this.createMusicbox()
    this.completeClear()
    this.configurationCompleteOpen = true
  }

  handleAuthDeezerMusicboxFailure ({ evt, data }) {
    if (data.errorMessage.toLowerCase().indexOf('user') === 0) {
      // User cancelled
    } else {
      console.error('[AUTH ERR]', data)
      console.error(data.errorString)
      console.error(data.errorStack)
      reporter.reportError('[AUTH ERR]' + data.errorString)
    }
    this.completeClear()
  }

  /* **************************************************************************/
  // Config
  /* **************************************************************************/

  handleConfigureMusicbox ({ configuration }) {
    this.provisionalJS = Object.assign(this.provisionalJS, configuration)
    if (pkg.prerelease) {
      this.configureServicesOpen = true
    } else {
      this.createMusicbox()
      this.completeClear()
      this.configurationCompleteOpen = true
    }
  }

  handleConfigureServices ({ enabledServices, compact }) {
    this.provisionalJS = Object.assign(this.provisionalJS, {
      services: enabledServices,
      compactServicesUI: compact
    })

    this.createMusicbox()
    this.completeClear()
    this.configurationCompleteOpen = true
  }

  handleConfigurationComplete () {
    this.completeClear()
  }
}

module.exports = alt.createStore(MusicboxWizardStore, 'MusicboxWizardStore')
