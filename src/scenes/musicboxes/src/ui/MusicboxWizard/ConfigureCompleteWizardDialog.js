const React = require('react')
const { FontIcon, Dialog, RaisedButton } = require('material-ui')
const Colors = require('material-ui/styles/colors')
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore } = require('../../stores/settings')

const styles = {
  container: {
    textAlign: 'center'
  },
  tick: {
    color: Colors.green600,
    fontSize: '80px'
  },
  instruction: {
    textAlign: 'center'
  }
}

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'ConfigureCompleteWizardDialog',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxWizardStore.listen(this.musicboxWizardChanged)
    settingsStore.listen(this.settingsChanged)
  },

  componentWillUnmount () {
    musicboxWizardStore.unlisten(this.musicboxWizardChanged)
    settingsStore.unlisten(this.settingsChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      isOpen: musicboxWizardStore.getState().configurationCompleteOpen,
      hasSeenAppWizard: settingsStore.getState().app.hasSeenAppWizard
    }
  },

  musicboxWizardChanged (wizardState) {
    this.setState({ isOpen: wizardState.configurationCompleteOpen })
  },

  settingsChanged (settingsState) {
    this.setState({ hasSeenAppWizard: settingsStore.getState().app.hasSeenAppWizard })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const { isOpen, hasSeenAppWizard } = this.state
    const actions = (
      <RaisedButton
        label='Finish'
        primary
        onClick={() => {
          musicboxWizardActions.configurationComplete()
          if (!hasSeenAppWizard) {
            setTimeout(() => {
              appWizardActions.startWizard()
            }, 500) // Feels more natural after a delay
          }
        }} />
    )

    return (
      <Dialog
        bodyClassName='ReactComponent-MaterialUI-Dialog-Body-Scrollbars'
        modal
        actions={actions}
        open={isOpen}
        autoScrollBodyContent>
        <div style={styles.container}>
          <FontIcon className='material-icons' style={styles.tick}>check_circle</FontIcon>
          <h3>All Done!</h3>
          <p style={styles.instruction}>
            You can change your musicbox settings at any time in the settings
          </p>
        </div>
      </Dialog>
    )
  }
})
