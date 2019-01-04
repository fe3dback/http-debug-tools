import store from '../index'
import uuid4 from 'uuid4'
import Response from './response'
import fetch from 'node-fetch'

const Request = function (method, url) {
  // request
  this.id = uuid4()
  this.url = url
  this.method = method
  this.body = '{}'
  this.headers = '{}'
  this.lastResponseId = null
}

Request.prototype.methods = function () {
  return [
    'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'
  ]
}

Request.prototype.methodType = function () {
  switch (this.method) {
    case 'GET': return 'success'
    case 'HEAD': return 'dark'
    case 'POST': return 'warning'
    case 'PUT': return 'info'
    case 'PATCH': return 'primary'
    case 'DELETE': return 'danger'
    case 'OPTIONS': return 'secondary'
    default: return 'light'
  }
}

Request.prototype.send = function () {
  let tStart = performance.now()
  fetch(this.url)
    .then((res) => {
      let tEnd = performance.now()
      let response = new Response(res, tEnd - tStart)

      store.dispatch('responseAdd', response)
      store.dispatch('requestSetResponse', {
        id: this.id,
        responseId: response.id
      })
    })
    .catch((reason) => {
      // todo show warning
      console.error(reason)
    })
}

Request.prototype.getUrlShort = function (length) {
  if (this.url.length <= length) {
    return this.url
  }
  return '..' + this.url.substr(this.url.length - length)
}

Request.prototype.setAsActive = function () {
  store.dispatch('requestSetActive', this.id)
}

Request.prototype.onEditUrl = function (newUrl) {
  store.dispatch('requestSetUrl', {
    id: this.id,
    newUrl
  })
}

Request.prototype.onEditMethod = function (newMethod) {
  store.dispatch('requestSetMethod', {
    id: this.id,
    newMethod
  })
}

export default Request
