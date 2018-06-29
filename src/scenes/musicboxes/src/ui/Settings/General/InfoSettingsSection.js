const React = require('react')
const PropTypes = require('prop-types')
import {Paper, Grid} from '@material-ui/core'
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
import * as Colors from '@material-ui/core/colors'
const { remote } = require('electron')
const { shell } = remote
const { WEB_URL, GITHUB_URL, GITHUB_ISSUE_URL } = require('shared/constants')
const {musicboxDispatch} = require('../../../Dispatch')
const musicboxStore = require('../../../stores/musicbox/musicboxStore')
const pkg = require('shared/appPackage')
const createReactClass = require('create-react-class')

const InfoSettingsSection = createReactClass({
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
      <Paper elevation={1} style={styles.paper} {...this.props}>
        <Grid container spacing={0} style={{fontSize: '85%'}} justify='center'>
          <Grid item xs={6}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <a
                  onClick={(evt) => { evt.preventDefault(); shell.openExternal(WEB_URL) }}
                  href={WEB_URL}>Multitude Website</a>
              </Grid>
              <Grid item xs={12}>
                <a
                  onClick={(evt) => {
                    evt.preventDefault()
                    shell.openExternal(GITHUB_URL)
                  }}
                  href={GITHUB_URL}>Multitude GitHub</a>
              </Grid>
              <Grid item xs={12}>
                <a
                  onClick={(evt) => {
                    evt.preventDefault()
                    shell.openExternal(GITHUB_ISSUE_URL)
                  }}
                  href={GITHUB_ISSUE_URL}>Report a bug</a>
              </Grid>
              <Grid item xs={12}>
                <a
                  // style={{color: Colors.blue[700], fontSize: '85%', marginBottom: 10, display: 'block'}}
                  onClick={this.handleShowMemoryInfo}
                  href='#'>Memory Info</a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={32}>
              <Grid item xs={12}>
                {`Version ${pkg.version} ${pkg.prerelease ? 'Prerelease' : ''}`}
              </Grid>
              <Grid item xs={12}>
                Hacked with ▶︎ by GSGD
              </Grid>
              <Grid item xs={12}>
                Built on work by Thomas Beverley.
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
})
module.exports = InfoSettingsSection
