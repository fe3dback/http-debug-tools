import Request, {serialize, unserialize, clone} from '../models/request'
import {parse} from '../models/environment'
import store from '../index'
const UrlParser = require('url-parse')

let applyFor = function (id, cb) {
  state.list.map(function (r) {
    if (r.id === id) {
      cb(r)
    }
  })
}

let applyForRequestWhenResponseIdIs = function (id, cb) {
  state.list.map(function (r) {
    if (r.lastResponseId === id) {
      cb(r)
    }
  })
}

let applyForResponse = function (id, cb) {
  state.responses.map(function (r) {
    if (r.id === id) {
      cb(r)
    }
  })
}

const state = {
  activeId: null,
  list: [],
  responses: []
}

const getters = {
  activeRequest: (state) => {
    return state.list.find((req) => {
      return req.id === state.activeId
    })
  }
}

export function exportState () {
  return {
    list: state.list.map((req) => {
      console.log('export', req)
      return serialize(req)
    })
  }
}

export function importState (store, moduleState) {
  store.dispatch('requestClear')

  if (moduleState.list) {
    moduleState.list.forEach((serializedReq) => {
      let req = unserialize(serializedReq)
      store.dispatch('requestAdd', req)
    })
  }
}

const mutations = {
  REQUEST_CLEAR (state) {
    state.activeId = null
    state.list = []
    state.responses = []
  },

  REQUEST_CREATE (state) {
    state.list.push(
      new Request('GET', 'https://example.com/?foo=bar')
    )
  },

  REQUEST_ADD (state, req) {
    state.list.push(req)
    mutations.REQUEST_SET_ACTIVE(state, req.id)
  },

  REQUEST_DESELECT (state) {
    state.activeId = null
  },

  REQUEST_DELETE_ACTIVE (state) {
    state.list = state.list.filter(function (request) {
      return request.id !== state.activeId
    })
    mutations.REQUEST_DESELECT(state)
  },

  REQUEST_CLONE_ACTIVE (state) {
    if (!state.activeId) {
      return
    }

    applyFor(state.activeId, (req) => {
      let newReq = clone(req)
      state.list.push(newReq)
      mutations.REQUEST_SET_ACTIVE(state, newReq.id)
    })
  },

  REQUEST_SET_RESPONSE_ID (state, {id, responseId}) {
    applyFor(id, (req) => {
      req.lastResponseId = responseId
    })
  },

  REQUEST_SET_ACTIVE (state, id) {
    state.activeId = id
  },

  REQUEST_EDIT_URL (state, {id, newUrl}) {
    applyFor(id, (req) => {
      req.url = newUrl
    })
  },

  REQUEST_EDIT_METHOD (state, {id, newMethod}) {
    applyFor(id, (req) => {
      req.method = newMethod
    })
  },

  REQUEST_EDIT_BODY (state, {id, newBody}) {
    applyFor(id, (req) => {
      req.body = newBody
    })
  },

  REQUEST_EDIT_HEADERS (state, {id, newHeaders}) {
    applyFor(id, (req) => {
      req.headers = newHeaders
    })
  },

  RESPONSE_ADD (state, response) {
    state.responses.push(response)
  },

  RESPONSE_INIT (state, {id, blob, parsed, type, profiler}) {
    applyForResponse(id, (res) => {
      res.blob = blob
      res.parsed = parsed
      res.type = type

      if (profiler !== null) {
        res.profiler = profiler
      }
    })
  },

  RESPONSE_SET_PROFILE_SCHEME (state, {id, scheme}) {
    applyForResponse(id, (res) => {
      res.profiler.scheme = scheme
    })
  }
}

const actions = {
  requestClear ({ commit }) { commit('REQUEST_CLEAR') },
  requestCreate ({ commit }) { commit('REQUEST_CREATE') },
  requestAdd ({ commit }, req) { commit('REQUEST_ADD', req) },
  requestDeselect ({ commit }) { commit('REQUEST_DESELECT') },
  requestCloneActive ({ commit }) { commit('REQUEST_CLONE_ACTIVE') },
  requestDeleteActive ({ commit }) {
    if (!confirm('Delete this request? You are sure?')) {
      return
    }

    commit('REQUEST_DELETE_ACTIVE')
  },
  requestSetActive ({ commit }, id) { commit('REQUEST_SET_ACTIVE', id) },
  requestSetUrl ({ commit }, {id, newUrl}) { commit('REQUEST_EDIT_URL', {id, newUrl}) },
  requestSetMethod ({ commit }, {id, newMethod}) { commit('REQUEST_EDIT_METHOD', {id, newMethod}) },
  requestSetBody ({ commit }, {id, newBody}) { commit('REQUEST_EDIT_BODY', {id, newBody}) },
  requestSetHeaders ({ commit }, {id, newHeaders}) { commit('REQUEST_EDIT_HEADERS', {id, newHeaders}) },
  requestSetResponse ({ commit }, {id, responseId}) { commit('REQUEST_SET_RESPONSE_ID', {id, responseId}) },

  responseAdd ({ commit }, response) { commit('RESPONSE_ADD', response) },
  responseInit ({ commit }, {id, blob, parsed, type, profiler}) {
    commit('RESPONSE_INIT', {id, blob, parsed, type, profiler})

    if (profiler && profiler.transport === 'fetchApi') {
      let tOpts = profiler.transportOptions
      let profileUrl = `${tOpts.endpoint}${tOpts.uuid}`

      if (profileUrl.substring(0, 4) !== 'http') {
        // if this is relative link, we need to get server uri from Request
        applyForRequestWhenResponseIdIs(id, (req) => {
          let env = store.getters.activeEnv
          let requestUrl = parse(env, req.url)
          let urlParts = UrlParser(requestUrl)

          // apply default request uri to relative path
          profileUrl = urlParts.origin + profileUrl
        })
      }

      fetch(profileUrl)
        .then((res) => {
          res.text().then((scheme) => {
            commit('RESPONSE_SET_PROFILE_SCHEME', {id, scheme: JSON.parse(scheme)})
          })
        })
        .catch((err) => {
        // @todo err alert
          console.error(err)
        })
    }
  },
  responseSetProfileScheme ({ commit }, {id, scheme}) {
    commit('RESPONSE_SET_PROFILE_SCHEME', {id, scheme})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
