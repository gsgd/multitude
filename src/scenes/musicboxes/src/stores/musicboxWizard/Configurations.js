const { Musicbox } = require('shared/Models/Musicbox')
const configurations = {}
configurations[Musicbox.TYPES.DEEZER] = {
  DEFAULT_DEEZER: { // Unread Messages in primary category
    deezerConf: {
    }
  }
}
module.exports = configurations
