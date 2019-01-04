<template>
    <div class="request-edit">
        <template v-if="request">
            <request-settings-bar :request=request></request-settings-bar>

            <tabs active-tab-id="response">
                <tabs-tab id="debug">*</tabs-tab>
                <tabs-tab id="request">Request</tabs-tab>
                <tabs-tab id="response">
                    Response
                    <template v-if="response">
                        <span class="badge" :class="`badge-${response.getCodeClassType()}`">
                            {{response.status}} {{response.code}}
                        </span>
                        <span class="badge badge-dark">
                            {{response.time}} ms
                        </span>
                    </template>
                </tabs-tab>
                <tabs-tab id="sql" disabled=true>
                    <i class="fa fa-database"></i>
                    SQL
                </tabs-tab>
                <tabs-tab id="logs" disabled=true>
                    <i class="fa fa-file-alt"></i>
                    Logs
                </tabs-tab>
                <tabs-tab id="routes" disabled=true>
                    <i class="fa fa-route"></i>
                    Routes
                </tabs-tab>
                <tabs-tab id="acl" disabled=true>
                    <i class="fa fa-lock-open"></i>
                    ACL
                </tabs-tab>
                <template slot="content">
                    <tabs-tab-content id="debug">
                        <div class="debug-zone">
                            <pre>{{request}}</pre>
                            <pre>{{response}}</pre>
                        </div>
                    </tabs-tab-content>
                    <tabs-tab-content id="request">
                        <form>
                            <div class="form-group">
                                <label>Body:</label>
                                <app-editor lang="json" v-model=request.body height="200px"></app-editor>
                            </div>
                            <div class="form-group">
                                <label>Headers:</label>
                                <app-editor lang="json" v-model=request.headers height="200px"></app-editor>
                            </div>
                        </form>
                    </tabs-tab-content>
                    <tabs-tab-content id="response">
                        <template v-if="response">
                            <response-preview :request=request :response=response></response-preview>
                        </template>
                        <template v-else>
                            <div class="alert alert-info">
                                Send request to server first..
                            </div>
                        </template>
                    </tabs-tab-content>
                </template>
            </tabs>
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
  import {mapState} from 'vuex'
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

<style>
    .debug-zone {
        max-width: 100%;
        max-height: 500px;
        overflow: auto;
        border: 1px solid orangered;
        padding: 5px;
    }

    .debug-zone pre {
        overflow: visible;
    }
</style>
