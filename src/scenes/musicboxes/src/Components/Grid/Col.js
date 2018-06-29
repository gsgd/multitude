const React = require('react')
const PropTypes = require('prop-types')
const createReactClass = require('create-react-class')

const GridCol = createReactClass({
  displayName: 'GridCol',

  propTypes: {
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    offset: PropTypes.number,
    className: PropTypes.string,
    children: PropTypes.node
  },

  render () {
    const {xs, sm, md, lg, offset, className, children, ...passProps} = this.props

    let mode = 'xs'
    let size = 12
    if (xs !== undefined) {
      mode = 'xs'
      size = xs
    } else if (sm !== undefined) {
      mode = 'sm'
      size = sm
    } else if (md !== undefined) {
      mode = 'md'
      size = md
    } else if (lg !== undefined) {
      mode = 'lg'
      size = lg
    }

    const classNames = [
      ['col', mode, size].join('-'),
      offset !== undefined ? ['col', mode, 'offset', size].join('-') : undefined,
      className
    ].filter((c) => !!c).join(' ')

    return (
      <div {...passProps} className={classNames}>
        {children}
      </div>
    )
  }
})
module.exports = GridCol
