'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import * as project from './lib/project'

// -------------------------------------------------------------------

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// -------------------------------------------------------------------

project.init()

// -------------------------------------------------------------------

global.mainWindow = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// -------------------------------------------------------------------

function createWindow () {
  /**
   * Initial window options
   */
  global.mainWindow = new BrowserWindow({
    width: 1140, // 1140 is xl bootstrap breakpoint
    height: 680, // 680 is min for UX
    useContentSize: true,
    webPreferences: { webSecurity: false }
  })

  global.mainWindow.loadURL(winURL)
  global.mainWindow.on('closed', () => {
    global.mainWindow = null
  })

  project.onAppStart()
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (global.mainWindow === null) {
    createWindow()
  }
})

// -------------------------------------------------------------------

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'New project..',
        accelerator: 'CmdOrCtrl+N',
        click () { project.onMenuNew() }
      },
      {
        label: 'Open project..',
        accelerator: 'CmdOrCtrl+O',
        click () { project.onMenuOpen() }
      },
      {
        label: 'Save project as..',
        accelerator: 'CmdOrCtrl+Shift+S',
        click () { project.onMenuSaveAs() }
      },
      {
        label: `Save changes`,
        accelerator: 'CmdOrCtrl+S',
        click () { project.onMenuSave() }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click () { global.mainWindow.webContents.send('vuex-undo') }
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click () { global.mainWindow.webContents.send('vuex-redo') }
      },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Git repo',
        click () { require('electron').shell.openExternal('https://github.com/fe3dback/http-debug-tools') }
      },
      {
        label: 'v.0.2 (alpha)',
        enabled: false
      }
    ]
  }
])
Menu.setApplicationMenu(menu)

// -------------------------------------------------------------------

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
