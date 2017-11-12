const React = require('react')
const shallowCompare = require('react-addons-shallow-compare')
const { Musicbox } = require('shared/Models/Musicbox')
const { Avatar } = require('material-ui')
const styles = require('../SidelistStyles')

const SidelistItemMusicboxServices = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxServices',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired,
    isActiveMusicbox: React.PropTypes.bool.isRequired,
    isActiveService: React.PropTypes.bool.isRequired,
    onOpenService: React.PropTypes.func.isRequired,
    service: React.PropTypes.string.isRequired
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return { isHovering: false }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * @param musicboxType: the type of musicbox
  * @param service: the service type
  * @return the url of the service icon
  */
  getServiceIconUrl (musicboxType, service) {
    if (musicboxType === Musicbox.TYPE_GMAIL || musicboxType === Musicbox.TYPE_GINBOX) {
      switch (service) {
        case Musicbox.SERVICES.STORAGE: return '../../images/google_services/logo_drive_128px.png'
        case Musicbox.SERVICES.CONTACTS: return '../../images/google_services/logo_contacts_128px.png'
        case Musicbox.SERVICES.NOTES: return '../../images/google_services/logo_keep_128px.png'
        case Musicbox.SERVICES.CALENDAR: return '../../images/google_services/logo_calendar_128px.png'
        case Musicbox.SERVICES.COMMUNICATION: return '../../images/google_services/logo_hangouts_128px.png'
      }
    }

    return ''
  },

  render () {
    const { musicbox, isActiveMusicbox, isActiveService, service, onOpenService, ...passProps } = this.props
    const { isHovering } = this.state
    const isActive = isActiveMusicbox && isActiveService

    if (musicbox.compactServicesUI) {
      return (
        <div
          {...passProps}
          onMouseEnter={() => this.setState({ isHovering: true })}
          onMouseLeave={() => this.setState({ isHovering: false })}
          style={styles.musicboxServiceIconCompact}
          onClick={(evt) => onOpenService(evt, service)}>
          <img
            src={this.getServiceIconUrl(musicbox.type, service)}
            style={isActive || isHovering ? styles.musicboxServiceIconImageActiveCompact : styles.musicboxServiceIconImageCompact} />
        </div>
      )
    } else {
      const borderColor = isActive || isHovering ? musicbox.color : 'white'
      const baseStyle = isActive || isHovering ? styles.musicboxServiceIconImageFullActive : styles.musicboxServiceIconImageFull
      return (
        <Avatar
          {...passProps}
          src={this.getServiceIconUrl(musicbox.type, service)}
          onMouseEnter={() => this.setState({ isHovering: true })}
          onMouseLeave={() => this.setState({ isHovering: false })}
          size={35}
          backgroundColor='white'
          draggable={false}
          onClick={(evt) => onOpenService(evt, service)}
          style={Object.assign({ borderColor: borderColor }, baseStyle)} />
      )
    }
  }
})
module.exports = SidelistItemMusicboxServices
