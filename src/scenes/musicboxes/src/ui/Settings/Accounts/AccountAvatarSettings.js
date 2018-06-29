const React = require('react')
const PropTypes = require('prop-types')
import { Paper, Button, Icon } from '@material-ui/core'
const { ColorPickerButton } = require('../../../Components')
const musicboxActions = require('../../../stores/musicbox/musicboxActions')
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const AccountAvatarSettings = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'AccountAvatarSettings',
  propTypes: {
    musicbox: PropTypes.object.isRequired
  },

  /* **************************************************************************/
  // User Interaction
  /* **************************************************************************/

  handleCustomAvatarChange (evt) {
    if (!evt.target.files[0]) { return }

    // Load the image
    const reader = new window.FileReader()
    reader.addEventListener('load', () => {
      // Get the image size
      const image = new window.Image()
      image.onload = () => {
        // Scale the image down
        const scale = 150 / (image.width > image.height ? image.width : image.height)
        const width = image.width * scale
        const height = image.height * scale

        // Resize the image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, width, height)

        // Save it to disk
        musicboxActions.setCustomAvatar(this.props.musicbox.id, canvas.toDataURL())
      }
      image.src = reader.result
    }, false)
    reader.readAsDataURL(evt.target.files[0])
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const { musicbox, ...passProps } = this.props

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Icon</h1>
        <div style={styles.button}>
          <Button variant='raised'
            // containerElement='label'
            icon={<Icon className='material-icons'>insert_emoticon</Icon>}
            style={styles.fileInputButton}>
            Change Account Icon
            <input
              type='file'
              accept='image/*'
              onChange={this.handleCustomAvatarChange}
              style={styles.fileInput} />
          </Button>
        </div>
        <div style={styles.button}>
          <Button variant='raised'
            icon={<Icon className='material-icons'>not_interested</Icon>}
            onClick={() => musicboxActions.setCustomAvatar(musicbox.id, undefined)}>
            Reset Account Icon
          </Button>
        </div>
        <div style={styles.button}>
          <ColorPickerButton
            label='Account Colour'
            icon={<Icon className='material-icons'>color_lens</Icon>}
            value={musicbox.color}
            onChange={(col) => musicboxActions.setColor(musicbox.id, col)} />
        </div>
      </Paper>
    )
  }
})
module.exports = AccountAvatarSettings
