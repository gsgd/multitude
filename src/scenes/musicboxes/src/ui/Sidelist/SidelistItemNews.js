const React = require('react')
const PropTypes = require('prop-types')
import { IconButton, Icon, Badge } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const {navigationDispatch} = require('../../Dispatch')
const styles = require('./SidelistStyles')
const ReactTooltip = require('react-tooltip')
const { settingsStore } = require('../../stores/settings')
const createReactClass = require('create-react-class')

const SidelistItemNews = createReactClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'SidelistItemNews',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    settingsStore.listen(this.settingsUpdated)
  },

  componentWillUnmount () {
    settingsStore.unlisten(this.settingsUpdated)
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      hasUnopenedNewsId: settingsStore.getState().news.hasUnopenedNewsId,
      newsLevel: settingsStore.getState().news.newsLevel
    }
  },

  settingsUpdated (settingsState) {
    this.setState({
      hasUnopenedNewsId: settingsState.news.hasUnopenedNewsId,
      newsLevel: settingsState.news.newsLevel
    })
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  handleClick () {
    navigationDispatch.openNews()
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const {style, ...passProps} = this.props
    const { hasUnopenedNewsId, newsLevel } = this.state
    return (
      <div
        {...passProps}
        style={Object.assign({}, styles.newsItemContainer, style)}
        data-tip='News'>
        <IconButton
          onClick={this.handleClick}
          color='primary'>
          <Icon className='fa fa-fw fa-newspaper-o' />
        </IconButton>
        {hasUnopenedNewsId && newsLevel === 'notify' ? (
          <Badge
            onClick={this.handleClick}
            badgeStyle={styles.newsBadge}
            style={styles.newsBadgeContainer}
            badgeContent='New' />
        ) : undefined}
      </div>
    )
  }
})
module.exports = SidelistItemNews
