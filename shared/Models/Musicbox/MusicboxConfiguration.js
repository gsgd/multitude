const MusicboxTypes = {
  DEEZER: 'deezer',
  MFP: 'mfp',
  OVERCAST: 'overcast',
  SOUNDCLOUD: 'soundcloud',
  SPOTIFY: 'spotify'
}

const AssetsDir = '../../../../assets'

let MusicboxData = {}

MusicboxData[MusicboxTypes.DEEZER] = {
  img: `${AssetsDir}/images/deezer_icon_512.svg`,
  title: 'Deezer',
  type: MusicboxTypes.DEEZER,
  style: {color: '#72727d', backgroundColor: '#23232c'},
  url: 'http://www.deezer.com',
  customTileBackground: 'https://cdns-files.dzcdn.net/cache/slash/images/unlogged/homepage/header/visual.f3a2f31edaa3cf69ef9c3aae31da9ae0.jpg'
}

MusicboxData[MusicboxTypes.MFP] = {
  img: `${AssetsDir}/images/mfp_icon_512.jpg`,
  title: 'Music For Programmers',
  type: MusicboxTypes.MFP,
  style: {color: '#a6e22e', backgroundColor: 'rgb(0, 48, 62)'},
  url: 'http://musicforprogramming.net'
}

MusicboxData[MusicboxTypes.OVERCAST] = {
  img: `${AssetsDir}/images/overcast_icon_512.svg`,
  title: 'Overcast',
  type: MusicboxTypes.OVERCAST,
  style: {color: '#f2f2f2', backgroundColor: '#fc7e0f'},
  url: 'https://overcast.fm'
}

MusicboxData[MusicboxTypes.SOUNDCLOUD] = {
  img: `${AssetsDir}/images/soundcloud_icon_512.svg`,
  title: 'SoundCloud',
  type: MusicboxTypes.SOUNDCLOUD,
  style: {color: '#f50', backgroundColor: '#333'},
  url: 'https://soundcloud.com',
  customTileBackground: 'https://a-v2.sndcdn.com/assets/images/home/hp_image@2x-ae2160d.jpg'
}

MusicboxData[MusicboxTypes.SPOTIFY] = {
  img: `${AssetsDir}/images/spotify_icon_512.svg`,
  title: 'Spotify',
  type: MusicboxTypes.SPOTIFY,
  style: {
    color: '#1db954',
    backgroundColor: '#181818',
    backgroundImage: 'linear-gradient(rgb(96, 64, 55), rgb(9, 6, 5) 85%)'
  },
  url: 'https://open.spotify.com',
  customTileBackground: 'https://open.scdn.co/static/images/login-background.jpg'
}

const config = Object.freeze({
  MusicboxTypes: MusicboxTypes,
  MusicboxData: MusicboxData,
  Default: {
    style: {color: 'rgb(230,220,210)', backgroundColor: 'rgb(0,0,0)'}
  }
})
module.exports = config
