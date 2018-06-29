const alt = require('../altUtils')
const actions = require('./musicboxWizardActions')
const { Musicbox, Deezer } = require('shared/Models/Musicbox')
const musicboxActions = require('../musicbox/musicboxActions')

const pkg = require('shared/appPackage')

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
      if (type === Musicbox.TYPES.DEEZER) {
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
      if (type === Musicbox.TYPES.DEEZER) {
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

      handleAddMusicbox: actions.ADD_MUSICBOX,

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
    musicboxActions.create.defer(this.provisionalId, this.provisionalJS)
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

  handleAddMusicbox ({ provisionalId, type }) {
    this.addMusicboxOpen = false
    this.provisionalId = provisionalId
    this.provisionalJS = {
      type: type
    }
    this.createMusicbox()
    this.completeClear()
    this.configurationCompleteOpen = true
  }

  /* **************************************************************************/
  // Authentication Callbacks
  /* **************************************************************************/

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

const store = alt.createStore(MusicboxWizardStore, 'MusicboxWizardStore')
module.exports = store
