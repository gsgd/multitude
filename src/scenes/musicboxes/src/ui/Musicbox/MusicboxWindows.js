import './musicboxWindow.less'

const React = require('react')
const { musicboxStore } = require('../../stores/musicbox')
const Welcome = require('../Welcome/Welcome')
const Musicbox = require('shared/Models/Musicbox/Musicbox')

const MusicboxStreamingTab = require('./Streaming/MusicboxStreamingTab')

module.exports = React.createClass({
  displayName: 'MusicboxWindows',

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    musicboxStore.listen(this.musicboxesChanged)
  },

  componentWillUnmount () {
    musicboxStore.unlisten(this.musicboxesChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const musicboxState = musicboxStore.getState()
    return {
      tabIds: this.generateMusicboxList(musicboxState),
      activeMusicboxId: musicboxState.activeMusicboxId() // doesn't cause re-render
    }
  },

  /**
  * Generates the musicbox list from the state
  * @param musicboxState: the state of the musicbox
  * @return a list of musicboxIds + service types
  */
  generateMusicboxList (musicboxState) {
    return musicboxState.allMusicboxes().reduce((acc, musicbox) => {
      return acc.concat(
        [`${musicbox.type}:${musicbox.id}:${Musicbox.SERVICES.DEFAULT}`],
        musicbox.enabledServies.map((service) => {
          return `${musicbox.type}:${musicbox.id}:${service}`
        })
      )
    }, [])
  },

  musicboxesChanged (musicboxState) {
    this.setState({
      tabIds: this.generateMusicboxList(musicboxState),
      activeMusicboxId: musicboxState.activeMusicboxId()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return (JSON.stringify(this.state.tabIds) !== JSON.stringify(nextState.tabIds))
  },

  /**
  * Renders an individual tab
  * @param key: the element key
  * @param musicboxType: the type of musicbox
  * @param musicboxId: the id of the musicbox
  * @param service: the service of the tab
  * @return jsx
  */
  renderTab (key, musicboxType, musicboxId, service) {
    // console.log('MusicboxWindows.renderTab', key, musicboxType, musicboxId, service)
    switch (service) {
      case Musicbox.SERVICES.DEFAULT: return this.renderStreamingTab(key, musicboxType, musicboxId, service)
    }

    return undefined
  },

  renderStreamingTab (key, musicboxType, musicboxId, service) {
    // console.log('MusicboxWindows.renderStreamingTab', key, musicboxType, musicboxId, service)
    return (<MusicboxStreamingTab
      musicboxId={musicboxId}
      key={key}
      service={service}
      preload={`../platform/webviewInjection/${musicboxType}Streaming`}
    />)
  },

  render () {
    const { tabIds } = this.state

    if (tabIds.length) {
      return (
        <div className='ReactComponent-MusicboxWindows'>
          {tabIds.map((id) => {
            const [musicboxType, musicboxId, service] = id.split(':')
            return this.renderTab(id, musicboxType, musicboxId, service)
          })}
        </div>
      )
    } else {
      return (
        <div className='ReactComponent-MusicboxWindows'>
          <Welcome />
        </div>
      )
    }
  }
})
