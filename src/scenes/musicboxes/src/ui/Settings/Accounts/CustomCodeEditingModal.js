const React = require('react')
const PropTypes = require('prop-types')
import { Button, Dialog, TextField } from '@material-ui/core'
const shallowCompare = require('react-addons-shallow-compare')
const uuid = require('uuid')
const createReactClass = require('create-react-class')

const CustomCodeEditingModal = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'CustomCodeEditingModal',
  propTypes: {
    title: PropTypes.string,
    open: PropTypes.bool.isRequired,
    code: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillReceiveProps (nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({ editingKey: uuid.v4() })
    }
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      editingKey: uuid.v4()
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const actions = [
      (<Button variant='flat'
        key='cancel'
        style={{ marginRight: 8 }}
        onClick={(evt) => this.props.onCancel(evt)}>
        Cancel
      </Button>),
      (<Button variant='raised'
        key='save'
        color='primary'
        onClick={(evt) => this.props.onSave(evt, this.refs.editor.getValue())}>
        Save
      </Button>)
    ]

    return (
      <Dialog
        modal
        title={this.props.title}
        actions={actions}
        open={this.props.open}>
        <TextField
          key={this.state.editingKey}
          ref='editor'
          name='editor'
          multiLine
          defaultValue={this.props.code}
          rows={10}
          rowsMax={10}
          textareaStyle={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '14px',
            border: '1px solid rgb(224, 224, 224)',
            borderRadius: 3
          }}
          underlineShow={false}
          fullWidth />
      </Dialog>
    )
  }
})
module.exports = CustomCodeEditingModal
