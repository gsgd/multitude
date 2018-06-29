const ipc = require('electron').ipcRenderer

class Reporter {
  reportError (errorStr) {
    ipc.send('report-error', { error: errorStr })
  }
}

const instance = new Reporter()
module.exports = instance
