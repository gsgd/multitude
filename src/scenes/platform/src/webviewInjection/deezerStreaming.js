const elconsole = require('./elconsole')
try {
  const DeezerStreaming = require('./Deezer/DeezerStreaming')
  /*eslint-disable */
  const deezerStreaming = new DeezerStreaming()
  /*eslint-enable */
} catch (ex) {
  elconsole.error('Error', ex)
}
