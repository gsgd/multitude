const React = require('react')
const PropTypes = require('prop-types')
import { Switch, FormControlLabel, Paper, NativeSelect, FormHelperText, Button, Icon } from '@material-ui/core'
const flux = {
  settings: require('../../../stores/settings'),
  dictionaries: require('../../../stores/dictionaries')
}
const styles = require('../settingStyles')
const shallowCompare = require('react-addons-shallow-compare')
const createReactClass = require('create-react-class')

const LanguageSettingsSection = createReactClass({
  /* **************************************************************************/
  // Class
  /* **************************************************************************/

  displayName: 'LanguageSettingsSection',
  propTypes: {
    language: PropTypes.object.isRequired,
    showRestart: PropTypes.func.isRequired
  },

  /* **************************************************************************/
  // Component Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    flux.dictionaries.S.listen(this.dictionariesChanged)
  },

  componentWillUnmount () {
    flux.dictionaries.S.unlisten(this.dictionariesChanged)
  },

  /* **************************************************************************/
  // Data Lifecycle
  /* **************************************************************************/

  getInitialState () {
    return {
      installedDictionaries: flux.dictionaries.S.getState().sortedInstalledDictionaryInfos()
    }
  },

  dictionariesChanged (store) {
    this.setState({
      installedDictionaries: flux.dictionaries.S.getState().sortedInstalledDictionaryInfos()
    })
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  },

  render () {
    const {language, showRestart, ...passProps} = this.props
    const { installedDictionaries } = this.state
    const dictionaryState = flux.dictionaries.S.getState()
    const primaryDictionaryInfo = dictionaryState.getDictionaryInfo(language.spellcheckerLanguage)

    return (
      <Paper elevation={1} style={styles.paper} {...passProps}>
        <h1 style={styles.subheading}>Language</h1>
        <FormControlLabel
          control={<Switch />}
          checked={language.spellcheckerEnabled}
          label='Spell-checker (Requires Restart)'
          onChange={(evt, toggled) => {
            showRestart()
            flux.settings.A.setEnableSpellchecker(toggled)
          }} />
        <NativeSelect
          value={language.spellcheckerLanguage}
          fullWidth
          onChange={(evt, index, value) => { flux.settings.A.setSpellcheckerLanguage(value) }}>
          {installedDictionaries.map((info) => {
            return (<option key={info.lang} value={info.lang} >{info.name}</option>)
          })}
        </NativeSelect>
        <FormHelperText>Spell-checker language</FormHelperText>
        <NativeSelect
          value={language.secondarySpellcheckerLanguage !== null ? language.secondarySpellcheckerLanguage : '__none__'}
          fullWidth
          onChange={(evt, index, value) => {
            flux.settings.A.setSecondarySpellcheckerLanguage(value !== '__none__' ? value : null)
          }}>
          {[undefined].concat(installedDictionaries).map((info) => {
            if (info === undefined) {
              return (<option key='__none__' value='__none__'>None</option>)
            } else {
              const disabled = primaryDictionaryInfo.charset !== info.charset
              return (<option key={info.lang} value={info.lang} >{info.name} disabled={disabled}</option>)
            }
          })}
        </NativeSelect>
        <FormHelperText>Secondary Spell-checker language</FormHelperText>
        <Button variant='raised'
          icon={<Icon className='material-icons'>language</Icon>}
          onClick={() => { flux.dictionaries.A.startDictionaryInstall() }}>
          Install more Dictionaries
        </Button>
      </Paper>
    )
  }
})
module.exports = LanguageSettingsSection
