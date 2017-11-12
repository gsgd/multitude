const React = require('react')
const shallowCompare = require('react-addons-shallow-compare')
const styles = require('../SidelistStyles')
const {IconButton} = require('material-ui')
const {musicboxDispatch} = require('../../../Dispatch')
const { lighten, isLight } = require('colorutilities')

// console.log(lighten)

const SidelistItemMusicboxActions = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxActions',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired,
    isActiveMusicbox: React.PropTypes.bool.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, isActiveMusicbox, isHovering } = this.props
    if (!isActiveMusicbox && !isHovering && !musicbox.isPlaying) { return null }
    const musicboxColor = {
      color: musicbox.backgroundColor
    }
    const musicboxBackgroundColor = {
      backgroundColor: musicbox.color
    }
    const musicboxBackgroundColorHover = {
      backgroundColor: lighten(musicbox.color, (+isLight(musicbox.color) || -1) * 33)
    }
    const playIcon = musicbox.isPlaying ? 'pause' : 'play_arrow'
    return (
      <div style={styles.musicboxActionsContainer}>
        <IconButton
          iconClassName='material-icons'
          iconStyle={Object.assign({}, styles.musicboxActionIconStyle, musicboxColor)}
          style={Object.assign({}, styles.musicboxActionStyle, musicboxBackgroundColor)}
          hoveredStyle={Object.assign({}, musicboxBackgroundColorHover)}
          onClick={() => {
            musicboxDispatch.musicboxPlayPause(musicbox.id)
          }} >
          {playIcon}
        </IconButton>
      </div>
    )
  }
})
module.exports = SidelistItemMusicboxActions
