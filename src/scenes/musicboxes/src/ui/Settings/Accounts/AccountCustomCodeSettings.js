const React = require('react')
const PropTypes = require('prop-types')
import { Paper, Button, Icon } from '@material-ui/core'
const CustomCodeEditingModal = require('./CustomCodeEditingModal')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const {musicboxDispatch} = require('../../../Dispatch')
const { USER_SCRIPTS_WEB_URL } = require('shared/constants')
import * as Colors from '@material-ui/core/colors'
const {
  remote: {shell}
} = require('electron')
const createReactClass = require('create-react-class')

const AccountCustomCodeSettings = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountCustomCodeSettings',
  propTypes: {
    musicbox: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      editingCSS: false,
      editingJS: false
    }
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  handleSave (evt, code) {
    if (this.state.editingCSS) {
      musicboxActions.setCustomCSS(this.props.musicbox.id, code)
    } else if (this.state.editingJS) {
      musicboxActions.setCustomJS(this.props.musicbox.id, code)
    }

    this.setState({ editingJS: false, editingCSS: false })
    musicboxDispatch.reloadAllServices(this.props.musicbox.id)
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, ...passProps } = this.props
    let editingCode
    let editingTitle
    if (this.state.editingCSS) {
      editingCode = musicbox.customCSS
      editingTitle = 'Custom CSS'
    } else if (this.state.editingJS) {
      editingCode = musicbox.customJS
      editingTitle = 'Custom JS'
    }

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Custom Code</h1>
        <div style={styles.button}>
          <Button variant='raised'
            icon={<Icon className='material-icons'>code</Icon>}
            onClick={() => this.setState({ editingCSS: true, editingJS: false })}>
            Custom CSS
          </Button>
        </div>
        <div style={styles.button}>
          <Button variant='raised'
            icon={<Icon className='material-icons'>code</Icon>}
            onClick={() => this.setState({ editingCSS: false, editingJS: true })}>
            Custom JavaScript
          </Button>
        </div>
        <div style={styles.button}>
          <a
            style={{color: Colors.blue[700], fontSize: '85%', marginBottom: 10, display: 'block'}}
            onClick={(evt) => { evt.preventDefault(); shell.openExternal(USER_SCRIPTS_WEB_URL) }}
            href={USER_SCRIPTS_WEB_URL}>Find custom userscripts</a>
        </div>
        <CustomCodeEditingModal
          open={this.state.editingCSS || this.state.editingJS}
          title={editingTitle}
          code={editingCode}
          onCancel={() => this.setState({ editingCSS: false, editingJS: false })}
          onSave={this.handleSave} />
      </Paper>
    )
  }
})
module.exports = AccountCustomCodeSettings
