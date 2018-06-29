const React = require('react')
const PropTypes = require('prop-types')
const { appWizardActions } = require('../../stores/appWizard')
const { musicboxStore } = require('../../stores/musicbox')
const { musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Avatar, Icon } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const styles = require('./styles')
const createReactClass = require('create-react-class')

const AppWizardComplete = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardComplete',
  propTypes: {
    isOpen: PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxStore.listen(this.musicboxesUpdated)
  },

  componentWillUnmount () {
    musicboxStore.unlisten(this.musicboxesUpdated)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      musicboxCount: musicboxStore.getState().musicboxCount()
    }
  },

  musicboxesUpdated (musicboxState) {
    this.setState({
      musicboxCount: musicboxState.musicboxCount()
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
    const { musicboxCount } = this.state

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}>
        <DialogTitle style={styles.container}>
          <Avatar style={styles.avatar}>
            <Icon className='material-icons' style={styles.icon}>check_circle</Icon>
          </Avatar>
          <div>All Done!</div>
        </DialogTitle>
        <DialogContent style={styles.container}>
          <p>
            You can go to settings at any time to update your preferences
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            primary={musicboxCount !== 0}
            onClick={() => appWizardActions.progressNextStep()}>
            Finish
          </Button>
          {musicboxCount === 0 ? (
            <Button variant='contained'
              style={{marginLeft: 8}}
              color='primary'
              onClick={() => {
                appWizardActions.progressNextStep()
                musicboxWizardActions.openAddMusicbox()
              }}>
            Add First Musicbox
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = AppWizardComplete
