<template>
    <div class="request-list">
        <div class="list-group list-group-flush">
            <a class="list-group-item list-group-item-action" @click="requestCreate">
                <span class="text-success">
                    <i class="fa fa-plus"></i> Create HTTP Request
                </span>
            </a>
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
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
      name: 'request-list',
      computed: {
        ...mapState({
          'list': state => state.requests.list,
          'activeId': state => state.requests.activeId
        })
      },
      methods: {
        ...mapActions([
          'requestCreate'
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
