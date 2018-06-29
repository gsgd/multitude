const React = require('react')
const PropTypes = require('prop-types')
const { musicboxWizardStore } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const AddMusicboxWizardDialog = require('./AddMusicboxWizardDialog')
const ConfigureMusicboxWizardDialog = require('./ConfigureMusicboxWizardDialog')
const ConfigureMusicboxServicesDialog = require('./ConfigureMusicboxServicesDialog')
const ConfigureCompleteWizardDialog = require('./ConfigureCompleteWizardDialog')
const createReactClass = require('create-react-class')

const MusicboxWizard = createReactClass({
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
          <AddMusicboxWizardDialog {...this.props} />
          <ConfigureMusicboxWizardDialog {...this.props} />
          <ConfigureMusicboxServicesDialog {...this.props} />
          <ConfigureCompleteWizardDialog {...this.props} />
        </div>
      )
    } else {
      return null
    }
  }
})
module.exports = MusicboxWizard
