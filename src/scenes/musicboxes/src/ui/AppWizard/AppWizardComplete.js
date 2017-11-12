const React = require('react')
const { appWizardActions } = require('../../stores/appWizard')
const { musicboxStore } = require('../../stores/musicbox')
const { musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const { Dialog, RaisedButton, FontIcon } = require('material-ui')
const Colors = require('material-ui/styles/colors')

const styles = {
  container: {
    textAlign: 'center'
  },
  tick: {
    color: Colors.green600,
    fontSize: '80px'
  }
}

const AppWizardComplete = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AppWizardComplete',
  propTypes: {
    isOpen: React.PropTypes.bool.isRequired
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
    const actions = (
      <div>
        <RaisedButton
          label='Cancel'
          style={{ float: 'left' }}
          onClick={() => appWizardActions.cancelWizard()} />
        <RaisedButton
          label='Finish'
          primary={musicboxCount !== 0}
          onClick={() => appWizardActions.progressNextStep()} />
        {musicboxCount === 0 ? (
          <RaisedButton
            label='Add First Musicbox'
            style={{marginLeft: 8}}
            primary
            onClick={() => {
              appWizardActions.progressNextStep()
              musicboxWizardActions.openAddMusicbox()
            }} />
        ) : undefined}
      </div>
    )

    return (
      <Dialog
        modal={false}
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => appWizardActions.cancelWizard()}>
        <div style={styles.container}>
          <FontIcon className='material-icons' style={styles.tick}>check_circle</FontIcon>
          <h3>All Done!</h3>
          <p>
            You can go to settings at any time to update your preferences
          </p>
        </div>
      </Dialog>
    )
  }
})
module.exports = AppWizardComplete