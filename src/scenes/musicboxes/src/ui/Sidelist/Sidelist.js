const React = require('react')
const SidelistMusicboxes = require('./SidelistMusicboxes')
const SidelistItemAddMusicbox = require('./SidelistItemAddMusicbox')
const SidelistItemSettings = require('./SidelistItemSettings')
const SidelistItemWizard = require('./SidelistItemWizard')
const SidelistItemNews = require('./SidelistItemNews')
const { settingsStore } = require('../../stores/settings')
const {musicboxStore} = require('../../stores/musicbox')
const styles = require('./SidelistStyles')
const shallowCompare = require('react-addons-shallow-compare')
const Colors = require('material-ui/styles/colors')

module.exports = React.createClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'Sidelist',

  /* **************************************************************************/
  // Component lifecyle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsUpdated)
    musicboxStore.listen(this.musicboxUpdated)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsUpdated)
    musicboxStore.unlisten(this.musicboxUpdated)
  },

  /* **************************************************************************/
  // Data lifecyle
  /* **************************************************************************/

  getInitialState () {
    const settingsState = settingsStore.getState()
    const musicboxState = musicboxStore.getState()
    return {
      showTitlebar: settingsState.ui.showTitlebar, // purposely don't update this, because effects are only seen after restart
      showWizard: true || !settingsState.app.hasSeenAppWizard,
      showNewsInSidebar: settingsState.news.showNewsInSidebar,
      hasUnopenedNewsId: settingsState.news.hasUnopenedNewsId,
      hasUpdateInfo: settingsState.news.hasUpdateInfo,
      activeMusicbox: musicboxState.activeMusicbox()
    }
  },

  settingsUpdated (settingsState) {
    this.setState({
      showWizard: !settingsState.app.hasSeenAppWizard,
      showNewsInSidebar: settingsState.news.showNewsInSidebar,
      hasUnopenedNewsId: settingsState.news.hasUnopenedNewsId,
      hasUpdateInfo: settingsState.news.hasUpdateInfo
    })
  },

  musicboxUpdated (musicboxState) {
    if (this.state.activeMusicbox && this.state.activeMusicbox.id === musicboxState.activeMusicboxId()) { return }
    // console.log(musicboxState)
    this.setState({
      activeMusicbox: musicboxState.activeMusicbox()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {showTitlebar, showWizard, showNewsInSidebar, hasUnopenedNewsId, hasUpdateInfo, activeMusicbox} = this.state
    const isDarwin = process.platform === 'darwin'
    const { style, ...passProps } = this.props
    const currentStyle = !!activeMusicbox ? activeMusicbox.style : {}

    let extraItems = 0
    extraItems += showWizard ? 1 : 0
    extraItems += hasUpdateInfo && (showNewsInSidebar || hasUnopenedNewsId) ? 1 : 0

    const scrollerStyle = Object.assign({},
      styles.scroller,
      extraItems === 1 ? styles.scroller3Icons : undefined,
      extraItems === 2 ? styles.scroller4Icons : undefined,
      { top: isDarwin && !showTitlebar ? 25 : 0 }
    )
    const footerStyle = Object.assign({},
      styles.footer,
      extraItems === 1 ? styles.footer3Icons : undefined,
      extraItems === 2 ? styles.footer4Icons : undefined
    )

    const color = !!activeMusicbox ? activeMusicbox.color : Colors.lightBlue100

    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.container, style, currentStyle)}>
        <div
          style={scrollerStyle}
          className='ReactComponent-Sidelist-Scroller'>
          <SidelistMusicboxes />
        </div>
        <div style={footerStyle}>
          {showWizard ? (<SidelistItemWizard />) : undefined}
          {hasUpdateInfo && (showNewsInSidebar || hasUnopenedNewsId) ? (
            <SidelistItemNews iconColor={color} />) : undefined}
          <SidelistItemAddMusicbox iconColor={color} />
          <SidelistItemSettings iconColor={color} />
        </div>
      </div>
    )
  }
})
