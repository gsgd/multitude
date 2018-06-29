const React = require('react')
const PropTypes = require('prop-types')
import { IconButton } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const { musicboxWizardActions } = require('../../stores/musicboxWizard')
const createReactClass = require('create-react-class')

const SidelistItemAddMusicbox = createReactClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemAddMusicbox',

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const {style, ...passProps} = this.props
    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, style)}
        data-tip='Add Musicbox'>
        <IconButton variant='fab'
          className='material-icons'
          onClick={() => musicboxWizardActions.openAddMusicbox()}
          color='primary'>
          add_circle
        </IconButton>
      </div>
    )
  }
})
module.exports = SidelistItemAddMusicbox
