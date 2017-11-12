const React = require('react')
const {Paper} = require('material-ui')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const Colors = require('material-ui/styles/colors')
const { remote } = require('electron')
const { shell } = remote
const { WEB_URL, GITHUB_URL, GITHUB_ISSUE_URL } = require('shared/constants')
const {musicboxDispatch} = require('../../../Dispatch')
const musicboxStore = require('../../../stores/musicbox/musicboxStore')
const pkg = require('shared/appPackage')

const InfoSettingsSection = React.createClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'InfoSettingsSection',

  /* **************************************************************************/
  // UI Event
  /* **************************************************************************/

  /**
  * Shows a snapshot of the current memory consumed
  */
  handleShowMemoryInfo (evt) {
    evt.preventDefault()

    const sizeToMb = (size) => { return Math.round(size / 1024) }

    musicboxDispatch.fetchProcessMemoryInfo().then((musicboxesProc) => {
      // console.log('fetchProcessMemoryInfo.musicboxesProc', musicboxesProc)
      const musicboxProcIndex = musicboxesProc.reduce((acc, info) => {
        acc[info.musicboxId] = info.memoryInfo
        return acc
      }, {})
      const musicboxes = musicboxStore.getState().musicboxIds().map((musicboxId, index) => {
        if (musicboxProcIndex[musicboxId]) {
          return `Musicbox ${index + 1}: ${sizeToMb(musicboxProcIndex[musicboxId].workingSetSize)}mb`
        } else {
          return `Musicbox ${index + 1}: No info`
        }
      })

      window.alert([
        `Main Process ${sizeToMb(remote.process.getProcessMemoryInfo().workingSetSize)}mb`,
        `Musicboxes Window ${sizeToMb(process.getProcessMemoryInfo().workingSetSize)}mb`,
        ''
      ].concat(musicboxes).join('\n'))
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    return (
      <Paper zDepth={1} style={styles.paper} {...this.props}>
        <a
          style={{color: Colors.blue700, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={(evt) => { evt.preventDefault(); shell.openExternal(WEB_URL) }}
          href={WEB_URL}>Multitude Website</a>
        <a
          style={{color: Colors.blue700, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={(evt) => { evt.preventDefault(); shell.openExternal(GITHUB_URL) }}
          href={GITHUB_URL}>Multitude GitHub</a>
        <a
          style={{color: Colors.blue700, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={(evt) => { evt.preventDefault(); shell.openExternal(GITHUB_ISSUE_URL) }}
          href={GITHUB_ISSUE_URL}>Report a bug</a>
        <a
          style={{color: Colors.blue700, fontSize: '85%', marginBottom: 10, display: 'block'}}
          onClick={this.handleShowMemoryInfo}
          href='#'>Memory Info</a>
        <div style={{ fontSize: '85%' }}>
          <p>
            {`Version ${pkg.version} ${pkg.prerelease ? 'Prerelease' : ''}`}
          </p>
          <p>
            Hacked with ▶︎ by GSGD
            Built on work by Thomas Beverley.
          </p>
        </div>
      </Paper>
    )
  }
})
module.exports = InfoSettingsSection
