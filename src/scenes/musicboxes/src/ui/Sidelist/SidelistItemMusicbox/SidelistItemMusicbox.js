const React = require('react')
const PropTypes = require('prop-types')
const { navigationDispatch } = require('../../../Dispatch')
const { musicboxStore, musicboxActions } = require('../../../stores/musicbox')
const shallowCompare = require('react-addons-shallow-compare')

const styles = require('../SidelistStyles')
const SidelistItemMusicboxAvatar = require('./SidelistItemMusicboxAvatar')
const SidelistItemMusicboxActions = require('./SidelistItemMusicboxActions')
const createReactClass = require('create-react-class')
const ReactTooltip = require('react-tooltip')

const SidelistItemMusicbox = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicbox',
  propTypes: {
    musicboxId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    openPopover: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxStore.listen(this.musicboxesChanged)
    // Adding new items can cause the popover not to come up. Rebuild the tooltip
    // after a little time. Bad but seems to fix
    setTimeout(() => ReactTooltip.rebuild(), 1000)
  },

  componentWillUnmount () {
    musicboxStore.unlisten(this.musicboxesChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const musicboxState = musicboxStore.getState()
    const musicbox = musicboxState.getMusicbox(this.props.musicboxId)
    return {
      musicbox: musicbox,
      isActive: musicboxState.activeMusicboxId() === this.props.musicboxId,
      activeService: musicboxState.activeMusicboxService(),
      hovering: false,
      tooltip: musicbox ? musicbox.typeWithUsername : ''
    }
  },

  musicboxesChanged (musicboxState) {
    const musicbox = musicboxState.getMusicbox(this.props.musicboxId)
    this.setState({
      musicbox: musicbox,
      isActive: musicboxState.activeMusicboxId() === this.props.musicboxId,
      activeService: musicboxState.activeMusicboxService(),
      tooltip: musicbox ? musicbox.typeWithUsername : ''
    })
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Handles the item being clicked on
  * @param evt: the event that fired
  */
  handleClick (evt) {
    evt.preventDefault()
    if (evt.metaKey) {
      navigationDispatch.openMusicboxSettings(this.props.musicboxId)
    } else {
      musicboxActions.changeActive(this.props.musicboxId)
    }
  },

  /**
  * Handles opening a service
  * @param evt: the event that fired
  * @param service: the service to open
  */
  handleOpenService (evt, service) {
    evt.preventDefault()
    musicboxActions.changeActive(this.props.musicboxId, service)
  },

  /**
  * Handles opening a service
  * @param evt: the event that fired
  * @param service: the service to open
  */
  handleOpenPopover (evt, service) {
    const {isFirst, isLast, openPopover} = this.props
    const {musicbox} = this.state
    openPopover(evt, musicbox, isFirst, isLast)
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * Renders the active indicator
  * @param musicbox: the musicbox to render for
  * @param isActive: true if the musicbox is active
  * @return jsx
  */
  renderActiveIndicator (musicbox, isActive) {
    if (isActive) {
      return (
        <div
          onClick={this.handleClick}
          style={Object.assign({ backgroundColor: musicbox.color }, styles.musicboxActiveIndicator)} />
      )
    } else {
      return undefined
    }
  },

  render () {
    if (!this.state.musicbox) { return null }
    const { musicbox, isActive, activeService, hovering, tooltip } = this.state
    const { index, style, ...passProps } = this.props
    delete passProps.musicboxId
    delete passProps.openPopover
    delete passProps.isFirst
    delete passProps.isLast

    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, styles.musicboxItemContainer, style)}
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        data-tip={tooltip}
      >
        <SidelistItemMusicboxAvatar
          onClick={this.handleClick}
          onContextMenu={this.handleOpenPopover}
          isHovering={hovering}
          isActive={isActive}
          musicbox={musicbox}
          index={index} />
        <SidelistItemMusicboxActions
          musicbox={musicbox}
          isHovering={hovering}
          isActiveMusicbox={isActive}
          activeService={activeService}
          onOpenService={this.handleOpenService} />
        {this.renderActiveIndicator(musicbox, isActive)}
      </div>
    )
  }
})
module.exports = SidelistItemMusicbox
