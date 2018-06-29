const React = require('react')
const PropTypes = require('prop-types')
import { Paper } from '@material-ui/core'
const createReactClass = require('create-react-class')

const MusicboxTargetUrl = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxTargetUrl',
  propTypes: {
    url: PropTypes.string
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const { url, ...passProps } = this.props

    const className = [
      'ReactComponent-MusicboxTargetUrl',
      url ? 'active' : undefined
    ].concat(this.props.className).filter((c) => !!c).join(' ')
    return (
      <Paper {...passProps} className={className}>
        {url}
      </Paper>
    )
  }
})
module.exports = MusicboxTargetUrl
