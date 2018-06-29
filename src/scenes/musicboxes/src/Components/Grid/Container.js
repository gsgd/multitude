const React = require('react')
const PropTypes = require('prop-types')
const createReactClass = require('create-react-class')

const GridContainer = createReactClass({
  displayName: 'GridContainer',

  propTypes: {
    className: PropTypes.string,
    children: PropTypes.node,
    fluid: PropTypes.bool
  },

  render () {
    const {fluid, className, ...passProps} = this.props

    const classNames = [
      fluid ? 'container-fluid' : 'conainer',
      className
    ].filter((c) => !!c).join(' ')

    return (
      <div {...passProps} className={classNames}>
        {this.props.children}
      </div>
    )
  }
})
module.exports = GridContainer
