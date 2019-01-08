import Environment, {clone} from '../models/environment'

let applyFor = function (id, cb) {
  state.list.map(function (env) {
    if (env.id === id) {
      cb(env)
    }
  })
}

const state = {
  activeId: null,
  list: [
    new Environment('Production'),
    new Environment('Local')
  ]
}

const mutations = {
  ENV_CREATE (state) {
    let newEnv = new Environment('My new env')
    state.list.push(newEnv)
    mutations.ENV_SET_ACTIVE(state, newEnv.id)
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
  },

  ENV_CLONE_ACTIVE (state) {
    if (!state.activeId) {
      return
    }

    applyFor(state.activeId, (env) => {
      let newEnv = clone(env)
      state.list.push(newEnv)
      mutations.ENV_SET_ACTIVE(state, newEnv.id)
    })
  },

  ENV_UPDATE_VARIABLES (state, {id, vars}) {
    applyFor(id, (env) => {
      env.data = vars
    })
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
  },
  envCloneActive ({ commit }) {
    commit('ENV_CLONE_ACTIVE')
  },
  envUpdateVariables ({ commit }, {id, vars}) {
    commit('ENV_UPDATE_VARIABLES', {id, vars})
  }
}

export default {
  state,
  mutations,
  actions
}
