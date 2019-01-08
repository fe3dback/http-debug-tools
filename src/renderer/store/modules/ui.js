const UI_MODE_DEFAULT = 'default'
const UI_MODE_REQUEST = 'request'
const UI_MODE_ENV = 'env'

const UI_MODE_LIST = [
  UI_MODE_DEFAULT,
  UI_MODE_REQUEST,
  UI_MODE_ENV
]

const state = {
  mode: UI_MODE_DEFAULT
}

const mutations = {
  UI_SET_MODE (state, mode) {
    state.mode = mode
  }
}

const actions = {
  uiSetMode ({ commit }, mode) {
    if (UI_MODE_LIST.indexOf(mode) === -1) {
      console.error(`Unknown UI mode ${mode}`)
      return
    }

    commit('UI_SET_MODE', mode)
  }
}

export default {
  state,
  mutations,
  actions
}
