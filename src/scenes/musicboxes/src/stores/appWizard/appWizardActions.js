const alt = require('../alt')

class AppWizardActions {
  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
  * Starts the wizard
  */
  startWizard () { return {} }

  /**
  * Progresses the wizard to the next stage
  */
  progressNextStep () { return {} }

  /**
  * Cancels the wizard
  */
  cancelWizard () { return {} }

  /**
  * Cancel and discards the wizard
  */
  discardWizard () { return {} }
}

const actions = alt.createActions(AppWizardActions)
module.exports = actions
