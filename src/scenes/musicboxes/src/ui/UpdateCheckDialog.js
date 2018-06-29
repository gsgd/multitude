const React = require('react')
const PropTypes = require('prop-types')
const shallowCompare = require('react-addons-shallow-compare')
const TimerMixin = require('react-timer-mixin')
const compareVersion = require('compare-version')
const { UPDATE_CHECK_URL, UPDATE_CHECK_INTERVAL, UPDATE_DOWNLOAD_URL } = require('shared/constants')
import { Button, Dialog } from '@material-ui/core'
const settingsStore = require('../stores/settings/settingsStore')
const settingsActions = require('../stores/settings/settingsActions')
const pkg = require('shared/appPackage')
const {
  remote: {shell}
} = require('electron')
const createReactClass = require('create-react-class')

const UpdateCheckDialog = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'UpdateCheckDialog',
  mixins: [TimerMixin],

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    this.recheckTO = null
    this.checkNow()
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      newerVersion: null,
      recheckRestart: false
    }
  },

  /* **************************************************************************/
  // Checking
  /* **************************************************************************/

  /**
  * Checks with the server for an update
  */
  checkNow () {
    Promise.resolve()
      .then(() => window.fetch(`${UPDATE_CHECK_URL}?_=${new Date().getTime()}`))
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => res.json())
      .then((res) => {
        let update
        const release = res.release || {version: 0}
        const prerelease = res.prerelease || {version: 0}
        if (pkg.prerelease) {
          if (compareVersion(prerelease.version, release.version) >= 1) { // prerelease is newest
            if (compareVersion(prerelease.version, pkg.version) >= 1) {
              update = prerelease.version
            }
          } else { // release is newest
            if (compareVersion(release.version, pkg.version) >= 1) {
              update = release.version
            }
          }
        } else {
          if (compareVersion(release.version, pkg.version) >= 1) {
            update = release.version
          }
        }

        if (pkg.prerelease) {
          if (res.prerelease.news) {
            settingsActions.updateLatestNews(res.prerelease.news)
          }
        } else {
          if (res.release.news) {
            settingsActions.updateLatestNews(res.release.news)
          }
        }

        if (update) {
          if (this.state.recheckRestart || settingsStore.getState().app.checkForUpdates === false) {
            this.scheduleNextCheck()
          } else {
            this.setState({ newerVersion: update })
            this.clearTimeout(this.recheckTO)
          }
        } else {
          this.setState({ newerVersion: null })
          this.scheduleNextCheck()
        }
      })
  },

  /**
  * Schedules the next check
  */
  scheduleNextCheck () {
    this.clearTimeout(this.recheckTO)
    this.recheckTO = this.setTimeout(() => {
      this.checkNow()
    }, UPDATE_CHECK_INTERVAL)
  },

  /**
  * Dismisses the modal an waits for the next check
  */
  recheckLater () {
    this.setState({ newerVersion: null })
    this.scheduleNextCheck()
  },

  /**
  * Cancels the recheck and rechecks after reboot
  */
  recheckRestart () {
    this.setState({
      newerVersion: null,
      recheckRestart: true
    })
    this.recheckLater()
  },

  /**
  * Opens the download link
  */
  downloadNow () {
    shell.openExternal(UPDATE_DOWNLOAD_URL)
    this.recheckLater()
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const buttons = [
      (<Button
        key='restart'
        style={{ marginRight: 16 }}
        onClick={this.recheckRestart}>
        After Restart
      </Button>),
      (<Button
        key='later'
        style={{ marginRight: 16 }}
        onClick={this.recheckLater}>
        Later
      </Button>),
      (<Button
        key='now'
        variant='contained'
        color='primary'
        onClick={this.downloadNow}>
        Download Now
      </Button>)
    ]

    return (
      <Dialog
        title='Update Available'
        actions={buttons}
        open={this.state.newerVersion !== null}
        onClose={this.recheckLater}>
        <p>
          <span>Version </span>
          <span>{this.state.newerVersion}</span>
          <span> is now available. Do you want to download it now?</span>
        </p>
      </Dialog>
    )
  }
})
module.exports = UpdateCheckDialog
