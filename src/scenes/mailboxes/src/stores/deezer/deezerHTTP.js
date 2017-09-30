const deezer = window.appNodeModulesRequire('deezerapis')
const gPlus = deezer.plus('v1')
const gmail = deezer.gmail('v1')
const OAuth2 = deezer.auth.OAuth2
const DeezerHTTPTransporter = require('./DeezerHTTPTransporter')
const querystring = require('querystring')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('shared/credentials')

class DeezerHTTP {

  /* **************************************************************************/
  // Utils
  /* **************************************************************************/

  /**
  * Rejects a call because the musicbox has no authentication info
  * @param info: any information we have
  * @return promise - rejected
  */
  rejectWithNoAuth (info) {
    return Promise.reject({
      info: info,
      err: 'Local - Musicbox missing authentication information'
    })
  }

  /* **************************************************************************/
  // Auth
  /* **************************************************************************/

  /**
  * Generates the auth token object to use with Deezer
  * @param accessToken: the access token from the musicbox
  * @param refreshToken: the refresh token from the musicbox
  * @param expiryTime: the expiry time from the musicbox
  * @return the deezer auth object
  */
  generateAuth (accessToken, refreshToken, expiryTime) {
    const auth = new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: expiryTime
    })
    auth.transporter = new DeezerHTTPTransporter()
    return auth
  }

  /**
  * Upgrades the initial temporary access code to a permenant access code
  * @param authCode: the temporary auth code
  * @return promise
  */
  upgradeAuthCodeToPermenant (authCode) {
    return Promise.resolve()
      .then(() => window.fetch('https://accounts.deezer.com/o/oauth2/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
          code: authCode,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
        })
      }))
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => res.json())
  }

  /* **************************************************************************/
  // Fetch Profile
  /* **************************************************************************/

  /**
  * Syncs a profile for a musicbox
  * @param auth: the auth to access deezer with
  * @return promise
  */
  fetchMusicboxProfile (auth) {
    if (!auth) { return this.rejectWithNoAuth() }

    return new Promise((resolve, reject) => {
      gPlus.people.get({
        userId: 'me',
        auth: auth
      }, (err, response) => {
        if (err) {
          reject({ err: err })
        } else {
          resolve({ response: response })
        }
      })
    })
  }

  /* **************************************************************************/
  // Label
  /* **************************************************************************/

  /**
  * Syncs the label for a musicbox. The label is a cheap call which can be used
  * to decide if the musicbox has changed
  * @param auth: the auth to access deezer with
  * @param labelId: the id of the label to sync
  * @return promise
  */
  fetchMusicboxLabel (auth, labelId) {
    if (!auth) { return this.rejectWithNoAuth() }

    return new Promise((resolve, reject) => {
      gmail.users.labels.get({
        userId: 'me',
        id: labelId,
        auth: auth
      }, (err, response) => {
        if (err) {
          reject({ err: err })
        } else {
          resolve({ response: response })
        }
      })
    })
  }

  /* **************************************************************************/
  // Fetch Emails and messages
  /* **************************************************************************/

  /**
  * Fetches the unread summaries for a musicbox
  * @param auth: the auth to access deezer with
  * @param query: the query to ask the server for
  * @param limit=10: the limit on results to fetch
  * @return promise
  */
  fetchThreadIds (auth, query, limit = 25) {
    if (!auth) { return this.rejectWithNoAuth() }

    return new Promise((resolve, reject) => {
      gmail.users.threads.list({
        userId: 'me',
        q: query,
        maxResults: limit,
        auth: auth
      }, (err, response) => {
        if (err) {
          reject({ err: err })
        } else {
          resolve({ response: response })
        }
      })
    })
  }

  /**
  * Fetches an email from a given id
  * @param auth: the auth to access deezer with
  * @param threadId: the id of the thread
  * @return promise
  */
  fetchThread (auth, threadId) {
    if (!auth) { return this.rejectWithNoAuth() }

    return new Promise((resolve, reject) => {
      gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        auth: auth
      }, (err, response) => {
        if (err) {
          reject({ err: err })
        } else {
          resolve({ response: response })
        }
      })
    })
  }
}

module.exports = new DeezerHTTP()
