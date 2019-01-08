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
                    <a href="#" class="btn btn-primary w-100" @click="send(request)">
                        <i class="fa fa-paper-plane"></i> Send
                    </a>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {requestHTTPMethods} from '../../../store/models/request'
    import Response from '../../../store/models/response'
    export default {
      name: 'request-settings-bar',
      props: ['request'],
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
        send (request) {
          let tStart = performance.now()
          fetch(request.url)
            .then((res) => {
              let tEnd = performance.now()
              let response = new Response(res, tEnd - tStart)

              this.responseAdd(response)
              this.requestSetResponse({
                id: request.id,
                responseId: response.id
              })
            })
            .catch((reason) => {
              // todo show warning
              console.error(reason)
            })
        }
      },
      computed: {
        requestMethods () {
          return requestHTTPMethods()
        }
      }
    }
</script>
