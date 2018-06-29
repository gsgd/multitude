const addLink = require('shared/addLink')
addLink(__dirname, './NewsDialog.less')

const React = require('react')
const shallowCompare = require('react-addons-shallow-compare')
import { Button, Dialog, DialogActions, DialogContent, Switch, FormControlLabel, Grid } from '@material-ui/core'
const { settingsActions, settingsStore } = require('../stores/settings')
const navigationDispatch = require('../Dispatch/navigationDispatch')
const WebView = require('../Components/WebView')
const {
  remote: {shell}
} = require('electron')
const createReactClass = require('create-react-class')

const NewsDialog = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'NewsDialog',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsUpdated)
    navigationDispatch.on('opennews', this.handleOpen)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsUpdated)
    navigationDispatch.off('opennews', this.handleOpen)
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  getInitialState () {
    const settingsState = settingsStore.getState()
    return {
      feedUrl: settingsState.news.newsFeed,
      newsId: settingsState.news.newsId,
      newsLevel: settingsState.news.newsLevel,
      hasUnopenedNewsId: settingsState.news.hasUnopenedNewsId,
      hasUpdateInfo: settingsState.news.hasUpdateInfo,
      showNewsInSidebar: settingsState.news.showNewsInSidebar,
      open: this.shouldAutoOpen(settingsState.news)
    }
  },

  settingsUpdated (settingsState) {
    this.setState((prevState) => {
      const update = {
        feedUrl: settingsState.news.newsFeed,
        newsId: settingsState.news.newsId,
        newsLevel: settingsState.news.newsLevel,
        hasUnopenedNewsId: settingsState.news.hasUnopenedNewsId,
        hasUpdateInfo: settingsState.news.hasUpdateInfo,
        showNewsInSidebar: settingsState.news.showNewsInSidebar
      }

      const autoOpen = this.shouldAutoOpen(settingsState.news)
      if (autoOpen && prevState.open !== autoOpen) {
        update.open = true
      }

      return update
    })
  },

  shouldAutoOpen (news) {
    if (news.hasUnopenedNewsId && news.hasUpdateInfo && news.newsLevel === 'dialog') {
      return true
    } else {
      return false
    }
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  handleDone (evt) {
    settingsActions.openNewsItem(this.state.newsId)
    this.setState({ open: false })
  },

  handleOpen () {
    settingsActions.openNewsItem(this.state.newsId)
    this.setState({ open: true })
  },

  handleOpenNewWindow (evt) {
    shell.openExternal(evt.url)
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    if (!this.state.open) return null

    const { open, feedUrl, showNewsInSidebar } = this.state
    const {sidebarClasses} = this.props

    return (
      <Dialog
        open={open}
        fullScreen
        onClose={this.handleDone}
        classes={sidebarClasses}>
        <DialogContent
          className='ReactComponent-NewsDialog-Body'>
          <WebView
            src={feedUrl}
            newWindow={this.handleOpenNewWindow}
          />
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item container xs={6} justify='flex-start'>
              <Grid item>
                <FormControlLabel
                  control={<Switch/>}
                  checked={showNewsInSidebar}
                  label='Always show in sidebar'
                  // labelStyle={{ color: 'rgb(189,189,189)' }}
                  style={{color: 'rgb(189,189,189)'}}
                  onChange={(evt, toggled) => {
                    settingsActions.setShowNewsInSidebar(toggled)
                  }}/>
              </Grid>
            </Grid>
            <Grid item container xs={6} justify='flex-end'>
              <Grid item>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleDone}>
                  Done
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    )
  }
})
module.exports = NewsDialog
