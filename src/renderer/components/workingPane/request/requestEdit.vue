<template>
    <div class="request-edit">
        <template v-if="request">
            <div class="row">
                <div class="col-9 col-xl-10">
                    <request-settings-bar :request=request></request-settings-bar>
                </div>
                <div class="col-3 col-xl-2">
                    <div v-if="response" class="alert alert-dark pt-2 pb-2 pl-1 pr-1 text-center">
                        <span class="badge" :class="`badge-${getCodeClassType(response)}`">
                            {{response.status}} {{response.code}}
                        </span>
                        <span class="badge badge-dark">
                            {{response.time}} ms
                        </span>
                    </div>
                </div>
            </div>

            <div class="entire-edit">
                <div class="row">
                    <div class="col-5">
                        <tabs active-tab-id="body">
                            <tabs-tab id="body">Body</tabs-tab>
                            <tabs-tab id="headers">Headers</tabs-tab>
                            <template slot="content">
                                <tabs-tab-content id="body">
                                    <app-editor
                                        lang="json"
                                        :value=request.body
                                        @input=onEditBody></app-editor>
                                </tabs-tab-content>
                                <tabs-tab-content id="headers">
                                    <app-editor
                                        lang="json"
                                        :value=request.headers
                                        @input=onEditHeaders></app-editor>
                                </tabs-tab-content>
                            </template>
                        </tabs>
                    </div>
                    <div class="col-7">
                        <response-preview :request=request :response=response></response-preview>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="mt-5"></div>
            <div class="row">
                <div class="col-3 text-right">
                    <span class="display-1">
                    <i class="fa fa-code"></i>
                </span>
                </div>
                <div class="col-9">
                    <h3 class="mt-3">
                        Create or select HTTP(s) request
                        <br />
                        <small>to start debug your API</small>
                    </h3>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import RequestSettingsBar from './requestSettingsBar'
  import Tabs from '../../shared/tabs'
  import TabsTab from '../../shared/tabs-tab'
  import TabsTabContent from '../../shared/tabs-tab-content'
  import AppEditor from '../../shared/editor'
  import ResponsePreview from '../response/responsePreview'
  export default {
    name: 'request-edit',
    data () {
      return {
        activeTab: 'response',
        tmpBody: '',
        tmpHeaders: ''
      }
    },
    components: {
      ResponsePreview,
      AppEditor,
      TabsTabContent,
      TabsTab,
      Tabs,
      RequestSettingsBar
    },
    methods: {
      ...mapActions([
        'requestSetBody',
        'requestSetHeaders'
      ]),
      getCodeClassType (response) {
        if (response.code >= 500) {
          return 'danger'
        } else if (response.code >= 400) {
          return 'warning'
        } else if (response.code >= 300) {
          return 'info'
        } else if (response.code >= 200) {
          return 'success'
        }
        return 'secondary'
      },
      onEditBody (newBody) {
        this.requestSetBody({
          id: this.request.id,
          newBody
        })
      },
      onEditHeaders (newHeaders) {
        this.requestSetHeaders({
          id: this.request.id,
          newHeaders
        })
      }
    },
    computed: {
      ...mapState({
        'activeId': state => state.requests.activeId,
        'list': state => state.requests.list,
        'responses': state => state.requests.responses
      }),
      request () {
        return this.list.find((request) => {
          return request.id === this.activeId
        })
      },
      lastResponseId () {
        if (this.request && this.request.lastResponseId) {
          return this.request.lastResponseId
        }

        return null
      },
      response () {
        if (!this.lastResponseId) {
          return null
        }

        return this.responses.find((response) => {
          return response.id === this.lastResponseId
        })
      }
    }
  }
</script>
