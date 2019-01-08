/**
 * This static file, only for save/load check
 */

const state = {
  version: 1,
  application: 'http-debug-tools'
}

export function exportState () {
  return {
    version: state.version,
    application: state.application
  }
}

const mutations = {}
const actions = {}

export default {
  state,
  mutations,
  actions
}
