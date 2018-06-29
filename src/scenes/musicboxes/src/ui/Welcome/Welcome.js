const React = require('react')
const { musicboxWizardActions } = require('../../stores/musicboxWizard')
import { Grid, Button, Typography } from '@material-ui/core'
const MultitudeIcon = require('shared/MultitudeIcon')
const AssetsDir = '../../../../assets'
import { withTheme } from '@material-ui/core/styles'

const createReactClass = require('create-react-class')

const Welcome = createReactClass({

  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'Welcome',

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const {theme} = this.props

    const styles = {
      icon: {
        height: '20vh',
        width: '80%',
        display: 'inline-block',
        marginLeft: 10,
        marginRight: 10,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url("${AssetsDir}/images/multitude.svg")`
      },
      container: {
        textAlign: 'center'
      },
      headingContainer: {
        flex: 2,
        padding: 20,
        backgroundColor: theme.palette.primary.main,
        backgroundImage: `radial-gradient(${theme.palette.primary.light}, ${theme.palette.primary.dark} 85%)`,
        backgroundSize: '100% 120%',
        color: theme.palette.primary.contrastText
      },
      heading: {
        margin: 'auto auto 0',
        padding: 20
      },
      headingTitle: {
        marginBottom: 0
      },
      headingSubtitle: {
        fontWeight: '200'
      },
      setupItemContainer: {
        padding: 40,
        flex: 1
      },
      setupItem: {
        margin: '0 auto auto'
      },
      setupItemExtended: {
        fontSize: '85%'
      }
    }
    // console.log('welcome theme', theme)
    return (
      <Grid container direction='column' style={styles.container} spacing={0}>
        <Grid item container direction='column' style={styles.headingContainer} justify='center'>
          <Grid item>
            <div style={styles.icon}/>
            <Typography variant='title' style={styles.headingSubtitle}>The open-source desktop client for
              music&nbsp;streaming</Typography>
          </Grid>
        </Grid>
        <Grid item container direction='column' style={styles.setupItemContainer} justify='flex-start'>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={() => musicboxWizardActions.openAddMusicbox()}>
              <MultitudeIcon/>&nbsp;
              Add
            </Button>
            <p style={styles.setupItemExtended}>
              Add your first streaming service
            </p>
          </Grid>
        </Grid>
      </Grid>
    )
  }
})

const themed = withTheme()(Welcome)
module.exports = themed
