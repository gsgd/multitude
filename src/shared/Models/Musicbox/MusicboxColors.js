const TYPES = require('./MusicboxTypes')

let COLORS = {
  default: {color: 'rgb(230,220,210)', backgroundColor: 'rgb(0,0,0)'}
}

COLORS[TYPES.DEEZER] = {color: '#72727d', backgroundColor: '#23232c'}
COLORS[TYPES.MFP] = {color: '#a6e22e', backgroundColor: 'rgb(0, 48, 62)'}
COLORS[TYPES.OVERCAST] = {color: '#fc7e0f', backgroundColor: '#f2f2f2'}
COLORS[TYPES.SPOTIFY] = {
  color: '#1db954',
  backgroundColor: '#181818',
  backgroundImage: 'linear-gradient(rgb(96, 64, 55), rgb(9, 6, 5) 85%)'
}

module.exports = Object.freeze(COLORS)
