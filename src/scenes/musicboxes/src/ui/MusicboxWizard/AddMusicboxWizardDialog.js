const React = require('react')
const { Dialog, RaisedButton, Avatar } = require('material-ui')
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')

const styles = {
  musicboxRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  musicboxCell: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40
  },
  musicboxAvatar: {
    cursor: 'pointer'
  }
}

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AddMusicboxWizardDialog',

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
      isOpen: wizardState.addMusicboxOpen
    }
  },

  wizardChanged (wizardState) {
    this.setState({
      isOpen: wizardState.addMusicboxOpen
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { isOpen } = this.state
    const actions = (
      <RaisedButton label='Cancel' onClick={() => musicboxWizardActions.cancelAddMusicbox()} />
    )

    return (
      <Dialog
        modal={false}
        actions={actions}
        open={isOpen}
        autoScrollBodyContent
        onRequestClose={() => musicboxWizardActions.cancelAddMusicbox()}>
        <div style={styles.musicboxRow}>
          <div style={styles.musicboxCell}>
            <Avatar
              src='../../images/deezer_icon_512.png'
              size={80}
              style={styles.musicboxAvatar}
              onClick={() => musicboxWizardActions.authDeezerMusicbox()} />
            <p>Add your Deezer account here</p>
            <RaisedButton
              label='Add Deezer'
              primary
              onClick={() => musicboxWizardActions.authDeezerMusicbox()} />
          </div>
          <div style={styles.musicboxCell}>
            <Avatar
              src='../../images/deezer_icon_512.png'
              size={80}
              style={styles.musicboxAvatar}
              onClick={() => musicboxWizardActions.authOvercastMusicbox()} />
            <p>Add your Overcast account here</p>
            <RaisedButton
              label='Add Overcast'
              primary
              onClick={() => musicboxWizardActions.authOvercastMusicbox()} />
          </div>
        </div>
      </Dialog>
    )
  }
})
