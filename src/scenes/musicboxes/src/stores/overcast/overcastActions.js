const alt = require('../alt')
const musicboxStore = require('../musicbox/musicboxStore')

class OvercastActions {

  /* **************************************************************************/
  // Pollers
  /* **************************************************************************/

  /**
  * Starts polling the server for updates on a periodic basis
  */
  startPollingUpdates () {
    return {}
  }

  /**
  * Stops polling the server for updates
  */
  stopPollingUpdates () {
    return {}
  }

  /* **************************************************************************/
  // Profiles
  /* **************************************************************************/

  /**
  * Syncs all profiles
  */
  syncAllMusicboxProfiles () {
    const musicboxIds = musicboxStore.getState().musicboxIds()
    if (musicboxIds.length === 0) { return { promise: Promise.resolve() } }

    musicboxIds.forEach((musicboxId) => { this.syncMusicboxProfile.defer(musicboxId) })
    return {}
  }

  /**
  * Syncs a musicbox profile
  * @param musicboxId: the id of the musicbox
  */
  syncMusicboxProfile (musicboxId) {
    return { musicboxId: musicboxId }
  }

  /**
  * Deals with a musicbox sync completing
  * @param musicboxId: the id of the musicbox
  */
  syncMusicboxProfileSuccess (musicboxId) {
    return { musicboxId: musicboxId }
  }

  /**
  * Deals with a musicbox sync completing
  * @param musicboxId: the id of the musicbox
  * @param err: the error from the api
  */
  syncMusicboxProfileFailure (musicboxId, err) {
    return { musicboxId: musicboxId, err: err }
  }

  /* **************************************************************************/
  // Unread Counts
  /* **************************************************************************/

  /**
  * Syncs all profiles
  * @param forceFullSync=false: set to true to avoid the cursory check
  */
  syncAllMusicboxUnreadCounts (forceFullSync = false) {
    const musicboxIds = musicboxStore.getState().musicboxIds()
    if (musicboxIds.length === 0) { return { promise: Promise.resolve() } }

    musicboxIds.forEach((musicboxId) => this.syncMusicboxUnreadCount.defer(musicboxId, forceFullSync))
    return {}
  }

  /**
  * Syncs the unread count for a set of musicboxes
  * @param musicboxId: the id of the musicbox
  * @param forceFullSync=false: set to true to avoid the cursory check
  */
  syncMusicboxUnreadCount (musicboxId, forceFullSync = false) {
    return { musicboxId: musicboxId, forceFullSync: forceFullSync }
  }

  /**
  * Suggests that the store should sync an unread count, but could not be required
  * @param musicboxId: the id of the musicbox
  */
  suggestSyncMusicboxUnreadCount (musicboxId) {
    return { musicboxId: musicboxId }
  }

  /**
  * Deals with a musicbox unread count completing
  * @param musicboxId: the id of the musicbox
  */
  syncMusicboxUnreadCountSuccess (musicboxId) {
    return { musicboxId: musicboxId }
  }

  /**
  * Deals with a musicbox unread count erroring
  * @param musicboxId: the id of the musicbox
  * @param err: the error from the api
  */
  syncMusicboxUnreadCountFailure (musicboxId, err) {
    return { musicboxId: musicboxId, err: err }
  }

}

module.exports = alt.createActions(OvercastActions)
