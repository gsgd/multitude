const React = require('react')
const { musicboxWizardStore } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const AddMusicboxWizardDialog = require('./AddMusicboxWizardDialog')
const ConfigureMusicboxWizardDialog = require('./ConfigureMusicboxWizardDialog')
const ConfigureMusicboxServicesDialog = require('./ConfigureMusicboxServicesDialog')
const ConfigureCompleteWizardDialog = require('./ConfigureCompleteWizardDialog')

const MusicboxWizard = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxWizard',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    this.renderTO = null
    musicboxWizardStore.listen(this.wizardChanged)
  },

  componentWillUnmount () {
    clearTimeout(this.renderTO)
    musicboxWizardStore.unlisten(this.wizardChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const itemsOpen = musicboxWizardStore.getState().hasAnyItemsOpen()
    return {
      itemsOpen: itemsOpen,
      render: itemsOpen
    }
  },

  wizardChanged (wizardState) {
    this.setState((prevState) => {
      const itemsOpen = wizardState.hasAnyItemsOpen()
      const update = { itemsOpen: itemsOpen }
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
    if (this.state.render) {
      return (
        <div>
          <AddMusicboxWizardDialog />
          <ConfigureMusicboxWizardDialog />
          <ConfigureMusicboxServicesDialog />
          <ConfigureCompleteWizardDialog />
        </div>
      )
    } else {
      return null
    }
  }
})
module.exports = MusicboxWizard