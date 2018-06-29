const React = require('react')
const PropTypes = require('prop-types')
import { Button, Popover } from '@material-ui/core'
const { ChromePicker } = require('react-color')
const createReactClass = require('create-react-class')

const ColorPickerButton = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'ColorPickerButton',
  propTypes: {
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    anchorOrigin: PropTypes.object.isRequired,
    targetOrigin: PropTypes.object.isRequired,
    icon: PropTypes.node,
    onChange: PropTypes.func
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      open: false,
      anchor: null
    }
  },

  getDefaultProps () {
    return {
      label: 'Pick Colour',
      disabled: false,
      anchorOrigin: {horizontal: 'left', vertical: 'bottom'},
      targetOrigin: {horizontal: 'left', vertical: 'top'}
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const { label, disabled, onChange, anchorOrigin, targetOrigin, icon, ...passProps } = this.props
    return (
      <div {...passProps}>
        <Button variant='raised'
          icon={icon}
          disabled={disabled}
          onClick={(evt) => this.setState({ open: true, anchor: evt.target })}>
          {label}
        </Button>
        <Popover
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          anchorEl={this.state.anchor}
          open={this.state.open}
          onClose={() => this.setState({open: false})}>
          <ChromePicker
            color={this.props.value}
            onChangeComplete={(col) => {
              if (onChange) {
                onChange(Object.assign({}, col, {
                  rgbaStr: `rgba(${col.rgb.r}, ${col.rgb.g}, ${col.rgb.b}, ${col.rgb.a})`
                }))
              }
            }} />
        </Popover>
      </div>
    )
  }
})
module.exports = ColorPickerButton
