const React = require('react')
const shallowCompare = require('react-addons-shallow-compare')
const styles = require('../SidelistStyles')
const SidelistItemMusicboxService = require('./SidelistItemMusicboxService')

const SidelistItemMusicboxServices = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxServices',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired,
    isActiveMusicbox: React.PropTypes.bool.isRequired,
    activeService: React.PropTypes.string.isRequired,
    onOpenService: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, isActiveMusicbox, activeService, onOpenService, onContextMenu } = this.props
    if (!musicbox.hasEnabledServices) { return null }

    return (
      <div style={musicbox.compactServicesUI ? styles.musicboxServiceIconsCompact : styles.musicboxServiceIconsFull}>
        {musicbox.enabledServies.map((service) => {
          return (
            <SidelistItemMusicboxService
              key={service}
              onContextMenu={onContextMenu}
              musicbox={musicbox}
              isActiveMusicbox={isActiveMusicbox}
              isActiveService={activeService === service}
              onOpenService={onOpenService}
              service={service} />
          )
        })}
      </div>
    )
  }
})
module.exports = SidelistItemMusicboxServices
