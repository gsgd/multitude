const elconsole = require('./elconsole')
try {
  const MFPStreaming = require('./MFP/MFPStreaming')
  /*eslint-disable */
  const mfpStreaming = new MFPStreaming()
  /*eslint-enable */
} catch (ex) {
  elconsole.error('Error', ex)
}
