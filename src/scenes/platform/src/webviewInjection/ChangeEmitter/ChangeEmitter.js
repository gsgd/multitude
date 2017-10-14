const {ipcRenderer} = require('electron')
const { MUSICBOX_WINDOW_INIT_REQUEST } = require('shared/constants')

class ChangeEmitter {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  /**
  * @param gmailApi: the gmail api instance
  */
  constructor () {
    this.__data__ = {intervals: []}
    document.addEventListener('DOMContentLoaded', this.onLoaded.bind(this))
    this.transmitEvent(MUSICBOX_WINDOW_INIT_REQUEST, true)
  }

  onLoaded (event) {
  }

  /* **************************************************************************/
  // Event Handlers
  /* **************************************************************************/

  /* **************************************************************************/
  // Event Emitter
  /* **************************************************************************/

  /**
  * Passing events up across the bridge
  */
  transmitEvent (type, data) {
    // console.log('transmitEvent', type, data);
    ipcRenderer.sendToHost({
      type: type,
      data: data
    })
  }
}

module.exports = ChangeEmitter
