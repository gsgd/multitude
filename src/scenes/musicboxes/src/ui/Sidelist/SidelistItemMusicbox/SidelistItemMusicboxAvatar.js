const React = require('react')
const PropTypes = require('prop-types')
import { IconButton, Avatar } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
const { musicboxStore } = require('../../../stores/musicbox')
const shallowCompare = require('react-addons-shallow-compare')
const styles = require('../SidelistStyles')
const createReactClass = require('create-react-class')

const themed = theme => ({
  colorDefault: { backgroundColor: theme.palette.primary.dark }
})

const SidelistItemMusicboxAvatar = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxAvatar',
  propTypes: {
    isActive: PropTypes.bool.isRequired,
    isHovering: PropTypes.bool.isRequired,
    musicbox: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { onClick, onContextMenu, isActive, isHovering, musicbox, index, classes, ...passProps } = this.props
    let url
    let children
    const style = (isActive || isHovering) ? {
      backgroundColor: musicbox.color
    } : {}
    if (musicbox.hasCustomAvatar) {
      url = musicboxStore.getState().getAvatar(musicbox.customAvatarId)
      // backgroundColor = musicbox.color
    } else if (musicbox.avatarURL) {
      url = musicbox.avatarURL
    } else {
      children = index
      // backgroundColor = musicbox.color
    }
    return (
      <IconButton
        className={classes.colorDefault}
        style={style}
        onClick={onClick}
        onContextMenu={onContextMenu}>
        <Avatar
          {...passProps}
          src={url}
          draggable={false}>
          {children}
        </Avatar>
      </IconButton>
    )
  }
})
const styled = withStyles(themed)(SidelistItemMusicboxAvatar)
module.exports = styled
