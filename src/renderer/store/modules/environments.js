import Environment from '../models/environment'

const state = {
  activeId: null,
  list: [
    new Environment('Production'),
    new Environment('Local')
  ]
}

const mutations = {
  ENV_CREATE (state) {
    state.list.push(
      new Environment('My new env')
    )
  },

  ENV_SET_ACTIVE (state, id) {
    state.activeId = id
  },

  ENV_DESELECT (state) {
    state.activeId = null
  },

  ENV_DELETE_ACTIVE (state) {
    state.list = state.list.filter(function (env) {
      return env.id !== state.activeId
    })
    mutations.ENV_DESELECT(state)
  }
}

const actions = {
  envCreate ({ commit }) { commit('ENV_CREATE') },
  envSetActive ({ commit }, id) { commit('ENV_SET_ACTIVE', id) },
  envDeleteActive ({ commit }) {
    if (!confirm('Delete this environment? You are sure?')) {
      return
    }

    commit('ENV_DELETE_ACTIVE')
  }
}

export default {
  state,
  mutations,
  actions
}
