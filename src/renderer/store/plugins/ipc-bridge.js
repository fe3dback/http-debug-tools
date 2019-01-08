import { ipcRenderer } from 'electron'

const UI_MUTATIONS = [
  'REQUEST_SET_ACTIVE',
  'REQUEST_DESELECT',
  'ENV_SET_ACTIVE',
  'ENV_DESELECT'
]

export default (exporter, importer) => {
  return (store) => {
    // import
    ipcRenderer.on('vuex-state-load', (e, state) => {
      importer(store, state)
    })

    // initial
    ipcRenderer.send('vuex-state-updated', exporter())

    // update
    store.subscribe((mutation) => {
      if (UI_MUTATIONS.indexOf(mutation.type) === -1) {
        ipcRenderer.send('vuex-state-updated', exporter())
      }
    })
  }
}
