import Environment, {clone, serialize, unserialize, getComputedVariables} from '../models/environment'

let applyFor = function (id, cb) {
  state.list.map(function (env) {
    if (env.id === id) {
      cb(env)
    }
  })
}

const state = {
  activeId: null,
  list: []
}

const getters = {
  activeEnv: (state) => {
    return state.list.find((env) => {
      return env.id === state.activeId
    })
  },

  currentEnvVars: (state, getters) => {
    if (!getters.activeEnv) {
      return {}
    }

    return getComputedVariables(getters.activeEnv)
  },

  currentEnvVarsIsEmpty: (state, getters) => {
    if (Object.getOwnPropertyNames(getters.currentEnvVars).length <= 0) {
      return true
    }

    for (let key in getters.currentEnvVars) {
      if (getters.currentEnvVars.hasOwnProperty(key)) {
        return false
      }
    }

    return true
  }
}

export function exportState () {
  return {
    list: state.list.map((env) => {
      return serialize(env)
    })
  }
}

export function importState (store, moduleState) {
  store.dispatch('envClear')

  if (moduleState.list) {
    moduleState.list.forEach((serializedEnv) => {
      let env = unserialize(serializedEnv)
      store.dispatch('envAdd', env)
    })
  }
}

const mutations = {
  ENV_CLEAR (state) {
    state.activeId = null
    state.list = []
  },

  ENV_CREATE (state) {
    let newEnv = new Environment('My new env')
    state.list.push(newEnv)
    mutations.ENV_SET_ACTIVE(state, newEnv.id)
  },

  ENV_ADD (state, env) {
    state.list.push(env)
    mutations.ENV_SET_ACTIVE(state, env.id)
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
  envClear ({ commit }) { commit('ENV_CLEAR') },
  envCreate ({ commit }) { commit('ENV_CREATE') },
  envAdd ({ commit }, env) { commit('ENV_ADD', env) },
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
  getters,
  mutations,
  actions
}
