const TYPES = require('./MusicboxTypes')

let URLS = {}

URLS[TYPES.DEEZER] = 'http://www.deezer.com'
URLS[TYPES.MFP] = 'http://musicforprogramming.net'
URLS[TYPES.OVERCAST] = 'https://overcast.fm'
URLS[TYPES.SPOTIFY] = 'https://open.spotify.com'

module.exports = Object.freeze(URLS)
