;(function () {
  const {ipcMain, dialog, app, shell} = require('electron')

  let windowManager
  const quitting = app.makeSingleInstance(function (commandLine, workingDirectory) {
    const argv = require('yargs').parse(commandLine)
    if (windowManager) {
      if (argv.hidden || argv.hide) {
        windowManager.musicboxesWindow.hide()
      } else {
        if (argv.mailto) {
          windowManager.musicboxesWindow.openMailtoLink(argv.mailto)
        }
        const index = argv._.findIndex((a) => a.indexOf('mailto') === 0)
        if (index !== -1) {
          windowManager.musicboxesWindow.openMailtoLink(argv._[index])
          argv._.splice(1)
        }
        windowManager.musicboxesWindow.show()
        windowManager.musicboxesWindow.focus()
      }
    }
    return true
  })
  if (quitting) {
    app.quit()
    return
  }

  const argv = require('yargs').parse(process.argv)
  const AppAnalytics = require('./AppAnalytics')
  const MusicboxesWindow = require('./windows/MusicboxesWindow')
  const ContentWindow = require('./windows/ContentWindow')
  const pkg = require('../package.json')
  const AppPrimaryMenu = require('./AppPrimaryMenu')
  const KeyboardShortcuts = require('./KeyboardShortcuts')
  const WindowManager = require('./windows/WindowManager')
  const constants = require('shared/constants')
  const storage = require('./storage')
  const settingStore = require('./stores/settingStore')

  Object.keys(storage).forEach((k) => storage[k].checkAwake())

  /* ****************************************************************************/
  // Commandline switches & launch args
  /* ****************************************************************************/

  if (settingStore.app.ignoreGPUBlacklist) {
    app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true')
  }
  if (settingStore.app.disableSmoothScrolling) {
    app.commandLine.appendSwitch('disable-smooth-scrolling', 'true')
  }
  if (!settingStore.app.enableUseZoomForDSF) {
    app.commandLine.appendSwitch('enable-use-zoom-for-dsf', 'false')
  }

  app.commandLine.appendSwitch('ppapi-flash-path', '/Users/george/Library/Application Support/Google/Chrome/PepperFlash/27.0.0.170/PepperFlashPlayer.plugin')
  app.commandLine.appendSwitch('ppapi-flash-version', '27.0.0.170')

// You have to pass the filename of `widevinecdmadapter` here, it is
// * `widevinecdmadapter.plugin` on macOS,
// * `libwidevinecdmadapter.so` on Linux,
// * `widevinecdmadapter.dll` on Windows.
  app.commandLine.appendSwitch('widevine-cdm-path', '/Users/george/Library/Application Support/CEF/User Data/WidevineCDM/1.4.8.866/_platform_specific/mac_x64//widevinecdmadapter.plugin')
// The version of plugin can be got from `chrome://plugins` page in Chrome.
  app.commandLine.appendSwitch('widevine-cdm-version', '1.4.8.866')

  const openHidden = (function () {
    if (settingStore.ui.openHidden) { return true }
    if (process.platform === 'darwin' && app.getLoginItemSettings().wasOpenedAsHidden) { return true }
    return (argv.hidden || argv.hide)
  })()

  /* ****************************************************************************/
  // Global objects
  /* ****************************************************************************/

  const analytics = new AppAnalytics()
  const musicboxesWindow = new MusicboxesWindow(analytics)
  windowManager = new WindowManager(musicboxesWindow)
  const selectors = {
    fullQuit: () => {
      windowManager.quit()
    },
    closeWindow: () => {
      const focused = windowManager.focused()
      focused ? focused.close() : undefined
    },
    showWindow: () => {
      windowManager.musicboxesWindow.show()
      windowManager.musicboxesWindow.focus()
    },
    fullscreenToggle: () => {
      const focused = windowManager.focused()
      focused ? focused.toggleFullscreen() : undefined
    },
    sidebarToggle: () => {
      windowManager.musicboxesWindow.toggleSidebar()
    },
    menuToggle: () => {
      windowManager.musicboxesWindow.toggleAppMenu()
    },
    preferences: () => {
      windowManager.musicboxesWindow.launchPreferences()
    },
    reload: () => {
      const focused = windowManager.focused()
      focused ? focused.reload() : undefined
    },
    devTools: () => {
      const focused = windowManager.focused()
      focused ? focused.toggleDevTools() : undefined
    },
    embeddedDevTools: (musicboxId) => {
      windowManager.musicboxesWindow.toggleEmbeddedDevTools(musicboxId)
    },
    learnMoreGithub: () => { shell.openExternal(constants.GITHUB_URL) },
    learnMore: () => { shell.openExternal(constants.WEB_URL) },
    privacy: () => { shell.openExternal(constants.PRIVACY_URL) },
    bugReport: () => { shell.openExternal(constants.GITHUB_ISSUE_URL) },
    zoomIn: () => { windowManager.musicboxesWindow.musicboxZoomIn() },
    zoomOut: () => { windowManager.musicboxesWindow.musicboxZoomOut() },
    zoomReset: () => { windowManager.musicboxesWindow.musicboxZoomReset() },
    changeMusicbox: (musicboxId) => {
      windowManager.musicboxesWindow.show()
      windowManager.musicboxesWindow.focus()
      windowManager.musicboxesWindow.switchMusicbox(musicboxId)
    },
    prevMusicbox: () => {
      windowManager.musicboxesWindow.show()
      windowManager.musicboxesWindow.focus()
      windowManager.musicboxesWindow.switchPrevMusicbox()
    },
    nextMusicbox: () => {
      windowManager.musicboxesWindow.show()
      windowManager.musicboxesWindow.focus()
      windowManager.musicboxesWindow.switchNextMusicbox()
    },
    cycleWindows: () => { windowManager.focusNextWindow() },
    aboutDialog: () => {
      dialog.showMessageBox({
        title: pkg.name,
        message: pkg.name,
        detail: [
          'Version: ' + pkg.version + (pkg.prerelease ? ' prerelease' : ''),
          'Made with ♥ by GSGD.',
          'Built on work by Thomas Beverley.'
        ].join('\n'),
        buttons: [ 'Done', 'Website' ]
      }, (index) => {
        if (index === 1) {
          shell.openExternal(constants.GITHUB_URL)
        }
      })
    },
    find: () => { windowManager.musicboxesWindow.findStart() },
    findNext: () => { windowManager.musicboxesWindow.findNext() },
    musicboxNavBack: () => { windowManager.musicboxesWindow.navigateMusicboxBack() },
    musicboxNavForward: () => { windowManager.musicboxesWindow.navigateMusicboxForward() },
    playPause: () => { windowManager.musicboxesWindow.playPause() },
    nextTrack: () => { windowManager.musicboxesWindow.nextTrack() },
    previousTrack: () => { windowManager.musicboxesWindow.previousTrack() }
  }
  const appMenu = new AppPrimaryMenu(selectors)
  const keyboardShortcuts = new KeyboardShortcuts(selectors)

  /* ****************************************************************************/
  // IPC Events
  /* ****************************************************************************/

  ipcMain.on('report-error', (evt, body) => {
    analytics.appException(windowManager.musicboxesWindow.window, 'renderer', body.error)
  })

  ipcMain.on('new-window', (evt, body) => {
    const musicboxesWindow = windowManager.musicboxesWindow
    const copyPosition = !musicboxesWindow.window.isFullScreen() && !musicboxesWindow.window.isMaximized()
    const windowOptions = copyPosition ? (() => {
      const position = musicboxesWindow.window.getPosition()
      const size = musicboxesWindow.window.getSize()
      return {
        x: position[0] + 20,
        y: position[1] + 20,
        width: size[0],
        height: size[1]
      }
    })() : undefined
    const window = new ContentWindow(analytics)
    windowManager.addContentWindow(window)
    window.start(body.url, body.partition, windowOptions)
  })

  ipcMain.on('focus-app', (evt, body) => {
    windowManager.focusMusicboxesWindow()
  })

  ipcMain.on('toggle-musicbox-visibility-from-tray', (evt, body) => {
    windowManager.toggleMusicboxWindowVisibilityFromTray()
  })

  ipcMain.on('quit-app', (evt, body) => {
    windowManager.quit()
  })

  ipcMain.on('relaunch-app', (evt, body) => {
    app.relaunch()
    windowManager.quit()
  })

  ipcMain.on('prepare-webview-session', (evt, data) => {
    musicboxesWindow.sessionManager.startManagingSession(data.partition)
  })

  ipcMain.on('musicboxes-js-loaded', (evt, data) => {
    if (argv.mailto) {
      windowManager.musicboxesWindow.openMailtoLink(argv.mailto)
      delete argv.mailto
    } else {
      const index = argv._.findIndex((a) => a.indexOf('mailto') === 0)
      if (index !== -1) {
        windowManager.musicboxesWindow.openMailtoLink(argv._[index])
        argv._.splice(1)
      }
    }
  })

  /* ****************************************************************************/
  // App Events
  /* ****************************************************************************/

  app.on('ready', () => {
    appMenu.updateApplicationMenu()
    windowManager.musicboxesWindow.start(openHidden)
    keyboardShortcuts.registerGlobal()
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    windowManager.musicboxesWindow.show()
  })

  // Keyboard shortcuts in Electron need to be registered and unregistered
  // on focus/blur respectively due to the global nature of keyboard shortcuts.
  // See  https://github.com/electron/electron/issues/1334
  app.on('browser-window-focus', () => {
    keyboardShortcuts.register()
  })
  app.on('browser-window-blur', () => {
    keyboardShortcuts.unregister()
  })

  app.on('before-quit', () => {
    keyboardShortcuts.unregister()
    keyboardShortcuts.unregisterGlobal()
    windowManager.musicboxesWindow.stopAll()
    windowManager.forceQuit = true
  })

  app.on('open-url', (evt, url) => { // osx only
    evt.preventDefault()
    windowManager.musicboxesWindow.openMailtoLink(url)
  })

  /* ****************************************************************************/
  // Exceptions
  /* ****************************************************************************/

  // Send crash reports
  process.on('uncaughtException', (err) => {
    analytics.appException(windowManager.musicboxesWindow.window, 'main', err)
    console.error(err)
    console.error(err.stack)
  })
})()
