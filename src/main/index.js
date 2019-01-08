'use strict'

import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
let fs = require('fs')
app.setName('http-dev-tools')
app.setPath('userData', `${app.getPath('appData')}/${app.getName()}`)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * State control
 */
global.vuexState = null
global.currentProjectPath = null
ipcMain.on('vuex-state-updated', (e, state) => {
  global.vuexState = state
})

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1140, // 1140 is xl bootstrap breakpoint
    height: 680, // 680 is min for UX
    useContentSize: true,
    webPreferences: { webSecurity: false }
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  setProjectFilePath(defProjectPath)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const projectExt = 'hdt'
const defProjectPath = `${app.getPath('desktop')}/defaultProject.${projectExt}`
const dialogFilter = [{ name: 'Projects', extensions: [projectExt] }]

let setProjectFilePath = function (path) {
  global.currentProjectPath = path
  if (mainWindow) {
    mainWindow.setTitle(`${app.getName()} (${path})`)
  }
}

let loadProjectState = function () {
  fs.readFile(global.currentProjectPath, (err, buffer) => {
    if (err) {
      return dialog.showMessageBox(mainWindow, {
        type: 'error',
        message: `Cant open project file: ${err}`
      })
    }

    let data = {}
    try {
      data = JSON.parse(buffer)
    } catch (e) {
      return dialog.showMessageBox(mainWindow, {
        type: 'error',
        message: `Cant open project file: ${e}`
      })
    }

    if (!(data && data.db && data.db.version === 1)) {
      return dialog.showMessageBox(mainWindow, {
        type: 'error',
        message: `Unknown project file format`
      })
    }

    mainWindow.webContents.send('vuex-state-load', data)
  })
}

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'New project..',
        click () {
          console.log('new project')
          setProjectFilePath(defProjectPath)
          // todo save default state to project file
        }
      },
      {
        label: 'Open project..',
        click () {
          dialog.showOpenDialog(mainWindow, {
            title: 'Load project',
            defaultPath: defProjectPath,
            filters: dialogFilter
          }, (fileName) => {
            if (typeof fileName === 'undefined') {
              console.log('load is canceled')
              return
            }

            if ((typeof fileName) === 'object') {
              fileName = fileName[0]
            }

            console.log('load project', fileName)
            setProjectFilePath(fileName)
            loadProjectState()
          })
        }
      },
      {
        label: 'Save project as..',
        click () {
          console.log('save project')
          dialog.showSaveDialog(mainWindow, {
            title: 'Save project to',
            defaultPath: defProjectPath,
            filters: dialogFilter
          }, (fileName) => {
            if (typeof fileName === 'undefined') {
              console.log('save is canceled')
              return
            }

            fs.writeFileSync(fileName, JSON.stringify(global.vuexState, null, 2), 'utf-8')
            setProjectFilePath(fileName)
          })
        }
      },
      {
        label: `Save changes`,
        click () {
          if (!global.currentProjectPath) {
            dialog.showMessageBox(mainWindow, {
              type: 'warning',
              message: 'Cant save, no project file is opened. Please use "File -> Save project as.." first'
            })
            return
          }
          console.log('save project to', global.currentProjectPath)

          let fs = require('fs')
          fs.writeFileSync(global.currentProjectPath, JSON.stringify(global.vuexState, null, 2), 'utf-8')
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click () { mainWindow.webContents.send('vuex-undo') }
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click () { mainWindow.webContents.send('vuex-redo') }
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
      }
    ]
  }
])
Menu.setApplicationMenu(menu)

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
