const React = require('react')
import { IconButton } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const {navigationDispatch} = require('../../Dispatch')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const createReactClass = require('create-react-class')

const SidelistItemSettings = createReactClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemSettings',

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the app
  */
  render () {
    const {style, ...passProps} = this.props
    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, style)}
        data-tip='Settings'>
        <IconButton
          className='material-icons'
          onClick={() => navigationDispatch.openSettings()}
          color='primary'>
          settings
        </IconButton>
      </div>
    )
  }
})
module.exports = SidelistItemSettings
