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
                                <textarea class="form-control" aria-label="post"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Headers</label>
                                <textarea class="form-control" aria-label="headers"></textarea>
                            </div>
                        </form>

                    </tabs-tab-content>
                    <tabs-tab-content id="response">
                        <div class="answer-area">
                            <div v-if="!request.error">
                                <VueJsonPretty :data="request.response"></VueJsonPretty>
                            </div>
                            <div v-else>
                                {{request.error}}
                            </div>
                        </div>
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
  import VueJsonPretty from 'vue-json-pretty'
  import {mapState} from 'vuex'
  import RequestSettingsBar from './requestSettingsBar'
  import Tabs from '../../shared/tabs'
  import TabsTab from '../../shared/tabs-tab'
  import TabsTabContent from '../../shared/tabs-tab-content'
  export default {
    name: 'request-edit',
    data () {
      return {
        activeTab: 'response'
      }
    },
    components: {
      TabsTabContent,
      TabsTab,
      Tabs,
      RequestSettingsBar,
      VueJsonPretty
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


<style>
    .answer-area {
        height: 100%;
        overflow: auto;
        max-height: 500px;
        padding: 5px;
        border: 1px solid;
        background-color: #f8f8f8;
        color: black;
    }
</style>
