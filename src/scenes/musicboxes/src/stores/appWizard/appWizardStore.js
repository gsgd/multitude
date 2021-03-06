const alt = require('../altUtils')
const actions = require('./appWizardActions')
const settingsActions = require('../settings/settingsActions')

class AppWizardStore {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.startOpen = false
    this.trayConfiguratorOpen = false
    this.notificationHandlerOpen = false
    this.completeOpen = false

    /**
    * @return true if any configuration dialogs are open
    */
    this.hasAnyItemsOpen = () => {
      return this.startOpen || this.notificationHandlerOpen || this.trayConfiguratorOpen || this.completeOpen
    }

    /* ****************************************/
    // Listeners
    /* ****************************************/

    this.bindListeners({
      handleStartWizard: actions.START_WIZARD,
      handleProgressNextStep: actions.PROGRESS_NEXT_STEP,
      handleCancelWizard: actions.CANCEL_WIZARD,
      handleDiscardWizard: actions.DISCARD_WIZARD
    })
  }

  /* **************************************************************************/
  // Utils
  /* **************************************************************************/

  clearAll () {
    this.startOpen = false
    this.trayConfiguratorOpen = false
    this.notificationHandlerOpen = false
    this.completeOpen = false
  }

  /* **************************************************************************/
  // Handlers
  /* **************************************************************************/

  handleStartWizard () {
    this.clearAll()
    this.startOpen = true
  }

  handleProgressNextStep () {
    if (this.startOpen) {
      this.clearAll()
      this.trayConfiguratorOpen = true
    } else if (this.trayConfiguratorOpen) {
      this.clearAll()
      if (process.platform === 'darwin' || process.platform === 'win32') {
        this.notificationHandlerOpen = true
      } else {
        this.completeOpen = true
      }
    } else if (this.notificationHandlerOpen) {
      this.clearAll()
      this.completeOpen = true
    } else if (this.completeOpen) {
      this.clearAll()
      settingsActions.setHasSeenAppWizard.defer(true)
    }
  }

  handleCancelWizard () {
    this.clearAll()
  }

  handleDiscardWizard () {
    this.clearAll()
    settingsActions.setHasSeenAppWizard.defer(true)
  }
}

const store = alt.createStore(AppWizardStore, 'AppWizardStore')
module.exports = store
