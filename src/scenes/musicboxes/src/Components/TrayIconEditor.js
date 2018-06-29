const React = require('react')
const PropTypes = require('prop-types')
import { Icon } from '@material-ui/core'
const {Row, Col} = require('./Grid')
import { Grid } from '@material-ui/core'
const ColorPickerButton = require('./ColorPickerButton')
const TrayPreview = require('./TrayPreview')
const settingsActions = require('../stores/settings/settingsActions')
const shallowCompare = require('react-addons-shallow-compare')

const styles = {
  subheading: {
    marginTop: 0,
    marginBottom: 10,
    color: '#CCC',
    fontWeight: '300',
    fontSize: 16
  },
  button: {
    marginTop: 5,
    marginBottom: 5
  }
}
const createReactClass = require('create-react-class')

const TrayIconEditor = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'TrayIconEditor',
  propTypes: {
    tray: PropTypes.object.isRequired,
    trayPreviewStyles: PropTypes.object
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {tray, trayPreviewStyles, ...passProps} = this.props

    return (
      <div {...passProps}>
        <h1 style={styles.subheading}>Icon</h1>
        <div style={styles.button}>
          <ColorPickerButton
            label='Border'
            icon={<Icon className='material-icons'>border_color</Icon>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
            disabled={!tray.show}
            value={tray.readColor}
            onChange={(col) => settingsActions.setTrayReadColor(col.rgbaStr)} />
        </div>
        <div style={styles.button}>
          <ColorPickerButton
            label='Background'
            icon={<Icon className='material-icons'>format_color_fill</Icon>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
            disabled={!tray.show}
            value={tray.readBackgroundColor}
            onChange={(col) => settingsActions.setTrayReadBackgroundColor(col.rgbaStr)} />
        </div>
        <TrayPreview size={100} style={trayPreviewStyles} config={{
          pixelRatio: 1,
          unreadCount: 0,
          showActiveTrack: tray.showActiveTrack,
          unreadColor: tray.unreadColor,
          readColor: tray.readColor,
          unreadBackgroundColor: tray.readBackgroundColor,
          readBackgroundColor: tray.readBackgroundColor,
          size: 100
        }} />
      </div>
    )
  }
})
module.exports = TrayIconEditor
