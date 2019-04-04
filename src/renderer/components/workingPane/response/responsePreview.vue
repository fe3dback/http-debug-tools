<template>
    <tabs active-tab-id="response-body">
        <template v-if="response">
            <tabs-tab id="response-body">
                Body
                <span class="badge badge-dark">{{response.type}}</span>
            </tabs-tab>
            <tabs-tab id="response-raw">Raw</tabs-tab>
            <tabs-tab id="response-headers">Headers</tabs-tab>
            <tabs-tab id="response-cat">Cat</tabs-tab>
            <template slot="content">
                <tabs-tab-content id="response-body">
                    <response-preview-editor
                            :value="response.parsed || response.blob"
                            :lang=response.type
                            not-exist-msg="Response body empty or not valid (unknown format, parse errors..). Try to check raw response">
                    </response-preview-editor>
                </tabs-tab-content>
                <tabs-tab-content id="response-raw">
                    <response-preview-editor
                            :value="response.blob"
                            lang="text"
                            not-exist-msg="Response body is empty">
                    </response-preview-editor>
                </tabs-tab-content>
                <tabs-tab-content id="response-headers">
                    <response-preview-editor
                            :value="headers"
                            lang="json"
                            not-exist-msg="Headers is empty">
                    </response-preview-editor>
                </tabs-tab-content>
                <tabs-tab-content id="response-cat">
                    <img :src=catUrl :alt=request.code width="500px"/>
                </tabs-tab-content>
            </template>
        </template>
        <template v-else>
            <tabs-tab id="response-body">Response</tabs-tab>
            <template slot="content">
                <tabs-tab-content id="response-body">
                    <div class="alert alert-dark">
                        <i class="fa fa-clock"></i>
                        No response exist, send request first..
                    </div>
                </tabs-tab-content>
            </template>
        </template>
    </tabs>
</template>

<script>
    import AppEditor from '../../shared/editor'
    import Tabs from '../../shared/tabs'
    import TabsTab from '../../shared/tabs-tab'
    import TabsTabContent from '../../shared/tabs-tab-content'
    import ResponsePreviewEditor from './responsePreviewEditor'
    export default {
      name: 'response-preview',
      components: {ResponsePreviewEditor, TabsTabContent, TabsTab, Tabs, AppEditor},
      props: ['request', 'response'],
      computed: {
        headers () {
          return JSON.stringify(this.response.headers, null, 2)
        },
        catUrl () {
          return `https://http.cat/${this.response.code}`
        }
      }
    }
</script>
