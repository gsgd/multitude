const React = require('react')
const MusicboxTab = require('./MusicboxTab')
const { musicboxStore } = require('../../stores/musicbox')
const { MAILBOX_SLEEP_WAIT } = require('shared/constants')

const REF = 'musicboxTab'

module.exports = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxTabSleepable',
  propTypes: Object.assign({}, MusicboxTab.propTypes),

  /* **************************************************************************/
  // Component lifecylce
  /* **************************************************************************/

  componentDidMount () {
    this.sleepWait = null

    musicboxStore.listen(this.musicboxUpdated)
  },

  componentWillUnmount () {
    clearTimeout(this.sleepWait)

    musicboxStore.unlisten(this.musicboxUpdated)
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.musicboxId !== nextProps.musicboxId || this.props.service !== nextProps.service) {
      clearTimeout(this.sleepWait)
      this.setState(this.getInitialState(nextProps))
    }
  },

  /* **************************************************************************/
  // Data lifecylce
  /* **************************************************************************/

  getInitialState (props = this.props) {
    const musicboxState = musicboxStore.getState()
    const isActive = musicboxState.isActive(props.musicboxId, props.service)
    const musicbox = musicboxState.getMusicbox(props.musicboxId)
    return {
      isActive: isActive,
      isSleeping: !isActive,
      allowsSleeping: musicbox ? (new Set(musicbox.sleepableServices)).has(props.service) : true
    }
  },

  musicboxUpdated (musicboxState) {
    this.setState((prevState) => {
      const musicbox = musicboxState.getMusicbox(this.props.musicboxId)
      const update = {
        isActive: musicboxState.isActive(this.props.musicboxId, this.props.service),
        allowsSleeping: musicbox ? (new Set(musicbox.sleepableServices)).has(this.props.service) : true
      }
      if (prevState.isActive !== update.isActive) {
        clearTimeout(this.sleepWait)
        if (prevState.isActive && !update.isActive) {
          this.sleepWait = setTimeout(() => {
            this.setState({ isSleeping: true })
          }, MAILBOX_SLEEP_WAIT)
        } else {
          update.isSleeping = false
        }
      }
      return update
    })
  },

  /* **************************************************************************/
  // Webview pass throughs
  /* **************************************************************************/

  send () {
    if (this.refs[REF]) {
      return this.refs[REF].send.apply(this, Array.from(arguments))
    } else {
      throw new Error('MusicboxTab is sleeping')
    }
  },
  sendWithResponse () {
    if (this.refs[REF]) {
      return this.refs[REF].sendWithResponse.apply(this, Array.from(arguments))
    } else {
      throw new Error('MusicboxTab is sleeping')
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    if (this.state.allowsSleeping && this.state.isSleeping) {
      return false
    } else {
      return (<MusicboxTab ref={REF} {...this.props} />)
    }
  }
})
