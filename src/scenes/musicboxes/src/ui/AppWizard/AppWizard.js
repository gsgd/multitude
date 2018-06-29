const React = require('react')
const PropTypes = require('prop-types')
const { appWizardStore } = require('../../stores/appWizard')
const shallowCompare = require('react-addons-shallow-compare')
const AppWizardStart = require('./AppWizardStart')
const AppWizardComplete = require('./AppWizardComplete')
const AppWizardNotifactions = require('./AppWizardNotifications')
const AppWizardTray = require('./AppWizardTray')
const createReactClass = require('create-react-class')

const AppWizard = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizard',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    this.renderTO = null
    appWizardStore.listen(this.wizardChanged)
  },

  componentWillUnmount () {
    clearTimeout(this.renderTO)
    appWizardStore.unlisten(this.wizardChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const wizardState = appWizardStore.getState()
    const itemsOpen = wizardState.hasAnyItemsOpen()
    return {
      itemsOpen: itemsOpen,
      render: itemsOpen,
      trayConfiguratorOpen: wizardState.trayConfiguratorOpen,
      notificationHandlerOpen: wizardState.notificationHandlerOpen,
      completeOpen: wizardState.completeOpen,
      startOpen: wizardState.startOpen
    }
  },

  wizardChanged (wizardState) {
    this.setState((prevState) => {
      const itemsOpen = wizardState.hasAnyItemsOpen()
      const update = {
        itemsOpen: itemsOpen,
        trayConfiguratorOpen: wizardState.trayConfiguratorOpen,
        notificationHandlerOpen: wizardState.notificationHandlerOpen,
        completeOpen: wizardState.completeOpen,
        startOpen: wizardState.startOpen
      }

      if (prevState.itemsOpen !== itemsOpen) {
        clearTimeout(this.renderTO)
        if (prevState.itemsOpen && !itemsOpen) {
          this.renderTO = setTimeout(() => {
            this.setState({ render: false })
          }, 1000)
        } else if (!prevState.itemsOpen && itemsOpen) {
          update.render = true
        }
      }
      return update
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { render, startOpen, trayConfiguratorOpen, notificationHandlerOpen, completeOpen } = this.state
    if (render) {
      return (
        <div>
          <AppWizardStart isOpen={startOpen} />
          <AppWizardTray isOpen={trayConfiguratorOpen} />
          <AppWizardNotifactions isOpen={notificationHandlerOpen} />
          <AppWizardComplete isOpen={completeOpen} />
        </div>
      )
    } else {
      return null
    }
  }
})
module.exports = AppWizard
