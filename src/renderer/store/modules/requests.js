import Request from '../models/request'

let applyFor = function (id, cb) {
  state.list.map(function (r) {
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
  ]
}

const mutations = {
  REQUEST_CREATE (state) {
    state.list.push(
      new Request('DELETE', 'https://google.com/1234')
    )
  },

  REQUEST_CLEAR (state, id) {
    applyFor(id, (req) => {
      req.error = null
      req.responseCode = 0
      req.responseTime = 0
      req.responseBlob = null
      req.response = null
    })
  },

  REQUEST_SHOW_ERROR (state, {id, error}) {
    mutations.REQUEST_CLEAR(state, id)
    applyFor(id, (req) => {
      req.error = error
    })
  },

  REQUEST_SHOW_RESPONSE (state, {id, blob, json, time, code}) {
    mutations.REQUEST_CLEAR(state, id)
    applyFor(id, (req) => {
      req.responseCode = code
      req.responseTime = (time).toFixed(2)
      req.responseBlob = blob
      req.response = json
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
  }
}

const actions = {
  requestCreate ({ commit }) { commit('REQUEST_CREATE') },

  requestSetActive ({ commit }, id) { commit('REQUEST_SET_ACTIVE', id) },

  requestSetUrl ({ commit }, {id, newUrl}) {
    commit('REQUEST_EDIT_URL', {id, newUrl})
  },

  requestSetMethod ({ commit }, {id, newMethod}) {
    commit('REQUEST_EDIT_METHOD', {id, newMethod})
  },

  requestSetResponse ({ commit }, {id, error, response, time}) {
    if (!id) {
      return
    }

    if (error) {
      return commit('REQUEST_SHOW_ERROR', {id, error})
    }

    if (!response) {
      return commit('REQUEST_SHOW_ERROR', {id, error: 'Not found response'})
    }

    response.text()
      .then((blob) => {
        let json = null
        try {
          json = JSON.parse(blob)
        } catch (e) {
          return commit('REQUEST_SHOW_ERROR', {
            id,
            error: `Cant parse answer: "${e}" - example of output: - "${blob.substr(0, 128)}"...`
          })
        }

        return commit('REQUEST_SHOW_RESPONSE', {
          id, time, blob, json, code: response.status
        })
      })
      .catch((reason) => {
        return commit('REQUEST_SHOW_ERROR', {id, error: `Cant get response: ${reason}`})
      })
  }
}

export default {
  state,
  mutations,
  actions
}
