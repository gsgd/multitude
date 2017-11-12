const React = require('react')
const ReactDOM = require('react-dom')
const { AppContainer } = require('react-hot-loader')

const musicboxStore = require('./stores/musicbox')
const settingsStore = require('./stores/settings')
const composeStore = require('./stores/compose')
const musicboxWizardStore = require('./stores/musicboxWizard')
const { ipcRenderer } = require('electron')

const injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin()

// See if we're offline and run a re-direct
if (window.navigator.onLine === false) {
  window.location.href = 'offline.html'
}

// Load what we have in the db
musicboxStore.musicboxActions.load()
musicboxWizardStore.musicboxWizardActions.load()
settingsStore.settingsActions.load()
composeStore.composeActions.load()

// Remove loading
const loading = document.getElementById('loading')
if (loading) {
  loading.parentElement.removeChild(loading)
}

const render = () => {
  const App = require('./ui/App')
// Render and prepare for unrender
  //   ReactDOM.render(<App/>, document.getElementById('app'))
  ReactDOM.render(<AppContainer><App/></AppContainer>, document.getElementById('app'))
  ipcRenderer.on('prepare-reload', function () {
    ReactDOM.unmountComponentAtNode(document.getElementById('app'))
  })
  ipcRenderer.send('mailboxes-js-loaded', {})
}

render()

console.log('module.hot', module.hot)
if (module.hot) {
  module.hot.accept(render)
}