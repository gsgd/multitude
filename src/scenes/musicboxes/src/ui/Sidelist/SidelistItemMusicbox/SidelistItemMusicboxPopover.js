const React = require('react')
const PropTypes = require('prop-types')
import { Popover, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Icon } from '@material-ui/core'
const { musicboxDispatch, navigationDispatch } = require('../../../Dispatch')
const { musicboxActions } = require('../../../stores/musicbox')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const SidelistItemMusicboxPopover = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemMusicboxPopover',
  propTypes: {
    musicbox: PropTypes.object,
    isFirst: PropTypes.bool.isRequired,
    isLast: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    anchor: PropTypes.any,
    onClose: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  /**
  * Closes the popover
  * @param evtOrFn: the fired event or a function to call on closed
  */
  handleClosePopover (evtOrFn) {
    this.props.onClose()
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
   * @param isLast: true if this is the last item
  * @return array of jsx elements
  */
  renderMenuItems (musicbox, isFirst, isLast) {
    return [
      // Musicbox Info
      musicbox.typeWithUsername ? (
        <MenuItem
          key='info'
          disabled>
          {musicbox.typeWithUsername}
        </MenuItem>) : undefined,

      // Ordering controls
      isFirst ? undefined : (
        <MenuItem
          key='moveup'
          onClick={this.handleMoveUp}>
          <ListItemIcon>
            <Icon className='material-icons'>arrow_upward</Icon>
          </ListItemIcon>
          <ListItemText>
            Move Up
          </ListItemText>
        </MenuItem>),
      isLast ? undefined : (
        <MenuItem
          key='movedown'
          onClick={this.handleMoveDown}>
          <ListItemIcon>
            <Icon className='material-icons'>arrow_downward</Icon>
          </ListItemIcon>
          <ListItemText>
            Move Down
          </ListItemText>
        </MenuItem>),
      isFirst && isLast ? undefined : (<Divider key='div-0' />),

      // Account Actions
      (<MenuItem
        key='delete'
        onClick={this.handleDelete}>
        <ListItemIcon>
          <Icon className='material-icons'>delete</Icon>
        </ListItemIcon>
        <ListItemText>
            Delete
        </ListItemText>
      </MenuItem>),
      (<MenuItem
        key='settings'
        onClick={this.handleAccountSettings}>
        <ListItemIcon>
          <Icon className='material-icons'>settings</Icon>
        </ListItemIcon>
        <ListItemText>
            Account Settings
        </ListItemText>
      </MenuItem>),
      !musicbox.artificiallyPersistCookies ? undefined : (
        <MenuItem
          key='reauthenticate'
          onClick={this.handeReAuthenticate}>
          <ListItemIcon>
            <Icon className='material-icons'>lock_outline</Icon>
          </ListItemIcon>
          <ListItemText>
            Re-Authenticate
          </ListItemText>
        </MenuItem>),
      (<Divider key='div-1' />),

      // Advanced Actions
      (<MenuItem
        key='reload'
        onClick={this.handleReload}>
        <ListItemIcon>
          <Icon className='material-icons'>refresh</Icon>
        </ListItemIcon>
        <ListItemText>
            Reload
        </ListItemText>
      </MenuItem>),
      (<MenuItem
        key='inspect'
        onClick={this.handleInspect}>
        <ListItemIcon>
          <Icon className='material-icons'>bug_report</Icon>
        </ListItemIcon>
        <ListItemText>
            Inspect
        </ListItemText>
      </MenuItem>)
    ].filter((item) => !!item)
  },

  render () {
    const { musicbox, isFirst, isLast, isOpen, anchor } = this.props
    if (!musicbox) return null
    return (
      <Menu
        open={isOpen}
        anchorEl={anchor}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        disableAutoFocus
        onEscapeKeyDown={this.handleClosePopover}
        onClose={this.handleClosePopover}>
        <MenuList>
          {this.renderMenuItems(musicbox, isFirst, isLast)}
        </MenuList>
      </Menu>
    )
  }
})
module.exports = SidelistItemMusicboxPopover
