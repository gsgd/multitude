const React = require('react')
const { Dialog, RaisedButton, GridList, GridTile, IconButton, Subheader } = require('material-ui')
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const { Musicbox } = require('shared/Models/Musicbox')
const Colors = require('material-ui/styles/colors')
const AssetsDir = '../../../../assets'

const styles = {
  gridList: {},
  gridTile: {
    background: Colors.lightBlue100,
    cursor: 'pointer'
  },
  // gridTitleBackground: 'rgba(0, 0, 0, 0.8)',
  gridTitleBackground: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)',
  gridImgContainer: {
    height: '100%',
    position: 'relative'
  },
  gridImg: {
    width: '80%',
    transform: 'translateY(-50%)',
    position: 'relative',
    top: '50%',
    left: '10%'
  },
  gridIcon: {
    color: '#FFF',
    iconHoverColor: '#CCC'
  }
}

const tilesData = [
  {
    img: `${AssetsDir}/images/deezer_icon_512.svg`,
    title: 'Deezer',
    type: Musicbox.TYPE_DEEZER
  },
  {
    img: `${AssetsDir}/images/mfp_icon_512.jpg`,
    title: 'Music For Programmers',
    type: Musicbox.TYPE_MFP
  },
  {
    img: `${AssetsDir}/images/overcast_icon_512.svg`,
    title: 'Overcast',
    type: Musicbox.TYPE_OVERCAST
  },
  {
    img: `${AssetsDir}/images/spotify_icon_512.svg`,
    title: 'Spotify',
    type: Musicbox.TYPE_SPOTIFY
  }
]

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
        <GridList
          cellHeight={100}
          cols={4}
          style={styles.gridList}>
          <Subheader>Add your service</Subheader>
          {tilesData.map((tile) => (
            <GridTile
              key={tile.img}
              title={tile.title}
              style={styles.gridTile}
              subtitle={<span>Add a <b>{tile.title}</b> tab</span>}
              titleBackground={styles.gridTitleBackground}
              onClick={() => musicboxWizardActions.addMusicbox(tile.type)}
              actionIcon={
                <IconButton
                  iconClassName='material-icons'
                  iconStyle={styles.gridIcon}
                  hoveredStyle={styles.gridIconHover}>
                  add_circle
                </IconButton>
              }>
              <div style={styles.gridImgContainer}>
                <img src={tile.img} style={styles.gridImg} />
              </div>
            </GridTile>
          ))}
        </GridList>
      </Dialog>
    )
  }
})
