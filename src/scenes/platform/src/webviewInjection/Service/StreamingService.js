const injector = require('../injector')
const Browser = require('../Browser/Browser')
const WMail = require('../WMail/WMail')

class StreamingService {

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  constructor () {
    this.browser = new Browser()
    this.wmail = new WMail()
  }
}

module.exports = StreamingService
