const React = require('react')
const PropTypes = require('prop-types')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore } = require('../../stores/settings')
const shallowCompare = require('react-addons-shallow-compare')
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core'
const { TrayIconEditor } = require('../../Components')
const createReactClass = require('create-react-class')

const AppWizardTray = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardTray',
  propTypes: {
    isOpen: PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsUpdated)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsUpdated)
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      tray: settingsStore.getState().tray
    }
  },

  settingsUpdated (settingsState) {
    this.setState({ tray: settingsState.tray })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { isOpen } = this.props
    const { tray } = this.state

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}>
        <DialogTitle>
          Tray Icon
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          Customise the tray icon so that it fits in with the other icons in
          your taskbar. You can change the way the icon appears when you have unread
          mail and when you have no unread mail
          <TrayIconEditor
            tray={tray}
            style={{ textAlign: 'center' }}
            trayPreviewStyles={{ margin: '0px auto' }} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => appWizardActions.cancelWizard()}>
            Cancel
          </Button>
          <Button variant='raised'
            color='primary'
            onClick={() => appWizardActions.progressNextStep()}>
            Next
          </Button>

        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = AppWizardTray
