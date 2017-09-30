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
  authDeezerMusicbox () {
    // console.log('authDeezerMusicbox');
    return { provisionalId: Musicbox.provisionId() }
  }

  /**
  * Reauthetnicates a google mailbox
  * @param mailboxId: the id of the mailbox
  */
  reauthDeezerMusicbox (mailboxId) {
    return { mailboxId: mailboxId }
  }

  /* **************************************************************************/
  // Authentication callbacks
  /* **************************************************************************/

  /**
  * Handles a mailbox authenticating
  * @param evt: the event that came over the ipc
  * @param data: the data that came across the ipc
  */
  authDeezerMusicboxSuccess (evt, data) {
    return { provisionalId: data.id, type: data.type, temporaryAuth: data.temporaryAuth, mode: data.mode }
  }

  /**
  * Handles a mailbox authenticating error
  * @param evt: the ipc event that fired
  * @param data: the data that came across the ipc
  */
  authDeezerMusicboxFailure (evt, data) {
    return { evt: evt, data: data }
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
ipcRenderer.on('auth-deezer-complete', actions.authDeezerMusicboxSuccess)
ipcRenderer.on('auth-deezer-error', actions.authDeezerMusicboxFailure)

module.exports = actions
