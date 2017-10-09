const React = require('react')
const { Paper, Toggle } = require('material-ui')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountAdvancedSettings',
  propTypes: {
    musicbox: React.PropTypes.object.isRequired,
    showRestart: React.PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, showRestart, ...passProps } = this.props

    return (
      <Paper zDepth={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Advanced</h1>
        <Toggle
          toggled={musicbox.artificiallyPersistCookies}
          label='Artificially Persist Cookies. Use if you are signed out every restart. (Requires Restart)'
          labelPosition='right'
          onToggle={(evt, toggled) => {
            showRestart()
            musicboxActions.artificiallyPersistCookies(musicbox.id, toggled)
          }} />
      </Paper>
    )
  }
})
