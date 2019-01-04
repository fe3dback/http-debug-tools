import Request from '../models/request'

let applyFor = function (id, cb) {
  state.list.map(function (r) {
    if (r.id === id) {
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
  list: [
    new Request('GET', 'https://google.com'),
    new Request('POST', 'https://crib.carmoney.ru/')
  ],
  responses: []
}

const mutations = {
  REQUEST_CREATE (state) {
    state.list.push(
      new Request('DELETE', 'https://google.com/1234')
    )
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

  RESPONSE_ADD (state, response) {
    state.responses.push(response)
  },

  RESPONSE_INIT (state, {id, blob, parsed, type}) {
    applyForResponse(id, (res) => {
      res.blob = blob
      res.parsed = parsed
      res.type = type
    })
  }
}

const actions = {
  requestCreate ({ commit }) { commit('REQUEST_CREATE') },
  requestDeselect ({ commit }) { commit('REQUEST_DESELECT') },
  requestDeleteActive ({ commit }) {
    if (!confirm('Delete this request? You are sure?')) {
      return
    }

    commit('REQUEST_DELETE_ACTIVE')
  },
  requestSetActive ({ commit }, id) { commit('REQUEST_SET_ACTIVE', id) },

  requestSetUrl ({ commit }, {id, newUrl}) {
    commit('REQUEST_EDIT_URL', {id, newUrl})
  },

  requestSetMethod ({ commit }, {id, newMethod}) {
    commit('REQUEST_EDIT_METHOD', {id, newMethod})
  },

  requestSetResponse ({ commit }, {id, responseId}) {
    commit('REQUEST_SET_RESPONSE_ID', {id, responseId})
  },

  responseAdd ({ commit }, response) { commit('RESPONSE_ADD', response) },
  responseInit ({ commit }, {id, blob, parsed, type}) {
    commit('RESPONSE_INIT', {id, blob, parsed, type})
  }
}

export default {
  state,
  mutations,
  actions
}
