const React = require('react')
const PropTypes = require('prop-types')
const {
  Dialog, Button, Checkbox, Switch,
  Table, TableBody, TableRow, TableCell
} = require('@material-ui/core')
const { musicboxWizardStore, musicboxWizardActions } = require('../../stores/musicboxWizard')
const { Musicbox } = require('shared/Models/Musicbox')

const styles = {
  introduction: {
    textAlign: 'center',
    padding: 12,
    fontSize: '110%',
    fontWeight: 'bold'
  },
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
  }
}
const createReactClass = require('create-react-class')

const ConfigureMusicboxServicesDialog = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'ConfigureMusicboxServicesDialog',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxWizardStore.listen(this.musicboxWizardChanged)
  },

  componentWillUnmount () {
    musicboxWizardStore.unlisten(this.musicboxWizardChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState (wizardState = musicboxWizardStore.getState()) {
    return {
      isOpen: wizardState.configureServicesOpen,
      musicboxType: wizardState.provisonaMusicboxType(),
      availableServices: wizardState.provisionalMusicboxSupportedServices(),
      enabledServices: new Set(wizardState.provisionalDefaultMusicboxServices()),
      compactServices: false
    }
  },

  musicboxWizardChanged (wizardState) {
    this.setState((prevState) => {
      if (!prevState.isOpen && wizardState.configureServicesOpen) {
        return this.getInitialState(wizardState)
      } else {
        return { isOpen: wizardState.configureServicesOpen }
      }
    })
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Toggles a service
  * @param service: the service type
  * @param toggled: true if its enabled, false otherwise
  */
  handleToggleService (service, toggled) {
    this.setState((prevState) => {
      const enabledServices = new Set(Array.from(prevState.enabledServices))
      enabledServices[toggled ? 'add' : 'delete'](service)
      return { enabledServices: enabledServices }
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

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

  render () {
    const { isOpen, enabledServices, musicboxType, availableServices, compactServices } = this.state
    const actions = (
      <Button
        color='primary'
        onClick={() => {
          musicboxWizardActions.configureMusicboxServices(Array.from(enabledServices), compactServices)
        }}>
          Next
      </Button>
    )

    return (
      <Dialog
        className='ReactComponent-MaterialUI-Dialog-Body-Scrollbars'
        modal
        actions={actions}
        open={isOpen}>
        <div style={styles.introduction}>
          Multitude also gives you access to the other services you use. Pick which
          services you would like to enable for this account
        </div>

        <Table>
          <TableBody>
            {availableServices.map((service) => {
              return (
                <TableRow key={service}>
                  <TableCell style={styles.actionCell}>
                    <img
                      style={styles.avatar}
                      src={this.getServiceIconUrl(musicboxType, service)} />
                  </TableCell>
                  <TableCell style={styles.titleCell}>
                    {this.getServiceName(musicboxType, service)}
                  </TableCell>
                  <TableCell style={styles.actionCell}>
                    <Checkbox
                      onCheck={(evt, checked) => this.handleToggleService(service, checked)}
                      checked={enabledServices.has(service)} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        <Switch
          checked={compactServices}
          label='Show sidebar services in compact mode'
          value='compactServices'
          onChange={(evt, toggled) => this.setState({ compactServices: toggled })} />
      </Dialog>
    )
  }
})
module.exports = ConfigureMusicboxServicesDialog
