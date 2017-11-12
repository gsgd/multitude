const React = require('react')
const {
  Paper, IconButton, FontIcon, FlatButton, Popover, Menu, MenuItem, Checkbox, Toggle,
  Table, TableBody, TableRow, TableRowColumn, TableHeader, TableHeaderColumn
} = require('material-ui')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const shallowCompare = require('react-addons-shallow-compare')
const Musicbox = require('shared/Models/Musicbox/Musicbox')
const Colors = require('material-ui/styles/colors')

const settingStyles = require('../settingStyles')
const serviceStyles = {
  actionCell: {
    width: 48,
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'center'
  },
  titleCell: {
    paddingLeft: 0,
    paddingRight: 0
  },
  avatar: {
    height: 22,
    width: 22,
    top: 2
  },
  disabled: {
    textAlign: 'center',
    fontSize: '85%',
    color: Colors.grey300
  }
}

const AccountServiceSettings = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountServiceSettings',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      addPopoverOpen: false,
      addPopoverAnchor: null
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  /**
  * Renders the service name
  * @param musicboxType: the type of musicbox
  * @param service: the service type
  * @return the human name for the service
  */
  getServiceName (musicboxType, service) {
    if (musicboxType === Musicbox.TYPE_GMAIL || musicboxType === Musicbox.TYPE_GINBOX) {
      switch (service) {
        case Musicbox.SERVICES.STORAGE: return 'Google Drive'
        case Musicbox.SERVICES.CONTACTS: return 'Google Contacts'
        case Musicbox.SERVICES.NOTES: return 'Google Keep'
        case Musicbox.SERVICES.CALENDAR: return 'Google Calendar'
        case Musicbox.SERVICES.COMMUNICATION: return 'Google Hangouts'
      }
    }

    return ''
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

  /**
  * Renders the services
  * @param musicbox: the musicbox
  * @param services: the services list
  * @param sleepableServices: the list of services that are able to sleep
  * @return jsx
  */
  renderServices (musicbox, services, sleepableServices) {
    if (services.length) {
      const sleepableServicesSet = new Set(sleepableServices)

      return (
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={serviceStyles.actionCell} />
              <TableHeaderColumn style={serviceStyles.titleCell}>Service</TableHeaderColumn>
              <TableHeaderColumn
                style={serviceStyles.actionCell}
                tooltipStyle={{ marginLeft: -100 }}
                tooltip='Allows services to sleep to reduce memory consumption'>
                Sleep when not in use
              </TableHeaderColumn>
              <TableHeaderColumn style={serviceStyles.actionCell} />
              <TableHeaderColumn style={serviceStyles.actionCell} />
              <TableHeaderColumn style={serviceStyles.actionCell} />
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {services.map((service, index, arr) => {
              return (
                <TableRow key={service}>
                  <TableRowColumn style={serviceStyles.actionCell}>
                    <img
                      style={serviceStyles.avatar}
                      src={this.getServiceIconUrl(musicbox.type, service)} />
                  </TableRowColumn>
                  <TableRowColumn style={serviceStyles.titleCell}>
                    {this.getServiceName(musicbox.type, service)}
                  </TableRowColumn>
                  <TableRowColumn style={serviceStyles.actionCell}>
                    <Checkbox
                      onCheck={(evt, checked) => musicboxActions.toggleServiceSleepable(musicbox.id, service, checked)}
                      checked={sleepableServicesSet.has(service)} />
                  </TableRowColumn>
                  <TableRowColumn style={serviceStyles.actionCell}>
                    <IconButton
                      onClick={() => musicboxActions.moveServiceUp(musicbox.id, service)}
                      disabled={index === 0}>
                      <FontIcon className='material-icons'>arrow_upwards</FontIcon>
                    </IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={serviceStyles.actionCell}>
                    <IconButton
                      onClick={() => musicboxActions.moveServiceDown(musicbox.id, service)}
                      disabled={index === arr.length - 1}>
                      <FontIcon className='material-icons'>arrow_downwards</FontIcon>
                    </IconButton>
                  </TableRowColumn>
                  <TableRowColumn style={serviceStyles.actionCell}>
                    <IconButton onClick={() => musicboxActions.removeService(musicbox.id, service)}>
                      <FontIcon className='material-icons'>delete</FontIcon>
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )
    } else {
      return (
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn style={serviceStyles.disabled}>
                All Services Disabled
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      )
    }
  },

  /**
  * Renders the add popover
  * @param musicbox: the musicbox
  * @param disabledServices: the list of disabled services
  * @return jsx
  */
  renderAddPopover (musicbox, disabledServices) {
    if (disabledServices.length) {
      const { addPopoverOpen, addPopoverAnchor } = this.state
      return (
        <div style={{ textAlign: 'right' }}>
          <FlatButton
            label='Add Service'
            onClick={(evt) => this.setState({ addPopoverOpen: true, addPopoverAnchor: evt.currentTarget })} />
          <Popover
            open={addPopoverOpen}
            anchorEl={addPopoverAnchor}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.setState({ addPopoverOpen: false })}>
            <Menu>
              {disabledServices.map((service) => {
                return (
                  <MenuItem
                    key={service}
                    onClick={() => {
                      this.setState({ addPopoverOpen: false })
                      musicboxActions.addService(musicbox.id, service)
                    }}
                    primaryText={this.getServiceName(musicbox.type, service)} />)
              })}
            </Menu>
          </Popover>
        </div>
      )
    } else {
      return undefined
    }
  },

  render () {
    const { musicbox, ...passProps } = this.props

    const enabledServicesSet = new Set(musicbox.enabledServies)
    const disabledServices = musicbox.supportedServices
      .filter((s) => s !== Musicbox.SERVICES.DEFAULT && !enabledServicesSet.has(s))

    return (
      <Paper zDepth={1} style={settingStyles.paper} {...passProps}>
        <h1 style={settingStyles.subheading}>Services</h1>
        {this.renderServices(musicbox, musicbox.enabledServies, musicbox.sleepableServices)}
        {this.renderAddPopover(musicbox, disabledServices)}
        <Toggle
          toggled={musicbox.compactServicesUI}
          label='Compact Services UI'
          labelPosition='right'
          onToggle={(evt, toggled) => musicboxActions.setCompactServicesUI(musicbox.id, toggled)} />
      </Paper>
    )
  }
})
module.exports = AccountServiceSettings
