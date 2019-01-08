import uuid4 from 'uuid4'

const Request = function (method, url) {
  // request
  this.id = uuid4()
  this.url = url
  this.method = method
  this.body = '{}'
  this.headers = '{}'
  this.lastResponseId = null
}

export function serialize (req) {
  return {
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers
  }
}

export function unserialize (state) {
  let req = new Request(state.method, state.url)
  req.body = state.body
  req.headers = state.headers
  return req
}

export function clone (srcReq) {
  let newReq = new Request(srcReq.method, srcReq.url)
  newReq.body = srcReq.body
  newReq.headers = srcReq.headers
  return newReq
}

export function requestHTTPMethods () {
  return [
    'GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'
  ]
}

export function getUrlShort (request, length) {
  if (request.url.length <= length) {
    return request.url
  }
  return '..' + request.url.substr(request.url.length - length)
}

export default Request
