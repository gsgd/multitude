const React = require('react')
import { Dialog, Button } from '@material-ui/core'
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const { Musicbox } = require('shared/Models/Musicbox')

const ConfigureDeezerMusicboxWizard = require('./ConfigureDeezerMusicboxWizard')
const createReactClass = require('create-react-class')

const ConfigureMusicboxWizardDialog = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'ConfigureMusicboxWizardDialog',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxWizardStore.listen(this.wizardChanged)
  },

  componentWillUnmount () {
    musicboxWizardStore.unlisten(this.wizardChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const wizardState = musicboxWizardStore.getState()
    return {
      isOpen: wizardState.configurationOpen,
      musicboxType: wizardState.provisonaMusicboxType()
    }
  },

  wizardChanged (wizardState) {
    this.setState({
      isOpen: wizardState.addMusicboxOpen,
      musicboxType: wizardState.provisonaMusicboxType()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * @param musicboxType: the type of musicbox
  * @return the configurator class for this musicbox type or undefined
  */
  getConfiguratorClass (musicboxType) {
    switch (musicboxType) {
      case Musicbox.TYPE_DEEZER: return ConfigureDeezerMusicboxWizard
      default: return undefined
    }
  },

  /**
  * Renders the musicbox configurator for the given type
  * @param musicboxType: the type of musicbox
  * @return jsx
  */
  renderMusicboxConfigurator (musicboxType) {
    const Configurator = this.getConfiguratorClass(musicboxType)
    return Configurator ? (
      <Configurator
        onPickedConfiguration={(cfg) => musicboxWizardActions.configureMusicbox(cfg)} />
    ) : ''
  },

  /**
  * Renders the musicbox configurator title for the given type
  * @param musicboxType: the type of musicbox
  * @return jsx
  */
  renderMusicboxConfiguratorTitle (musicboxType) {
    const Configurator = this.getConfiguratorClass(musicboxType)
    return Configurator && Configurator.renderTitle ? Configurator.renderTitle() : undefined
  },

  /**
  * Renders the action buttons based on if there is a configuration or not
  * @return jsx
  */
  renderActions () {
    return (
      <div style={{ textAlign: 'left' }}>
        <Button
          onClick={() => musicboxWizardActions.configureMusicbox({})}>
          Skip
        </Button>
      </div>
    )
  },

  render () {
    const { isOpen, musicboxType } = this.state

    return (
      <Dialog
        className='ReactComponent-MaterialUI-Dialog-Body-Scrollbars'
        contentStyle={{ width: '90%', maxWidth: 1200 }}
        title={this.renderMusicboxConfiguratorTitle(musicboxType)}
        actions={this.renderActions()}
        open={isOpen}
        onClose={() => musicboxWizardActions.cancelAddMusicbox()}>
        {this.renderMusicboxConfigurator(musicboxType)}
      </Dialog>
    )
  }
})
module.exports = ConfigureMusicboxWizardDialog
