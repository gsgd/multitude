const elconsole = require('./elconsole')
try {
  const SpotifyStreaming = require('./Spotify/SpotifyStreaming')
  /*eslint-disable */
  const spotifyStreaming = new SpotifyStreaming()
  /*eslint-enable */
} catch (ex) {
  elconsole.error('Error', ex)
}
