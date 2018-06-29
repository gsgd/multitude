const React = require('react')
import { Dialog } from '@material-ui/core'
const dictionariesStore = require('../../stores/dictionaries/dictionariesStore')
const DictionaryInstallStepper = require('./DictionaryInstallStepper')
const createReactClass = require('create-react-class')

const DictionaryInstallHandler = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'DictionaryInstallHandler',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentWillMount () {
    dictionariesStore.listen(this.dictionariesChanged)
  },

  componentWillUnmount () {
    dictionariesStore.unlisten(this.dictionariesChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const store = dictionariesStore.getState()
    return {
      isInstalling: store.isInstalling(),
      installId: store.installId()
    }
  },

  dictionariesChanged (store) {
    this.setState({
      isInstalling: store.isInstalling(),
      installId: store.installId()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    return !this.state.isInstalling ? null : (
      <Dialog
        modal
        title={`Install Dictionary`}
        open={this.state.isInstalling}>
        <DictionaryInstallStepper key={this.state.installId} />
      </Dialog>
    )
  }
})
module.exports = DictionaryInstallHandler
