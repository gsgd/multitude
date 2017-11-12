const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { settingsStore, settingsActions } = require('../../stores/settings')
const shallowCompare = require('react-addons-shallow-compare')
const { Dialog, RaisedButton } = require('material-ui')
const NotificationSettingsSection = require('../Settings/General/NotificationSettingsSection')

console.log('setttingsStore', settingsStore)

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardNotifications',
  propTypes: {
    isOpen: React.PropTypes.bool.isRequired
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
    const actions = (
      <div>
        <RaisedButton
          label='Cancel'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()} />
        <RaisedButton
          label='Later'
          onClick={() => appWizardActions.progressNextStep()} />
        <RaisedButton
          label='Continue'
          style={{ marginLeft: 8 }}
          primary
          onClick={() => {
            appWizardActions.progressNextStep()
          }} />
      </div>
    )

    return (
      <Dialog
        modal={false}
        title='Notifications'
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => appWizardActions.cancelWizard()}>
        <div style={{textAlign: 'center'}}>
          <p>
            Choose your notification preferences
            <br />
            <small>You can always change these later</small>
          </p>
          <NotificationSettingsSection os={os} />
        </div>
      </Dialog>
    )
  }
})
