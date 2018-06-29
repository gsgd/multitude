const React = require('react')
import { Dialog, Button, List, ListItem, Avatar } from '@material-ui/core'
const { composeStore, composeActions } = require('../../stores/compose')
const { musicboxStore, musicboxActions } = require('../../stores/musicbox')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const MusicboxComposePicker = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxComposePicker',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    composeStore.listen(this.composeChanged)
    musicboxStore.listen(this.musicboxChanged)
  },

  componentWillUnmount () {
    composeStore.unlisten(this.composeChanged)
    musicboxStore.unlisten(this.musicboxChanged)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const musicboxState = musicboxStore.getState()
    const composeState = composeStore.getState()
    return {
      musicboxes: musicboxState.allMusicboxes(),
      composing: composeState.composing
    }
  },

  composeChanged (composeState) {
    this.setState({ composing: composeState.composing })
  },

  musicboxChanged (musicboxesState) {
    this.setState({ musicboxes: musicboxesState.allMusicboxes() })
  },

  /* **************************************************************************/
  // Data utils
  /* **************************************************************************/

  /**
  * Decides if the dialog is open or not
  * @param state=this.state: the state to calc from
  * @return true if the dialog should be open, false otherwise
  */
  isOpen (state = this.state) {
    return state.composing && state.musicboxes.length > 1
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Dismisses the compose actions
  * @param evt: the event that fired
  */
  handleCancel (evt) {
    composeActions.clearCompose()
  },

  /**
  * Handles selecting the target musicbox
  * @param evt: the event that fired
  * @param musicboxId: the id of the musicbox
  */
  handleSelectMusicbox (evt, musicboxId) {
    musicboxActions.changeActive(musicboxId)
    composeActions.setTargetMusicbox(musicboxId)
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    const prevOpen = this.isOpen(this.state)
    const nextOpen = this.isOpen(nextState)

    if (prevOpen !== nextOpen) { return true }
    if (nextOpen === false) { return false }

    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicboxes } = this.state
    const musicboxState = musicboxStore.getState()
    const actions = (
      <Button variant='raised' onClick={this.handleCancel}>Cancel</Button>
    )

    return (
      <Dialog
        title='Compose New Message'
        titleStyle={{ lineHeight: '22px' }}
        actions={actions}
        open={this.isOpen()}
        contentStyle={{ maxWidth: 'none', width: 300 }}
        bodyStyle={{ padding: 0 }}
        onClose={this.handleCancel}>
        <List>
          {musicboxes.map((musicbox) => {
            let avatarSrc = ''
            if (musicbox.hasCustomAvatar) {
              avatarSrc = musicboxState.getAvatar(musicbox.customAvatarId)
            } else if (musicbox.avatarURL) {
              avatarSrc = musicbox.avatarURL
            }

            return (
              <ListItem onClick={(evt) => this.handleSelectMusicbox(evt, musicbox.id)}
                key={musicbox.id}>
                <Avatar src={avatarSrc} backgroundColor='white' />
                {(musicbox.typeWithUsername)}
              </ListItem>
            )
          })}
        </List>
      </Dialog>
    )
  }
})
module.exports = MusicboxComposePicker

