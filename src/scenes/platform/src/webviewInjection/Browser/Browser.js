const { ipcRenderer } = require('electron')

class Browser {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    ipcRenderer.on('get-process-memory-info', (evt, data) => {
      // console.log('get-process-memory-info');
      ipcRenderer.sendToHost({
        data: process.getProcessMemoryInfo(),
        type: data.__respond__
      })
    })
  }
}

module.exports = Browser
