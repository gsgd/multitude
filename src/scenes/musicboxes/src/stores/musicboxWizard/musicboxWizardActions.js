const alt = require('../alt')
const { ipcRenderer } = window.nativeRequire('electron')
const { Musicbox } = require('shared/Models/Musicbox')

class MusicboxWizardActions {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
  * Loads any start off services
  */
  load () { return {} }

  /* **************************************************************************/
  // Adding
  /* **************************************************************************/

  /**
  * Opens the add mailbox picker
  */
  openAddMusicbox () { return {} }

  /**
  * Dismisses the add mailbox picker
  */
  cancelAddMusicbox () { return {} }

  /**
  * Starts the auth process for google inbox
  */
  addMusicbox (type) {
    // console.log('addDeezerMusicbox');
    return { provisionalId: Musicbox.provisionId(), type: type }
  }

  /* **************************************************************************/
  // Config
  /* **************************************************************************/

  /**
  * Configures an account
  * @param configuration: the additional configuration to provide
  */
  configureMusicbox (configuration) {
    return { configuration: configuration }
  }

  /**
  * Configures the enabled services
  * @param enabledServices: the enabled servies
  * @param compact: whether they should be compact or not
  */
  configureMusicboxServices (enabledServices, compact) {
    return { enabledServices: enabledServices, compact: compact }
  }

  /**
  * Completes mailbox configuration
  */
  configurationComplete () { return {} }
}

const actions = alt.createActions(MusicboxWizardActions)

module.exports = actions
