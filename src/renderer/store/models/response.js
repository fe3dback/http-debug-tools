import uuid4 from 'uuid4'
import contentTypeParser from 'content-type-parser'
import store from '../index'

const TYPE_JSON = 'json'
const TYPE_XML = 'xml'
const TYPE_HTML = 'html'
const TYPE_TEXT = 'text'
const TYPE_JS = 'javascript'

const Response = function (res, time) {
  this.id = uuid4()
  this.response = res

  this.blob = null
  this.parsed = null
  this.type = TYPE_TEXT
  this.code = res.status
  this.status = res.statusText || null
  this.time = time.toFixed(2)
  this.headers = {}
  this.profiler = {
    transport: null,
    transportOptions: {},
    scheme: {}
  }

  res.headers.forEach((value, key) => {
    this.headers[key] = value

    if (key.toLowerCase() === 'x-http-debug-id') {
      this.profiler.transport = 'fetchApi'
      this.profiler.transportOptions['uuid'] = value
    }

    if (key.toLowerCase() === 'x-http-debug-api') {
      this.profiler.transport = 'fetchApi'
      this.profiler.transportOptions['endpoint'] = value
    }
  })

  if (this.profiler.transport === 'fetchApi') {
    let tOpts = this.profiler.transportOptions
    if (!tOpts.uuid || !tOpts.endpoint) {
      console.warn('Api not return both required transport properties, profiling is not possible :(')
      console.info(this.profiler.transport)
      this.profiler.transport = null
      this.profiler.transportOptions = {}
      this.profiler.scheme = {}
    }
  }

  res.text().then((blob) => init(this, blob))
}

let init = function (response, blob) {
  let type = getType(response)
  let parsed = null
  let profiler = response.profiler

  // format json
  if (type === TYPE_JSON) {
    try {
      let jsonObject = JSON.parse(blob)
      if (jsonObject) {
        parsed = JSON.stringify(jsonObject, null, 2)

        // check transport json injected
        if (jsonObject['_x_http_debug']) {
          profiler = {
            scheme: jsonObject['_x_http_debug'],
            transport: 'injected',
            transportOptions: {}
          }
        }
      }
    } catch (e) {
      // todo show warning message
      console.warn(e)
      type = TYPE_TEXT
    }
  }

  store.dispatch('responseInit', {
    id: response.id, blob, parsed, type, profiler
  })
}

export function getType (response) {
  if (!response.headers['content-type']) {
    return TYPE_TEXT
  }

  let contentType = contentTypeParser(response.headers['content-type'])

  // json
  if (contentType.type === 'application' && contentType.subtype === 'json') {
    return TYPE_JSON
  }

  // xml
  if (contentType.type === 'application' && contentType.subtype === 'xml') {
    return TYPE_XML
  }

  // html
  if (contentType.type === 'text' && contentType.subtype === 'html') {
    return TYPE_HTML
  }

  // js
  if (contentType.type === 'application' && contentType.subtype === 'javascript') {
    return TYPE_JS
  }

  return TYPE_TEXT
}

export default Response
