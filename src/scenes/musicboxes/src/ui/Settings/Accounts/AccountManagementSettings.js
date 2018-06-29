const React = require('react')
const PropTypes = require('prop-types')
import * as Colors from '@material-ui/core/colors'
import { Paper, Button, Icon } from '@material-ui/core'
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const TimerMixin = require('react-timer-mixin')
const createReactClass = require('create-react-class')

const AccountManagementSettings = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountManagementSettings',
  mixins: [TimerMixin],
  propTypes: {
    musicbox: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillMount () {
    this.confirmingDeleteTO = null
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.musicbox.id !== nextProps.musicbox.id) {
      this.setState({ confirmingDelete: false })
      this.clearTimeout(this.confirmingDeleteTO)
    }
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      confirmingDelete: false
    }
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Handles the delete button being tapped
  */
  handleDeleteTapped (evt) {
    if (this.state.confirmingDelete) {
      musicboxActions.remove(this.props.musicbox.id)
    } else {
      this.setState({ confirmingDelete: true })
      this.confirmingDeleteTO = this.setTimeout(() => {
        this.setState({ confirmingDelete: false })
      }, 4000)
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const passProps = Object.assign({}, this.props)
    delete passProps.musicbox

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <Button variant='flat'
          icon={<Icon color={Colors.red[600]} className='material-icons'>delete</Icon>}
          onClick={this.handleDeleteTapped}>
          <span style={{color: Colors.red[600]}}>
            {this.state.confirmingDelete ? 'Click again to confirm' : 'Delete Account'}
          </span>
        </Button>
      </Paper>
    )
  }
})
module.exports = AccountManagementSettings
