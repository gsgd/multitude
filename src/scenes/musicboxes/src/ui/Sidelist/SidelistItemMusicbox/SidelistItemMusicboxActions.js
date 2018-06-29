const React = require('react')
const PropTypes = require('prop-types')
const shallowCompare = require('react-addons-shallow-compare')
const styles = require('../SidelistStyles')
// import IconButton from '@material-ui/core/IconButton'
import { Button, Icon } from '@material-ui/core'

const {musicboxDispatch} = require('../../../Dispatch')
const { lighten, isLight } = require('colorutilities')

// console.log(lighten)
const createReactClass = require('create-react-class')

const SidelistItemMusicboxActions = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxActions',
  propTypes: {
    musicbox: PropTypes.object.isRequired,
    isActiveMusicbox: PropTypes.bool.isRequired
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
        <Button
          mini
          className='musicbox-actions'
          // style={styles.musicboxActionButtonStyle}
          style={Object.assign({}, styles.musicboxActionStyle, musicboxBackgroundColor)}
          // hoveredStyle={Object.assign({}, musicboxBackgroundColorHover)}
          onClick={() => {
            musicboxDispatch.musicboxPlayPause(musicbox.id)
          }} >
          <Icon
            style={Object.assign({}, styles.musicboxActionIconStyle, musicboxColor)}
          >
            {playIcon}
          </Icon>
        </Button>
      </div>
    )
  }
})
module.exports = SidelistItemMusicboxActions
