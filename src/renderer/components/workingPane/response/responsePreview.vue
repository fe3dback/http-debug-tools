<template>
    <tabs active-tab-id="response-body" v-if="response">
        <tabs-tab id="response-body">
            Body
            <span class="badge badge-dark">{{response.type}}</span>
        </tabs-tab>
        <tabs-tab id="response-raw">Raw</tabs-tab>
        <tabs-tab id="response-headers">Headers</tabs-tab>

        <template slot="content">
            <tabs-tab-content id="response-body">
                <app-editor v-if="response.parsed || response.blob"
                    height="450px"
                    :lang=response.type
                    :value="response.parsed || response.blob"
                    :read-only=true></app-editor>
            </tabs-tab-content>
            <tabs-tab-content id="response-raw">
                <app-editor v-if="response.blob"
                    height="450px"
                    lang="text"
                    :value=response.blob
                    :read-only=true></app-editor>
            </tabs-tab-content>
            <tabs-tab-content id="response-headers">
                <app-editor v-if="headers"
                    height="450px"
                    lang="json"
                    :value=headers
                    :read-only=true></app-editor>
            </tabs-tab-content>
        </template>
    </tabs>
</template>

<script>
    import AppEditor from '../../shared/editor'
    import Tabs from '../../shared/tabs'
    import TabsTab from '../../shared/tabs-tab'
    import TabsTabContent from '../../shared/tabs-tab-content'
    export default {
      name: 'response-preview',
      components: {TabsTabContent, TabsTab, Tabs, AppEditor},
      props: ['request', 'response'],
      computed: {
        headers () {
          return JSON.stringify(this.response.headers, null, 2)
        }
      }
    }
</script>
