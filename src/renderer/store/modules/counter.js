const state = {
  main: 3
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  incCounter ({ commit }) { commit('INCREMENT_MAIN_COUNTER') },
  subCounter ({ commit }) { commit('DECREMENT_MAIN_COUNTER') }
}

export default {
  state,
  mutations,
  actions
}
