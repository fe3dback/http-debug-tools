<template>
    <div class="request-edit">
        <template v-if="request">
            <request-settings-bar :request=request></request-settings-bar>

            <tabs active-tab-id="response">
                <tabs-tab id="request">Request</tabs-tab>
                <tabs-tab id="response">
                    Response
                    <template v-if="request.responseCode">
                        <span class="badge badge-dark" :style="{'color': request.statusColor()}">
                            {{request.responseCode}}
                        </span>
                        <span class="badge badge-dark">
                            {{request.responseTime}} ms
                        </span>
                    </template>
                    <template v-else>
                        <span class="badge badge-dark">...</span>
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
                    <tabs-tab-content id="request">
                        <form>
                            <div class="form-group">
                                <label>Body</label>
                                <app-editor lang="json" v-model=tmpBody height="200px"></app-editor>
                            </div>
                            <div class="form-group">
                                <label>Headers</label>
                                <app-editor lang="json" v-model=tmpBody height="200px"></app-editor>
                            </div>
                        </form>

                    </tabs-tab-content>
                    <tabs-tab-content id="response">
                        <template v-if="!request.error">
                            <template v-if="request.responseBlob">
                                <app-editor
                                    lang="json"
                                    height="450px"
                                    :value=request.responseBlob
                                    :read-only=true></app-editor>
                            </template>
                            <template v-else>
                                Send request to server..
                            </template>
                        </template>
                        <template v-else>
                            {{request.error}}
                        </template>
                    </tabs-tab-content>
                </template>
            </tabs>
        </template>
        <template v-else>
            <h3 class="text-warning">Select or create new HTTP Request</h3>
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
      AppEditor,
      TabsTabContent,
      TabsTab,
      Tabs,
      RequestSettingsBar
    },
    computed: {
      ...mapState({
        'activeId': state => state.requests.activeId,
        'list': state => state.requests.list
      }),
      request () {
        return this.list.find((request) => {
          return request.id === this.activeId
        })
      }
    }
  }
</script>
