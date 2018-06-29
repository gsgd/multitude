const React = require('react')
const PropTypes = require('prop-types')
const createReactClass = require('create-react-class')

const GridRow = createReactClass({
  displayName: 'GridRow',

  propTypes: {
    className: PropTypes.string,
    children: PropTypes.node
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
