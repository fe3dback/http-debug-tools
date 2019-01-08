import {app, dialog, ipcMain} from 'electron'
let fs = require('fs')
let currentProjectPath = null
let stateIsModified = false

const EXT = 'hdt'
const DEFAULT_PROJECT_NAME = 'defaultProject'
const FILE_DIALOG_FILTERS = [{ name: 'Projects', extensions: [EXT] }]

export function init () {
  app.setName('http-dev-tools')
  app.setPath('userData', `${app.getPath('appData')}/${app.getName()}`)

  ipcMain.on('vuex-state-updated', (e, newState) => {
    appState = newState
    setModifyStatus(true)
  })
}

export function onAppStart () {
  setProjectPath(getProjectPathFor(DEFAULT_PROJECT_NAME))
}

export function onMenuNew () {
  if (!allowDropProjectChanges()) {
    return
  }

  setProjectPath(getProjectPathFor(DEFAULT_PROJECT_NAME))
  saveProject({})
  loadProject((data) => {
    setAppstate(data)
  })
}

export function onMenuOpen () {
  if (!allowDropProjectChanges()) {
    return
  }

  dialog.showOpenDialog(global.mainWindow, {
    title: 'Load project',
    defaultPath: getProjectsDir(),
    filters: FILE_DIALOG_FILTERS
  }, (fileName) => {
    if (typeof fileName === 'undefined') {
      return
    }

    if ((typeof fileName) === 'object') {
      fileName = fileName[0]
    }

    setProjectPath(fileName)
    loadProject((data) => {
      setAppstate(data)
    })
  })
}

export function onMenuSaveAs () {
  dialog.showSaveDialog(global.mainWindow, {
    title: 'Save project to',
    defaultPath: getProjectsDir(),
    filters: FILE_DIALOG_FILTERS
  }, (fileName) => {
    if (typeof fileName === 'undefined') {
      return
    }

    if (fileName === getProjectPathFor(DEFAULT_PROJECT_NAME)) {
      return dialog.showMessageBox(global.mainWindow, {
        type: 'error',
        message: `File path "${fileName}" is reserved for default app state file. Please save to any other file/place`
      })
    }

    setProjectPath(fileName)
    saveProject(getAppstate())
  })
}

export function onMenuSave () {
  if (getProjectPath() === getProjectPathFor(DEFAULT_PROJECT_NAME)) {
    return onMenuSaveAs()
  }

  saveProject(getAppstate())
}

let allowDropProjectChanges = function () {
  if (!stateIsModified) {
    return true
  }

  if (getProjectPath() === getProjectPathFor(DEFAULT_PROJECT_NAME)) {
    return true
  }

  let answerInd = dialog.showMessageBox(global.mainWindow, {
    type: 'question',
    title: 'Save changes?',
    message: `Project has unsaved changes, save current project first?`,
    buttons: ['Save and continue', 'Continue without saving', 'Cancel']
  })

  switch (answerInd) {
    case 0:
      onMenuSave()
      return true
    case 1:
      return true
    default:
      return false
  }
}

export function getProjectsDir () {
  return app.getPath('userData')
}

export function getProjectPathFor (projectName) {
  return `${getProjectsDir()}/${projectName}.${EXT}`
}

export function setProjectPath (path) {
  currentProjectPath = path
  syncTitle()
}

export function getProjectPath () {
  return currentProjectPath
}

let setModifyStatus = function (isModified) {
  stateIsModified = isModified
  syncTitle()
}

let syncTitle = function () {
  if (global.mainWindow) {
    global.mainWindow.setTitle(
      `${app.getName()} (${getProjectPath()}) ${stateIsModified ? '*' : ''}`
    )
  }
}

// -- State

let appState = {}
let getAppstate = function () {
  return appState
}
let setAppstate = function (newState) {
  global.mainWindow.webContents.send('vuex-state-load', newState)
}

// -- Low order functions

let saveProject = function (data) {
  fs.writeFileSync(
    getProjectPath(),
    JSON.stringify(data, null, 2),
    'utf-8'
  )

  setModifyStatus(false)
}

let loadProject = function (load) {
  fs.readFile(getProjectPath(), (err, buffer) => {
    if (err) {
      console.warn(err)
      return dialog.showMessageBox(global.mainWindow, {
        type: 'error',
        message: `Cant open project file: ${err}`
      })
    }

    if (buffer.toString() === '{}') {
      return load({})
    }

    let data = {}
    try {
      data = JSON.parse(buffer.toString())
    } catch (e) {
      console.warn(e)
      dialog.showMessageBox(global.mainWindow, {
        type: 'error',
        message: `Cant open project file: ${e}`
      })
      return
    }

    if (!(data && data.db && data.db.version === 1)) {
      console.warn('opened file has invalid structure')
      dialog.showMessageBox(global.mainWindow, {
        type: 'error',
        message: `Unknown project file format`
      })
      return
    }

    return load(data)
  })
}
