import store from '../index'
import uuid4 from 'uuid4'

const Request = function (method, url) {
  // request
  this.id = uuid4()
  this.url = url
  this.method = method

  // response
  this.response = null
  this.responseBlob = null
  this.responseCode = 0
  this.responseTime = 0

  // misc
  this.error = null

  console.log('new request model', this)
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

Request.prototype.statusColor = function () {
  if (this.responseCode >= 500) {
    return 'red'
  } else if (this.responseCode >= 400) {
    return 'orange'
  } else if (this.responseCode >= 300) {
    return 'yellow'
  } else if (this.responseCode >= 200) {
    return 'lime'
  }
  return 'white'
}

Request.prototype.send = function () {
  let tStart = performance.now()

  fetch(this.url)
    .then((res) => {
      let tEnd = performance.now()
      store.dispatch('requestSetResponse', {
        id: this.id,
        response: res,
        time: tEnd - tStart
      })
    })
    .catch((reason) => {
      store.dispatch('requestSetResponse', {
        id: this.id,
        error: `Cant make request: ${reason}`
      })
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
