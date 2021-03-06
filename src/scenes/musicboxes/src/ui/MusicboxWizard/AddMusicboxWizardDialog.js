const React = require('react')
import {Dialog, Button, GridList, GridListTile, GridListTileBar, DialogTitle, DialogActions, DialogContent, Avatar, IconButton, Icon} from '@material-ui/core'
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const { MusicboxData } = require('shared/Models/Musicbox/MusicboxConfiguration')
const AddMusicboxTile = require('./AddMusicboxTile')

const styles = {
  gridListTile: {
    cursor: 'pointer'
  },
  gridImgContainer: {
    height: '100%',
    position: 'relative',
    backgroundSize: 'cover'
  },
  gridImg: {
    // width: '80%',
    maxWidth: '50vw',
    maxHeight: 120,
    transform: 'translate(-50%, -50%)',
    position: 'relative',
    top: '50%',
    left: '50%'
  }
}
const createReactClass = require('create-react-class')

const AddMusicboxWizardDialog = createReactClass({
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
    let evens = (Object.values(MusicboxData).length % 2) === 0
    const {sidebarClasses} = this.props
    return (
      <Dialog
        open={isOpen}
        fullScreen
        onClose={() => musicboxWizardActions.cancelAddMusicbox()}
        classes={sidebarClasses}>
        <DialogTitle>Add your service</DialogTitle>
        <DialogContent>
          <GridList
            cellHeight={150}
            spacing={24}>
            {Object.values(MusicboxData).map((tile) => {
              const cols = evens ? 1 : 2
              evens = evens || true
              return (
                <AddMusicboxTile
                  key={tile.img}
                  tile={tile}
                  cols={cols}
                  styles={styles} />
              )
            })}
          </GridList>
        </DialogContent>
        <DialogActions>
          <Button variant='raised' color='primary' onClick={() => musicboxWizardActions.cancelAddMusicbox()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = AddMusicboxWizardDialog
