const {ipcMain, BrowserWindow} = require('electron')
const credentials = require('../shared/credentials')

const APP_REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'

class AuthDeezer {
  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor () {
    ipcMain.on('auth-deezer', (evt, body) => {
      this.handleAuthDeezer(evt, body)
    })
  }

  /* ****************************************************************************/
  // Authentication
  /* ****************************************************************************/

  /**
  * Generates the authentication url for our secrets, scopes and access type
  * @return the url that can be used to authenticate with deezer
  */
  generateAuthenticationURL () {
    return 'https:///www.deezer.com/login'
    const oauth2Client = new deezerapis.auth.OAuth2(
      credentials.GOOGLE_CLIENT_ID,
      credentials.GOOGLE_CLIENT_SECRET,
      APP_REDIRECT_URI
    )
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.deezerapis.com/auth/plus.me',
        'profile',
        'email',
        'https://www.deezerapis.com/auth/gmail.readonly'
      ]
    })
    return url
  }

  /**
  * Gets the authorization code by prompting the user to sign in
  * @param partitionId: the id of the partition
  * @return promise
  */
  promptUserToGetAuthorizationCode (partitionId) {
    return new Promise((resolve, reject) => {
      const oauthWin = new BrowserWindow({
        useContentSize: true,
        center: true,
        show: true,
        resizable: false,
        alwaysOnTop: true,
        standardWindow: true,
        autoHideMenuBar: true,
        title: 'Deezer',
        webPreferences: {
          nodeIntegration: false,
          partition: partitionId.indexOf('persist:') === 0 ? partitionId : 'persist:' + partitionId
        }
      })
      oauthWin.loadURL(this.generateAuthenticationURL())

      // Bind some events
      oauthWin.on('closed', () => {
        reject(new Error('User closed the window'))
      })
      oauthWin.on('page-title-updated', (evt) => {
        setTimeout(() => {
          const title = oauthWin.getTitle()
          if (title.startsWith('Denied')) {
            reject(new Error(title.split(/[ =]/)[2]))
            oauthWin.removeAllListeners('closed')
            oauthWin.close()
          } else if (title.startsWith('Success')) {
            resolve(title.split(/[ =]/)[2])
            oauthWin.removeAllListeners('closed')
            oauthWin.close()
          }
        })
      })
    })
  }

  /* ****************************************************************************/
  // Request Handlers
  /* ****************************************************************************/

  /**
  * Handles the oauth request
  * @param evt: the incoming event
  * @param body: the body sent to us
  */
  handleAuthDeezer (evt, body) {
    Promise.resolve()
      .then(() => this.promptUserToGetAuthorizationCode(body.id))
      .then((authCode) => {
        evt.sender.send('auth-deezer-complete', {
          id: body.id,
          type: body.type,
          mode: body.mode,
          temporaryAuth: authCode
        })
      }, (err) => {
        evt.sender.send('auth-deezer-error', {
          id: body.id,
          type: body.type,
          mode: body.mode,
          error: err,
          errorString: (err || {}).toString ? (err || {}).toString() : undefined,
          errorMessage: (err || {}).message ? (err || {}).message : undefined,
          errorStack: (err || {}).stack ? (err || {}).stack : undefined
        })
      })
  }
}

module.exports = AuthDeezer
