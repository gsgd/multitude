const React = require('react')
import {
  Dialog, Button, GridList, GridListTile, GridListTileBar,
  DialogTitle, DialogActions, DialogContent, Avatar,
  IconButton, Icon } from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'

const {musicboxWizardStore, musicboxWizardActions} = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const {MusicboxData} = require('shared/Models/Musicbox/MusicboxConfiguration')

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
  },
  gridListTileBarHover: {
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
}
const createReactClass = require('create-react-class')

const AddMusicboxTile = createReactClass({
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
      hover: false
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
    const {cols, tile, styles, classes, ...passProps} = this.props
    const {hover} = this.state
    const image = hover ? `linear-gradient(rgba(0,0,0,0.24), rgba(0,0,0,0.24)), url(${tile.customTileBackground})` : `url(${tile.customTileBackground})`
    const style = Object.assign({backgroundImage: tile.customTileBackground ? image : ''}, styles.gridImgContainer)
    return (
      <GridListTile
        title={`Add ${tile.title} tab`}
        key={tile.img}
        onMouseOver={() => { this.setState({hover: true}) }}
        onMouseOut={() => { this.setState({hover: false}) }}
        cols={cols}
        onClick={() => musicboxWizardActions.addMusicbox(tile.type)}
        classes={{root: classes.gridListTile}}
        {...passProps}>
        <div style={style}>
          <img src={tile.img} alt={tile.title} className={classes.gridImg} />
        </div>
        <GridListTileBar
          title={tile.title}
          classes={{root: hover ? classes.gridListTileBarHover : ''}}
          actionIcon={
            <IconButton color='primary'>
              <Icon>add</Icon>
            </IconButton>
          }
        />
      </GridListTile>
    )
  }
})

const AddWithStyles = withStyles(styles)(AddMusicboxTile)

module.exports = AddWithStyles
