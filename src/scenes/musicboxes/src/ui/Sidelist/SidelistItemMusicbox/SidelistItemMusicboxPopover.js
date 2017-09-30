const React = require('react')
const { Popover, Menu, MenuItem, Divider, FontIcon } = require('material-ui')
const { musicboxDispatch, navigationDispatch } = require('../../../Dispatch')
const { musicboxActions } = require('../../../stores/musicbox')
const { musicboxWizardActions } = require('../../../stores/musicboxWizard')
const shallowCompare = require('react-addons-shallow-compare')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxPopover',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired,
    isFirst: React.PropTypes.bool.isRequired,
    isLast: React.PropTypes.bool.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    anchor: React.PropTypes.any,
    onRequestClose: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Closes the popover
  * @param evtOrFn: the fired event or a function to call on closed
  */
  handleClosePopover (evtOrFn) {
    this.props.onRequestClose()
    if (typeof (evtOrFn) === 'function') {
      setTimeout(() => { evtOrFn() }, 200)
    }
  },

  /**
  * Deletes this musicbox
  */
  handleDelete () {
    this.handleClosePopover(() => {
      musicboxActions.remove(this.props.musicbox.id)
    })
  },

  /**
  * Opens the inspector window for this musicbox
  */
  handleInspect () {
    musicboxDispatch.toggleDevTools(this.props.musicbox.id)
    this.handleClosePopover()
  },

  /**
  * Reloads this musicbox
  */
  handleReload () {
    musicboxDispatch.reload(this.props.musicbox.id)
    this.handleClosePopover()
  },

  /**
  * Moves this item up
  */
  handleMoveUp () {
    this.handleClosePopover(() => {
      musicboxActions.moveUp(this.props.musicbox.id)
    })
  },

  /**
  * Moves this item down
  */
  handleMoveDown () {
    this.handleClosePopover(() => {
      musicboxActions.moveDown(this.props.musicbox.id)
    })
  },

  /**
  * Handles the user requesting an account reauthentication
  */
  handeReAuthenticate () {
    musicboxActions.reauthenticateBrowserSession(this.props.musicbox.id)
    this.handleClosePopover()
  },

  /**
  * Handles opening the account settings
  */
  handleAccountSettings () {
    this.handleClosePopover(() => {
      navigationDispatch.openMusicboxSettings(this.props.musicbox.id)
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * Renders the menu items
  * @param musicbox: the musicbox to render for
  * @param isFirst: true if this is the first item
  * @Param isLast: true if this is the last item
  * @return array of jsx elements
  */
  renderMenuItems (musicbox, isFirst, isLast) {
    const menuItems = [
      // Musicbox Info
      musicbox.email ? (
        <MenuItem
          key='info'
          primaryText={musicbox.email}
          disabled />) : undefined,

      // musicbox.google.authHasGrantError ? (
      //   <MenuItem
      //     key='autherr'
      //     primaryText='Reauthenticate Account'
      //     style={{ color: 'red' }}
      //     onClick={() => {
      //       musicboxWizardActions.reauthenticateGoogleMusicbox(musicbox.id)
      //       this.handleClosePopover()
      //     }}
      //     leftIcon={<FontIcon className='material-icons' style={{ color: 'red' }}>error_outline</FontIcon>} />
      // ) : undefined,
      // musicbox.google.authHasGrantError ? (<Divider key='div-err' />) : undefined,

      // Ordering controls
      isFirst ? undefined : (
        <MenuItem
          key='moveup'
          primaryText='Move Up'
          onClick={this.handleMoveUp}
          leftIcon={<FontIcon className='material-icons'>arrow_upward</FontIcon>} />),
      isLast ? undefined : (
        <MenuItem
          key='movedown'
          primaryText='Move Down'
          onClick={this.handleMoveDown}
          leftIcon={<FontIcon className='material-icons'>arrow_downward</FontIcon>} />),
      isFirst && isLast ? undefined : (<Divider key='div-0' />),

      // Account Actions
      (<MenuItem
        key='delete'
        primaryText='Delete'
        onClick={this.handleDelete}
        leftIcon={<FontIcon className='material-icons'>delete</FontIcon>} />),
      (<MenuItem
        key='settings'
        primaryText='Account Settings'
        onClick={this.handleAccountSettings}
        leftIcon={<FontIcon className='material-icons'>settings</FontIcon>} />),
      !musicbox.artificiallyPersistCookies ? undefined : (
        <MenuItem
          key='reauthenticate'
          primaryText='Re-Authenticate'
          onClick={this.handeReAuthenticate}
          leftIcon={<FontIcon className='material-icons'>lock_outline</FontIcon>} />),
      (<Divider key='div-1' />),

      // Advanced Actions
      (<MenuItem
        key='reload'
        primaryText='Reload'
        onClick={this.handleReload}
        leftIcon={<FontIcon className='material-icons'>refresh</FontIcon>} />),
      (<MenuItem
        key='inspect'
        primaryText='Inspect'
        onClick={this.handleInspect}
        leftIcon={<FontIcon className='material-icons'>bug_report</FontIcon>} />)
    ].filter((item) => !!item)

    return menuItems
  },

  render () {
    const { musicbox, isFirst, isLast, isOpen, anchor } = this.props

    return (
      <Popover
        open={isOpen}
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'middle', vertical: 'center' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onRequestClose={this.handleClosePopover}>
        <Menu desktop onEscKeyDown={this.handleClosePopover}>
          {this.renderMenuItems(musicbox, isFirst, isLast)}
        </Menu>
      </Popover>
    )
  }
})
