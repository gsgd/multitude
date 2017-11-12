const React = require('react')
const { musicboxStore } = require('../../stores/musicbox')
const SidelistItemMusicbox = require('./SidelistItemMusicbox')

// console.log('SidelistMusicboxes', musicboxStore)

const SidelistMusicboxes = React.createClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistMusicboxes',

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
    return {
      musicboxIds: musicboxStore.getState().musicboxIds()
    }
  },

  musicboxesChanged (store) {
    this.setState({
      musicboxIds: store.musicboxIds()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    if (JSON.stringify(this.state.musicboxIds) !== JSON.stringify(nextState.musicboxIds)) { return true }
    return false
  },

  render () {
    const { styles, ...passProps } = this.props
    const { musicboxIds } = this.state
    return (
      <div style={Object.assign({}, styles)} {...passProps}>
        {musicboxIds.map((musicboxId, index, arr) => {
          return (
            <SidelistItemMusicbox
              musicboxId={musicboxId}
              key={musicboxId}
              index={index}
              isFirst={index === 0}
              isLast={index === arr.length - 1} />)
        })}
      </div>
    )
  }
})
module.exports = SidelistMusicboxes