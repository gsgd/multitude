const React = require('react')
const {
  Stepper, Step, StepLabel, StepContent, Button,
  NativeSelect, FormHelperText, LinearProgress
} = require('@material-ui/core')
const dictionariesStore = require('../../stores/dictionaries/dictionariesStore')
const dictionariesActions = require('../../stores/dictionaries/dictionariesActions')
const {
  remote: {shell}
} = require('electron')

const STEPS = {
  PICK: 0,
  LICENSE: 1,
  DOWNLOAD: 2,
  FINISH: 3
}
const createReactClass = require('create-react-class')

const DictionaryInstallStepper = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'DictionaryInstallStepper',

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    dictionariesStore.listen(this.dictionariesChanged)
  },

  componentWillUnmount () {
    dictionariesStore.unlisten(this.dictionariesChanged)
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    const store = dictionariesStore.getState()
    return {
      stepIndex: STEPS.PICK,
      installLanguage: store.installLanguage(),
      installLanguageInfo: null,
      installId: store.installId(),
      installInflight: store.installInflight(),
      uninstallDictionaries: store.sortedUninstalledDictionaryInfos()
    }
  },

  dictionariesChanged (store) {
    if (store.installId() !== this.state.installId) {
      this.setState(this.getInitialState())
    } else {
      if (!this.state.installLanguage && store.installLanguage()) {
        this.setState({
          installLanguage: store.installLanguage(),
          installLanguageInfo: store.getDictionaryInfo(store.installLanguage()),
          stepIndex: STEPS.LICENSE
        })
      } else if (!this.state.installInflight && store.installInflight()) {
        this.setState({
          installInflight: store.installInflight(),
          stepIndex: STEPS.DOWNLOAD
        })
      } else if (this.state.installInflight && !store.installInflight()) {
        this.setState({
          installInflight: store.installInflight(),
          stepIndex: STEPS.FINISH
        })
      }
    }
  },

  /* **************************************************************************/
  // UI Events
  /* **************************************************************************/

  /**
  * Progress the user when they pick their language
  */
  handlePickLanguage (evt, index, value) {
    if (value !== null) {
      dictionariesActions.pickDictionaryInstallLanguage(this.state.installId, value)
    }
  },

  /**
  * Handles the user agreeing to the license
  */
  handleAgreeLicense () {
    dictionariesActions.installDictionary(this.state.installId)
  },

  /**
  * Handles cancelling the install
  */
  handleCancel () {
    dictionariesActions.stopDictionaryInstall()
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  render () {
    const { stepIndex, installLanguageInfo, uninstallDictionaries } = this.state

    return (
      <Stepper activeStep={stepIndex} orientation='vertical'>
        <Step>
          <StepLabel>Pick Language</StepLabel>
          <StepContent>
            <NativeSelect
              fullWidth
              onChange={this.handlePickLanguage}>
              {[null].concat(uninstallDictionaries).map((info) => {
                if (info === null) {
                  return (<option key='null' value={null} >''</option>)
                } else {
                  return (<option key={info.lang} value={info.lang} >{info.name}</option>)
                }
              })}
            </NativeSelect>
            <FormHelperText>Pick the dictionary to install</FormHelperText>
            <Button variant='flat'
              disableTouchRipple
              disableFocusRipple
              onClick={this.handleCancel}>
              Cancel
            </Button>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Licensing</StepLabel>
          <StepContent>
            <p>
              <span>Check you're happy with the </span>
              <a href={(installLanguageInfo || {}).license} onClick={(evt) => { evt.preventDefault(); shell.openExternal(installLanguageInfo.license) }}>license</a>
              <span> of the <strong>{(installLanguageInfo || {}).name}</strong> dictionary</span>
            </p>
            <Button variant='raised'
              disableTouchRipple
              disableFocusRipple
              color='primary'
              onClick={this.handleAgreeLicense}
              style={{marginRight: 12}}>
              Next
            </Button>
            <Button variant='flat'
              disableTouchRipple
              disableFocusRipple
              onClick={this.handleCancel}>
              Cancel
            </Button>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Download</StepLabel>
          <StepContent>
            <p>Downloading <strong>{(installLanguageInfo || {}).name}</strong></p>
            <LinearProgress mode='indeterminate' />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Finish</StepLabel>
          <StepContent>
            <p>
              <span>The </span>
              <strong>{(installLanguageInfo || {}).name}</strong>
              <span> dictionary has been downloaded and installed.</span>
            </p>
            <Button variant='raised'
              disableTouchRipple
              disableFocusRipple
              color='primary'
              onClick={this.handleCancel}>
              Done
            </Button>
          </StepContent>
        </Step>
      </Stepper>
    )
  }
})
module.exports = DictionaryInstallStepper
