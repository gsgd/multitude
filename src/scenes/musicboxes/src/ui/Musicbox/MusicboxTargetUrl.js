const React = require('react')
const { Paper } = require('material-ui')

const MusicboxTargetUrl = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxTargetUrl',
  propTypes: {
    url: React.PropTypes.string
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