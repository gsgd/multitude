const React = require('react')

const GridRow = React.createClass({
  displayName: 'GridRow',

  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.node
  },

  render () {
    return (
      <div
        {...this.props}
        className={['row', this.props.className].filter((c) => !!c).join(' ')}>
        {this.props.children}
      </div>
    )
  }
})
module.exports = GridRow