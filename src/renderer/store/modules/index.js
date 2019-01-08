/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.js$/)
const modules = {}
const exporters = {}
const importers = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  let moduleName = key.replace(/(\.\/|\.js)/g, '')
  modules[moduleName] = files(key).default
  exporters[moduleName] = files(key).exportState
  importers[moduleName] = files(key).importState
})

export function exportState () {
  let state = {}
  for (let key in exporters) {
    if (exporters.hasOwnProperty(key)) {
      let exporter = exporters[key]
      if ((typeof exporter) === 'function') {
        state[key] = exporter()
      }
    }
  }
  return state
}

export function importState (store, state) {
  for (let moduleName in importers) {
    if (importers.hasOwnProperty(moduleName)) {
      let importer = importers[moduleName]
      if ((typeof importer) === 'function') {
        let moduleState = state[moduleName] || {}
        importer(store, moduleState)
      }
    }
  }
}

export default modules
