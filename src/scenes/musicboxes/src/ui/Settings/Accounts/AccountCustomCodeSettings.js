const React = require('react')
const { Paper, RaisedButton, FontIcon } = require('material-ui')
const CustomCodeEditingModal = require('./CustomCodeEditingModal')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const {musicboxDispatch} = require('../../../Dispatch')
const { USER_SCRIPTS_WEB_URL } = require('shared/constants')
const Colors = require('material-ui/styles/colors')
const {
  remote: {shell}
} = window.nativeRequire('electron')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountCustomCodeSettings',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired
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
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Custom Code</h1>
        <div style={styles.button}>
          <RaisedButton
            label='Custom CSS'
            icon={<FontIcon className='material-icons'>code</FontIcon>}
            onTouchTap={() => this.setState({ editingCSS: true, editingJS: false })} />
        </div>
        <div style={styles.button}>
          <RaisedButton
            label='Custom JavaScript'
            icon={<FontIcon className='material-icons'>code</FontIcon>}
            onTouchTap={() => this.setState({ editingCSS: false, editingJS: true })} />
        </div>
        <div style={styles.button}>
          <a
            style={{color: Colors.blue700, fontSize: '85%', marginBottom: 10, display: 'block'}}
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
