import uuid4 from 'uuid4'
// import Response from './response'
// import fetch from 'node-fetch'

const Request = function (method, url) {
  // request
  this.id = uuid4()
  this.url = url
  this.method = method
  this.body = '{}'
  this.headers = '{}'
  this.lastResponseId = null
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
