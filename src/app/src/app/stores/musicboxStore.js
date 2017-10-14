const persistence = require('../storage/musicboxStorage')
const Minivents = require('minivents')
const Musicbox = require('shared/Models/Musicbox/Musicbox')
const { MUSICBOX_INDEX_KEY } = require('shared/constants')

class MusicboxStore {
  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor () {
    Minivents(this)

    // Build the current data
    this.index = []
    this.musicboxes = new Map()

    const allRawItems = persistence.allJSONItems()
    Object.keys(allRawItems).forEach((id) => {
      if (id === MUSICBOX_INDEX_KEY) {
        this.index = allRawItems[id]
      } else {
        this.musicboxes.set(id, new Musicbox(id, allRawItems[id]))
      }
    })

    // Listen for changes
    persistence.on('changed', (evt) => {
      if (evt.key === MUSICBOX_INDEX_KEY) {
        this.index = persistence.getJSONItem(MUSICBOX_INDEX_KEY)
      } else {
        if (evt.type === 'setItem') {
          this.musicboxes.set(evt.key, new Musicbox(evt.key, persistence.getJSONItem(evt.key)))
        }
        if (evt.type === 'removeItem') {
          this.musicboxes.delete(evt.key)
        }
      }
      this.emit('changed', {})
    })
  }

  /* ****************************************************************************/
  // Getters
  /* ****************************************************************************/

  /**
  * @return the musicboxes in an ordered list
  */
  orderedMusicboxes () {
    return this.index
      .map(id => this.musicboxes.get(id))
      .filter((musicbox) => !!musicbox)
  }

  /**
  * @param id: the id of the musicbox
  * @return the musicbox record
  */
  getMusicbox (id) {
    return this.musicboxes.get(id)
  }
}

module.exports = new MusicboxStore()
