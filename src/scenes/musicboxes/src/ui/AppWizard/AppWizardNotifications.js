const React = require('react')
const PropTypes = require('prop-types')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore, settingsActions } = require('../../stores/settings')
const shallowCompare = require('react-addons-shallow-compare')
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@material-ui/core'
const NotificationSettingsSection = require('../Settings/General/NotificationSettingsSection')

// console.log('setttingsStore', settingsStore)
const createReactClass = require('create-react-class')

const AppWizardNotifications = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardNotifications',
  propTypes: {
    isOpen: PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsDidUpdate)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsDidUpdate)
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    const settingsState = settingsStore.getState()
    return {
      os: settingsState.os
    }
  },

  settingsDidUpdate (settingsState) {
    this.setState({
      os: settingsState.os
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { isOpen } = this.props
    const { os } = this.state

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}>
        <DialogTitle>
          Notifications
        </DialogTitle>
        <DialogContent style={{textAlign: 'center'}}>
          <p>
            Choose your notification preferences
            <br />
            <small>You can always change these later</small>
          </p>
          <NotificationSettingsSection os={os} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => appWizardActions.cancelWizard()}>
            Later
          </Button>
          <Button variant='raised'
            style={{marginLeft: 8}}
            color='primary'
            onClick={() => {
              appWizardActions.progressNextStep()
            }}>
            Next
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = AppWizardNotifications
