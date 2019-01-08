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

  res.headers.forEach((value, key) => {
    this.headers[key] = value
  })

  res.text().then((blob) => init(this, blob))
}

let init = function (response, blob) {
  let type = getType(response)
  let parsed = null

  // format json
  if (type === TYPE_JSON) {
    try {
      let jsonObject = JSON.parse(blob)
      if (jsonObject) {
        parsed = JSON.stringify(jsonObject, null, 2)
      }
    } catch (e) {
      // todo show warning message
      console.warn(e)
      type = TYPE_TEXT
    }
  }

  store.dispatch('responseInit', {
    id: response.id, blob, parsed, type
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
