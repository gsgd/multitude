const React = require('react')
const { Dialog, RaisedButton, GridList, GridTile, IconButton, Subheader } = require('material-ui')
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')
const { Musicbox } = require('shared/Models/Musicbox')

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
  },
  gridList: {},
  gridTile: {
    background: '#3D3F24'
  },
  gridTitleBackground: 'rgba(0, 0, 0, 0.8)',
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
    img: '../../images/deezer_icon_512.png',
    title: 'Deezer',
    type: Musicbox.TYPE_DEEZER
  },
  {
    img: '../../images/mfp_icon_512.jpg',
    title: 'Music For Programmers',
    type: Musicbox.TYPE_MFP
  },
  {
    img: '../../images/overcast_icon_512.svg',
    title: 'Overcast',
    type: Musicbox.TYPE_OVERCAST
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
          style={styles.gridList}>
          <Subheader>Add your service</Subheader>
          {tilesData.map((tile) => (
            <GridTile
              key={tile.img}
              title={tile.title}
              style={styles.gridTile}
              subtitle={<span>Add your <b>{tile.title}</b> account</span>}
              titleBackground={styles.gridTitleBackground}
              actionIcon={
                <IconButton
                  iconClassName='material-icons'
                  iconStyle={styles.gridIcon}
                  hoveredStyle={styles.gridIconHover}
                  onClick={() => musicboxWizardActions.addMusicbox(tile.type)}>
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
