const React = require('react')
import { IconButton, Icon } from '@material-ui/core'
const { appWizardActions } = require('../../stores/appWizard')
const styles = require('./SidelistStyles')
const createReactClass = require('create-react-class')

const SidelistItemWizard = createReactClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemWizard',

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the app
  */
  render () {
    const { style, ...passProps } = this.props
    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.itemContainer, style)}
        data-tip='Setup Wizard'>
        <IconButton
          color='primary'
          onClick={() => appWizardActions.startWizard()}>
          <Icon className='fa fa-fw fa-magic' />
        </IconButton>
      </div>
    )
  }
})
module.exports = SidelistItemWizard
