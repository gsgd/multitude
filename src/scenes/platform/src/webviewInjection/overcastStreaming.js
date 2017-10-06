const elconsole = require('./elconsole')
try {
  const OvercastStreaming = require('./Overcast/OvercastStreaming')
  /*eslint-disable */
  const overcastStreaming = new OvercastStreaming()
  /*eslint-enable */
} catch (ex) {
  elconsole.error('Error', ex)
}
