const elconsole = require('./elconsole')
try {
  const MediaStrategy = require('./MediaPlayer/SpotifyStreaming')
  const StreamingService = require('./Service/StreamingService')
  /*eslint-disable */
  const streamingService = new StreamingService(new MediaStrategy())
  /*eslint-enable */
} catch (ex) {
  elconsole.error('Error', ex)
}
