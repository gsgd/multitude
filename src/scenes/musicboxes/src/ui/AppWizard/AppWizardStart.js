const React = require('react')
const PropTypes = require('prop-types')
const { appWizardActions } = require('../../stores/appWizard')
const shallowCompare = require('react-addons-shallow-compare')
import { Dialog, DialogActions, DialogTitle, DialogContent, Button, Icon, Avatar } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const styles = require('./styles')
const createReactClass = require('create-react-class')

const AppWizardStart = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardStart',
  propTypes: {
    isOpen: PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { isOpen } = this.props

    return (
      <Dialog
        open={isOpen}
        onClose={() => appWizardActions.cancelWizard()}>
        <DialogTitle style={{textAlign: 'center'}}>
          <Avatar style={styles.avatar}>
            <Icon style={styles.icon}
              className='fa fa-fw fa-magic'/>
          </Avatar>
          <div>Multitude Setup</div>
        </DialogTitle>
        <DialogContent style={{textAlign: 'center'}}>
          <p>
            Customise Multitude to work best for you by configuring a few common settings
          </p>
          <p>
            Would you like to start Multitude setup now?
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => appWizardActions.discardWizard()}>
            Not interested
          </Button>
          <Button
            onClick={() => appWizardActions.cancelWizard()}>
            Later
          </Button>
          <Button variant='contained'
            style={{marginLeft: 8}}
            color='primary'
            onClick={() => appWizardActions.progressNextStep()}>
            Setup
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = AppWizardStart
