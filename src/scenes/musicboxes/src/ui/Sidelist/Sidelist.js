const React = require('react')
const PropTypes = require('prop-types')
const SidelistMusicboxes = require('./SidelistMusicboxes')
const SidelistItemAddMusicbox = require('./SidelistItemAddMusicbox')
const SidelistItemSettings = require('./SidelistItemSettings')
const SidelistItemWizard = require('./SidelistItemWizard')
const SidelistItemNews = require('./SidelistItemNews')
const ReactTooltip = require('react-tooltip')
const { settingsStore } = require('../../stores/settings')
const {musicboxStore} = require('../../stores/musicbox')
const styles = require('./SidelistStyles')
const shallowCompare = require('react-addons-shallow-compare')
import * as Colors from '@material-ui/core/colors'
const createReactClass = require('create-react-class')

const Sidelist = createReactClass({

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
      showWizard: !settingsState.app.hasSeenAppWizard,
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
    // if (this.state.activeMusicbox && this.state.activeMusicbox.id === musicboxState.activeMusicboxId()) { return }
    // console.log(musicboxState)
    const activeMusicbox = musicboxState.activeMusicbox()
    this.setState({
      activeMusicbox: activeMusicbox,
      style: activeMusicbox ? activeMusicbox.style : {}
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
    const currentStyle = activeMusicbox ? activeMusicbox.style : {}
    // console.log('Sidelist.currentStyle', currentStyle);

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

    const color = activeMusicbox ? activeMusicbox.color : Colors.lightBlue[100]

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
          {showWizard && <SidelistItemWizard />}
          {hasUpdateInfo && (showNewsInSidebar || hasUnopenedNewsId) ? (
            <SidelistItemNews />) : undefined}
          <SidelistItemAddMusicbox />
          <SidelistItemSettings />
        </div>
        <ReactTooltip
          place='right'
          type='dark'
          effect='solid'/>
      </div>
    )
  }
})
module.exports = Sidelist
