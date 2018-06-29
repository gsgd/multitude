const React = require('react')
const PropTypes = require('prop-types')
import { Paper, TextField, IconButton } from '@material-ui/core'
import * as Colors from '@material-ui/core/colors'
const createReactClass = require('create-react-class')

const MusicboxSearch = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'MusicboxSearch',
  propTypes: {
    isSearching: PropTypes.bool.isRequired,
    onSearchChange: PropTypes.func,
    onSearchNext: PropTypes.func,
    onSearchCancel: PropTypes.func
  },

  /* **************************************************************************/
  // Data lifecylce
  /* **************************************************************************/

  getInitialState () {
    return {
      searchQuery: ''
    }
  },

  /* **************************************************************************/
  // Actions
  /* **************************************************************************/

  /**
  * Focuses the textfield
  */
  focus () { this.refs.textField.focus() },

  /**
  * @return the current search query
  */
  searchQuery () { return this.state.searchQuery },

  /* **************************************************************************/
  // Events
  /* **************************************************************************/

  /**
  * Handles the input string changing
  */
  handleChange (evt) {
    this.setState({searchQuery: evt.target.value})
    if (this.props.onSearchChange) {
      this.props.onSearchChange(evt.target.value)
    }
  },

  /**
  * Handles the find next command
  */
  handleFindNext () {
    if (this.props.onSearchNext) {
      this.props.onSearchNext(this.state.searchQuery)
    }
  },

  /**
  * Handles the search stopping
  */
  handleStopSearch () {
    this.setState({searchQuery: ''})
    if (this.props.onSearchCancel) {
      this.props.onSearchCancel()
    }
  },

  /**
  * Handles a key being pressed
  * @param evt: the event that fired
  */
  handleKeyPress (evt) {
    if (evt.keyCode === 13) {
      evt.preventDefault()
      this.handleFindNext()
    } else if (evt.keyCode === 27) {
      evt.preventDefault()
      this.handleStopSearch()
    }
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const passProps = Object.assign({}, this.props)
    delete passProps.onSearchCancel
    delete passProps.onSearchChange
    delete passProps.onSearchNext
    delete passProps.isSearching

    const className = [
      'ReactComponent-MusicboxSearch',
      this.props.isSearching ? 'active' : undefined
    ].concat(this.props.className).filter((c) => !!c).join(' ')

    return (
      <Paper {...passProps} className={className}>
        <TextField
          id='textField'
          placeholder='Search'
          style={{ marginLeft: 15 }}
          // inputStyle={{ width: 200 }}
          value={this.state.searchQuery}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress} />
        <IconButton
          className='material-icons'
          style={{ bottom: -7 }}
          // iconStyle={{ color: Colors.grey[600] }}
          onClick={this.handleFindNext}>
          search
        </IconButton>
        <IconButton
          className='material-icons'
          style={{ bottom: -7, zIndex: 1 }}
          // iconStyle={{ color: Colors.grey[600] }}
          onClick={this.handleStopSearch}>
          close
        </IconButton>
      </Paper>
    )
  }
})
module.exports = MusicboxSearch
