const MultitudeWindow = require('./MultitudeWindow')
const {shell} = require('electron')

class ContentWindow extends MultitudeWindow {

  /* ****************************************************************************/
  // Creation
  /* ****************************************************************************/

  /**
  * The default window preferences
  * @param partition: the partition to set the window to
  * @param extraPreferences = undefined: extra preferences to merge into the prefs
  * @return the settings
  */
  defaultWindowPreferences (partition, extraPreferences = undefined) {
    return Object.assign(super.defaultWindowPreferences(extraPreferences), {
      minWidth: 640,
      minHeight: 480,
      webPreferences: {
        nodeIntegration: false,
        partition: partition,
        plugins: true
      }
    })
  }

  /**
  * Starts the window
  * @param url: the start url
  * @param partition: the window partition
  * @param windowPreferences=undefined: additional window preferences to supply
  */
  start (url, partition, windowPreferences = undefined) {
    this.createWindow(this.defaultWindowPreferences(partition, windowPreferences), url)
  }

  /**
  * Creates and launches the window
  * @arguments: passed through to super()
  */
  createWindow () {
    super.createWindow.apply(this, Array.from(arguments))
    this.window.webContents.on('new-window', (evt, url) => {
      evt.preventDefault()
      shell.openExternal(url)
    })
  }
}

module.exports = ContentWindow
