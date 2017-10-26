module.exports = Object.freeze({
  APP_ID: 'tombeverley.wmail',

  MUSICBOX_INDEX_KEY: '__mindex__',
  MUSICBOX_ACTIVE_KEY: '__mactive__',
  MAILBOX_INDEX_KEY: '__index__',
  MAILBOX_SLEEP_WAIT: 1000 * 30, // 30 seconds

  WEB_URL: 'https://thomas101.github.io/wmail/',
  GITHUB_URL: 'https://github.com/Thomas101/wmail/',
  GITHUB_ISSUE_URL: 'https://github.com/Thomas101/wmail/issues',
  UPDATE_DOWNLOAD_URL: 'http://thomas101.github.io/wmail/download',
  UPDATE_CHECK_URL: 'https://thomas101.github.io/wmail/version.json',
  PRIVACY_URL: 'https://thomas101.github.io/wmail/privacy',
  USER_SCRIPTS_WEB_URL: 'https://github.com/Thomas101/wmail-user-scripts',
  UPDATE_CHECK_INTERVAL: 1000 * 60 * 60 * 24, // 24 hours

  GMAIL_PROFILE_SYNC_MS: 1000 * 60 * 60, // 60 mins
  GMAIL_UNREAD_SYNC_MS: 1000 * 60, // 60 seconds
  GMAIL_NOTIFICATION_MAX_MESSAGE_AGE_MS: 1000 * 60 * 60 * 2, // 2 hours
  GMAIL_NOTIFICATION_FIRST_RUN_GRACE_MS: 1000 * 30, // 30 seconds
  TRACK_NOTIFICATION_FIRST_RUN_GRACE_MS: 1000 * 5, // 5 seconds

  REFOCUS_MUSICBOX_INTERVAL_MS: 300,

  DB_EXTENSION: 'wmaildb',
  DB_WRITE_DELAY_MS: 500, // 0.5secs

  // send to musicbox
  MUSICBOX_WINDOW_INIT: 'musicbox-window-init',
  MUSICBOX_WINDOW_PLAY: 'musicbox-window-play',
  MUSICBOX_WINDOW_PAUSE: 'musicbox-window-pause',
  MUSICBOX_WINDOW_PLAY_PAUSE: 'musicbox-window-play-pause',
  MUSICBOX_WINDOW_FADE_TO: 'musicbox-window-fade-to',
  MUSICBOX_WINDOW_NEXT_TRACK: 'musicbox-window-next-track',
  MUSICBOX_WINDOW_PREVIOUS_TRACK: 'musicbox-window-previous-track',
  // receive from musicbox
  MUSICBOX_WINDOW_INIT_REQUEST: 'musicbox-window-init-request',
  MUSICBOX_WINDOW_PLAYING: 'musicbox-window-playing',
  MUSICBOX_WINDOW_TRACK_CHANGED: 'musicbox-window-track-changed',
  MUSICBOX_WINDOW_TRACKLIST_CHANGED: 'musicbox-window-tracklist-changed',
  MUSICBOX_WINDOW_PAGE_CHANGED: 'musicbox-window-page-changed',
  MUSICBOX_WINDOW_USERNAME: 'musicbox-window-username',
  MUSICBOX_WINDOW_TIME_UPDATED: 'musicbox-window-time-updated'
})
