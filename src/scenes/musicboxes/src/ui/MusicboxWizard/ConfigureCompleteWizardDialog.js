const React = require('react')
const PropTypes = require('prop-types')
import { Icon, Modal, Dialog, DialogContent, DialogActions, Button } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore } = require('../../stores/settings')

const styles = {
  container: {
    textAlign: 'center'
  },
  tick: {
    color: Colors.green[600],
    fontSize: '80px'
  },
  instruction: {
    textAlign: 'center'
  }
}
const createReactClass = require('create-react-class')

const ConfigureCompleteWizardDialog = createReactClass({
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
      <Button variant='raised'
        color='primary'
        onClick={() => {
          musicboxWizardActions.configurationComplete()
          if (!hasSeenAppWizard) {
            setTimeout(() => {
              appWizardActions.startWizard()
            }, 500) // Feels more natural after a delay
          }
        }}>
        Finish
      </Button>
    )

    return (
      <Dialog
        className='ReactComponent-MaterialUI-Dialog-Body-Scrollbars'
        // modal
        open={isOpen}>
        <DialogContent style={styles.container}>
          <Icon className='material-icons' style={styles.tick}>check_circle</Icon>
          <h3>All Done!</h3>
          <p style={styles.instruction}>
            You can change your musicbox settings at any time in the settings
          </p>
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = ConfigureCompleteWizardDialog
