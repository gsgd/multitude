const React = require('react')
const PropTypes = require('prop-types')
import { Button, Paper } from '@material-ui/core'
const shallowCompare = require('react-addons-shallow-compare')
const { Configurations } = require('../../stores/musicboxWizard')
const { Musicbox } = require('shared/Models/Musicbox')
import * as Colors from '@material-ui/core/colors'

const styles = {
  introduction: {
    textAlign: 'center',
    padding: 12,
    fontSize: '110%',
    fontWeight: 'bold'
  },
  configurations: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  configuration: {
    padding: 8,
    margin: 8,
    textAlign: 'center',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    flexBasis: '50%',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  configurationButton: {
    display: 'block',
    margin: 12
  },
  configurationImage: {
    height: 80,
    marginTop: 8,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  configurationTechInfo: {
    color: Colors.grey[500],
    fontSize: '85%'
  }
}
const createReactClass = require('create-react-class')

const ConfigureOvercastMusicboxWizard = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'ConfigureOvercastMusicboxWizard',
  propTypes: {
    onPickedConfiguration: PropTypes.func.isRequired
  },
  statics: {
    /**
    * Renders the title element
    * @return jsx
    */
    renderTitle () {
      return (
        <div style={styles.introduction}>
          Pick the type of inbox that you use in Gmail to configure WMusic
          notifications and unread counters
        </div>
      )
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { onPickedConfiguration } = this.props

    return (
      <div>
        <div style={styles.configurations}>
          <Paper
            style={styles.configuration}
            onClick={() => onPickedConfiguration(Configurations[Musicbox.TYPE_OVERCAST].DEFAULT_INBOX)}>
            <div>
              <Button variant='raised' color='primary' style={styles.configurationButton}>Categories Inbox</Button>
              <div style={Object.assign({
                backgroundImage: `url("../../images/gmail_inbox_categories_small.png")`
              }, styles.configurationImage)} />
              <p>
                I'm only interested in unread messages in the primary category
              </p>
              <p style={styles.configurationTechInfo}>
                Unread Messages in Primary Category
              </p>
            </div>
          </Paper>
          <Paper
            style={styles.configuration}
            onClick={() => onPickedConfiguration(Configurations[Musicbox.TYPE_OVERCAST].UNREAD_INBOX)}>
            <div>
              <Button variant='raised' color='primary' style={styles.configurationButton}>Unread Inbox</Button>
              <div style={Object.assign({
                backgroundImage: `url("../../images/gmail_inbox_unread_small.png")`
              }, styles.configurationImage)} />
              <p>
                I'm interested in all unread messages in my inbox
              </p>
              <p style={styles.configurationTechInfo}>
                All Unread Messages
              </p>
            </div>
          </Paper>
          <Paper
            style={styles.configuration}
            onClick={() => onPickedConfiguration(Configurations[Musicbox.TYPE_OVERCAST].PRIORIY_INBOX)}>
            <div>
              <Button variant='raised' color='primary' style={styles.configurationButton}>Priority Inbox</Button>
              <div style={Object.assign({
                backgroundImage: `url("../../images/gmail_inbox_priority_small.png")`
              }, styles.configurationImage)} />
              <p>
                I'm only interested in unread messages if they are marked as important
              </p>
              <p style={styles.configurationTechInfo}>
                Unread Important Messages
              </p>
            </div>
          </Paper>
        </div>
      </div>
    )
  }
})
module.exports = ConfigureOvercastMusicboxWizard
