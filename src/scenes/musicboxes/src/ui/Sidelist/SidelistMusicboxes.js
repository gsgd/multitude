const React = require('react')
const PropTypes = require('prop-types')
const { musicboxStore } = require('../../stores/musicbox')
const SidelistItemMusicbox = require('./SidelistItemMusicbox')
const SidelistItemMusicboxPopover = require('./SidelistItemMusicbox/SidelistItemMusicboxPopover')
const shallowCompare = require('react-addons-shallow-compare')

// console.log('SidelistMusicboxes', musicboxStore)
const createReactClass = require('create-react-class')

const SidelistMusicboxes = createReactClass({

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
      musicboxIds: musicboxStore.getState().musicboxIds(),
      musicbox: null,
      popover: false,
      popoverAnchor: null,
      isFirst: false,
      isLast: false
    }
  },

  musicboxesChanged (store) {
    this.setState({
      musicboxIds: store.musicboxIds()
    })
  },

  /**
   * Opens the popover
   */
  handleOpenPopover (evt, musicbox, isFirst, isLast) {
    evt.preventDefault()
    // console.log('handleOpenPopover', evt, musicbox, isFirst, isLast)
    this.setState(Object.assign({musicbox, isFirst, isLast}, {popover: true, popoverAnchor: evt.currentTarget}))
  },

  /**
   * Opens the popover
   */
  handleClosePopover (evt) {
    // console.log('handleClosePopover', evt)
    this.setState({popover: false})
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    if (JSON.stringify(this.state.musicboxIds) !== JSON.stringify(nextState.musicboxIds)) { return true }
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicboxIds, popover, popoverAnchor, musicbox, isFirst, isLast } = this.state
    return (
      <div>
        {musicboxIds.map((musicboxId, index, arr) => {
          return (
            <SidelistItemMusicbox
              openPopover={this.handleOpenPopover}
              musicboxId={musicboxId}
              key={musicboxId}
              index={index}
              isFirst={index === 0}
              isLast={index === arr.length - 1} />)
        })}
        <SidelistItemMusicboxPopover
          musicbox={musicbox}
          isFirst={isFirst}
          isLast={isLast}
          isOpen={popover}
          anchor={popoverAnchor}
          onClose={this.handleClosePopover} />
      </div>
    )
  }
})
module.exports = SidelistMusicboxes
