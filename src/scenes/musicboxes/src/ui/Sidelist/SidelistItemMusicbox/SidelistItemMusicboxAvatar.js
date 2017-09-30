const React = require('react')
const { Avatar } = require('material-ui')
const { musicboxStore } = require('../../../stores/musicbox')
const shallowCompare = require('react-addons-shallow-compare')
const styles = require('../SidelistStyles')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxAvatar',
  propTypes: {
    isActive: React.PropTypes.bool.isRequired,
    isHovering: React.PropTypes.bool.isRequired,
    musicbox: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { isActive, isHovering, musicbox, index, ...passProps } = this.props

    let url
    let children
    let backgroundColor
    const borderColor = isActive || isHovering ? musicbox.color : 'white'
    if (musicbox.hasCustomAvatar) {
      url = musicboxStore.getState().getAvatar(musicbox.customAvatarId)
      backgroundColor = 'white'
    } else if (musicbox.avatarURL) {
      url = musicbox.avatarURL
      backgroundColor = 'white'
    } else {
      children = index
      backgroundColor = musicbox.color
    }

    return (
      <Avatar
        {...passProps}
        src={url}
        size={50}
        backgroundColor={backgroundColor}
        color='white'
        draggable={false}
        style={Object.assign({ borderColor: borderColor }, styles.musicboxAvatar)}>
        {children}
      </Avatar>
    )
  }
})
