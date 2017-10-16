const React = require('react')
const { IconButton } = require('material-ui')
const Colors = require('material-ui/styles/colors')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const { musicboxWizardActions } = require('../../stores/musicboxWizard')

module.exports = React.createClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemAddMusicbox',

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const { style, ...passProps } = this.props
    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, style)}
        data-tip='Add Musicbox'
        data-for='ReactComponent-Sidelist-Item-Add-Musicbox'>
        <IconButton
          iconClassName='material-icons'
          onClick={() => musicboxWizardActions.openAddMusicbox()}
          iconStyle={{ color: Colors.blueGrey400 }}>
          add_circle
        </IconButton>
        <ReactTooltip
          id='ReactComponent-Sidelist-Item-Add-Musicbox'
          place='right'
          type='dark'
          effect='solid' />
      </div>
    )
  }
})
