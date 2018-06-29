const React = require('react')
const PropTypes = require('prop-types')
const shallowCompare = require('react-addons-shallow-compare')
const styles = require('../SidelistStyles')
const SidelistItemMusicboxService = require('./SidelistItemMusicboxService')
const createReactClass = require('create-react-class')

const SidelistItemMusicboxServices = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxServices',
  propTypes: {
    musicbox: PropTypes.object.isRequired,
    isActiveMusicbox: PropTypes.bool.isRequired,
    activeService: PropTypes.string.isRequired,
    onOpenService: PropTypes.func.isRequired
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
