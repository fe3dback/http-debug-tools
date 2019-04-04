<template>
    <div class="request-settings-bar">
        <form>
            <div class="form-row">
                <div class="col-3 col-lg-2 form-group">
                    <select class="custom-select w-100" :value="request.method" @change="onEditMethod" aria-label="method">
                        <option v-for="method in requestMethods" :key="method" :selected="method === request.method">
                            {{method}}
                        </option>
                    </select>
                </div>
                <div class="col form-group">
                    <input class="form-control" type="text" :value="request.url" @input="onEditUrl" aria-label="url">
                </div>
                <div class="col-3 col-lg-2 form-group">
                    <div v-if="requestIdle">
                        <a href="#" class="btn btn-danger w-100" @click="cancel()">
                            <i class="fa fa-ban"></i>
                            <span >{{requestIdleFormattedTime}}</span>
                        </a>
                    </div>
                    <div v-else>
                        <a href="#" class="btn btn-primary w-100" @click="send(request)">
                            <i class="fa fa-paper-plane"></i>
                            Send
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import fetch from 'node-fetch'
    import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
    import {mapActions, mapGetters} from 'vuex'
    import {requestHTTPMethods} from '../../../store/models/request'
    import {parse} from '../../../store/models/environment'
    import Response from '../../../store/models/response'
    const UrlParser = require('url-parse')

    export default {
      name: 'request-settings-bar',
      props: ['request'],
      data () {
        return {
          requestIdleTime: 0,
          requestIdle: null,
          requestAbortController: null
        }
      },
      methods: {
        ...mapActions([
          'responseAdd',
          'requestSetResponse',
          'requestSetUrl',
          'requestSetMethod'
        ]),
        onEditUrl (e) {
          this.requestSetUrl({
            id: this.request.id,
            newUrl: e.target.value
          })
        },
        onEditMethod (e) {
          this.requestSetMethod({
            id: this.request.id,
            newMethod: e.target.value
          })
        },
        startRequestIdle () {
          this.requestAbortController = new AbortController()
          this.requestIdle = setInterval(() => {
            this.requestIdleTime += 10
          }, 10)
          this.requestIdleTime = 0
        },
        stopRequestIdle () {
          if (this.requestIdle) {
            clearTimeout(this.requestIdle)
          }
          this.requestIdleTime = 0
          this.requestIdle = null
          this.requestAbortController = null
        },
        parseOrEmpty (jsonString) {
          try {
            return JSON.parse(jsonString)
          } catch (e) {
            console.warn(e)
            return {}
          }
        },
        cancel () {
          if (this.requestAbortController) {
            this.requestAbortController.abort()
          }
          this.stopRequestIdle()
        },
        send (request) {
          this.startRequestIdle()
          let url = this.requestUrlVars
          let options = {
            signal: this.requestAbortController.signal,
            timeout: 1000 * 60, // 60 sec
            method: this.request.method,
            body: this.requestBodyVars,
            headers: {
              ...this.parseOrEmpty(this.requestHeadersVars),
              'Content-Type': 'application/json',
              'user-agent': 'http debug client (fe3dback/http-debug-tools)'
            }
          }

          if (this.request.method === 'GET' || this.request.method === 'HEAD') {
            let bodyParams = this.parseOrEmpty(this.requestBodyVars)
            let params = (Object.keys(bodyParams).map((key) => {
              return key + '=' + encodeURIComponent(`${bodyParams[key]}`)
            }) || []).join('&')

            let urlParams = UrlParser(this.requestUrlVars)
            let mergedQuery = (urlParams.query || '?') + (params ? `&${params}` : '')

            // -- set GET/HEAD props
            url = urlParams.origin + urlParams.pathname + mergedQuery
            options.body = null
            options.headers['Content-Type'] = 'text'
          }

          let tStart = performance.now()
          fetch(url, options)
            .then((res) => {
              let tEnd = performance.now()
              let response = new Response(res, tEnd - tStart)

              this.stopRequestIdle()
              this.responseAdd(response)
              this.requestSetResponse({
                id: request.id,
                responseId: response.id
              })
            })
            .catch((reason) => {
              // todo show warning
              this.stopRequestIdle()
              console.error(reason)
            })
        }
      },
      computed: {
        ...mapGetters([
          'activeEnv'
        ]),
        requestMethods () {
          return requestHTTPMethods()
        },
        requestBodyVars () {
          if (this.activeEnv) {
            return parse(this.activeEnv, this.request.body)
          }

          return this.request.body
        },
        requestHeadersVars () {
          if (this.activeEnv) {
            return parse(this.activeEnv, this.request.headers)
          }

          return this.request.headers
        },
        requestUrlVars () {
          if (this.activeEnv) {
            return parse(this.activeEnv, this.request.url)
          }

          return this.request.url
        },
        requestIdleFormattedTime () {
          if (this.requestIdleTime < 1000) {
            return `${this.requestIdleTime} ms`
          }

          return `${this.requestIdleTime / 1000} s`
        }
      }
    }
</script>
