<template>
    <div class="request-list">
        <div class="list-group list-group-flush">
            <a
                class="list-group-item list-group-item-action"
                :class="{'active': request.id === activeId}"
                v-for="request in list"
                :key=request.id
                @click="request.setAsActive()"
            >
                <span class="row">
                    <span class="col-2">
                        <span class="badge" :class="`badge-${request.methodType()}`">
                            {{request.method}}
                        </span>
                    </span>
                    <span class="col-10 text-right">
                        <span class="request-url">{{request.getUrlShort(20)}}</span>
                    </span>
                </span>
            </a>
        </div>
        <sidebar-model-actions
            :id="activeId"
            :hide-edit=true
            v-on:create="requestCreate"
            v-on:delete="requestDeleteActive"
        ></sidebar-model-actions>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import SidebarModelActions from '../sidebar-model-actions'
    export default {
      name: 'request-list',
      components: {SidebarModelActions},
      computed: {
        ...mapState({
          'list': state => state.requests.list,
          'activeId': state => state.requests.activeId
        })
      },
      methods: {
        ...mapActions([
          'requestCreate',
          'requestDeselect',
          'requestDeleteActive'
        ])
      }
    }
</script>

<style>
    .request-url {
        font-size: 12px;
        line-height: 14px;
        font-family: monospace;
    }
</style>
