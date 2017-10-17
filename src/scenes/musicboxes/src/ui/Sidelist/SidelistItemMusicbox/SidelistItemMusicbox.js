const React = require('react')
const {Badge} = require('material-ui')
const { navigationDispatch } = require('../../../Dispatch')
const { musicboxStore, musicboxActions } = require('../../../stores/musicbox')
const shallowCompare = require('react-addons-shallow-compare')
const ReactTooltip = require('react-tooltip')
const styles = require('../SidelistStyles')
const SidelistItemMusicboxPopover = require('./SidelistItemMusicboxPopover')
const SidelistItemMusicboxAvatar = require('./SidelistItemMusicboxAvatar')
const SidelistItemMusicboxServices = require('./SidelistItemMusicboxServices')
const pkg = window.appPackage()

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicbox',
  propTypes: {
    musicboxId: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    isFirst: React.PropTypes.bool.isRequired,
    isLast: React.PropTypes.bool.isRequired
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
      popover: false,
      popoverAnchor: null,
      hovering: false
    }
  },

  musicboxesChanged (musicboxState) {
    const musicbox = musicboxState.getMusicbox(this.props.musicboxId)
    this.setState({
      musicbox: musicbox,
      isActive: musicboxState.activeMusicboxId() === this.props.musicboxId,
      activeService: musicboxState.activeMusicboxService()
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
  * Opens the popover
  */
  handleOpenPopover (evt) {
    evt.preventDefault()
    this.setState({ popover: true, popoverAnchor: evt.currentTarget })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * Renders the badge element
  * @param musicbox: the musicbox to render for
  * @return jsx
  */
  renderBadge (musicbox) {
    <Badge
      onContextMenu={this.handleOpenPopover}
      onClick={this.handleClick}
      badgeContent={''}
      badgeStyle={styles.musicboxBadge}
      style={styles.musicboxBadgeContainer} />
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

  /**
  * Renders the content for the tooltip
  * @param musicbox: the musicbox to render for
  * @return jsx
  */
  renderTooltipContent (musicbox) {
    if (!musicbox.email && !musicbox.unread) { return undefined }
    const hr = '<hr style="height: 1px; border: 0; background-image: linear-gradient(to right, #bcbcbc, #fff, #bcbcbc);" />'
    const hasError = musicbox.google.authHasGrantError
    return `
      <div style="text-align:left;">
        ${musicbox.email || ''}
        ${musicbox.email && musicbox.unread ? hr : ''}
        ${musicbox.unread ? `<small>${musicbox.unread} unread message${musicbox.unread > 1 ? 's' : ''}</small>` : ''}
        ${hasError ? hr : ''}
        ${hasError ? '<span style="color:red;">Authentication Error. Right click to reauthenticate</span>' : ''}
      </div>
    `
  },

  render () {
    if (!this.state.musicbox) { return null }
    const { musicbox, isActive, activeService, popover, popoverAnchor, hovering } = this.state
    const { index, isFirst, isLast, style, ...passProps } = this.props
    delete passProps.musicboxId

    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, styles.musicboxItemContainer, style)}
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        data-tip={this.renderTooltipContent(musicbox)}
        data-for={`ReactComponent-Sidelist-Item-Musicbox-${musicbox.id}`}
        data-html>
        <ReactTooltip
          id={`ReactComponent-Sidelist-Item-Musicbox-${musicbox.id}`}
          place='right'
          type='dark'
          effect='solid' />
        <SidelistItemMusicboxAvatar
          onContextMenu={this.handleOpenPopover}
          isActive={isActive}
          isHovering={hovering}
          musicbox={musicbox}
          index={index}
          onClick={this.handleClick} />
        {pkg.prerelease ? (
          <SidelistItemMusicboxServices
            onContextMenu={this.handleOpenPopover}
            musicbox={musicbox}
            isActiveMusicbox={isActive}
            activeService={activeService}
            onOpenService={this.handleOpenService} />
        ) : undefined}
        {this.renderBadge(musicbox)}
        {this.renderActiveIndicator(musicbox, isActive)}
        <SidelistItemMusicboxPopover
          musicbox={musicbox}
          isFirst={isFirst}
          isLast={isLast}
          isOpen={popover}
          anchor={popoverAnchor}
          onRequestClose={() => this.setState({ popover: false })} />
      </div>
    )
  }
})
