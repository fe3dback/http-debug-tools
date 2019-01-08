import { ipcRenderer } from 'electron'

export default store => {
  ipcRenderer.on('vuex-state-load', (e, state) => {
    console.log(state)
  })

  ipcRenderer.send('vuex-state-updated', store.state)

  store.subscribe((mutation, state) => {
    ipcRenderer.send('vuex-state-updated', state)
  })
}
