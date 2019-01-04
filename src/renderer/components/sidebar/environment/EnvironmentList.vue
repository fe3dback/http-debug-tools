<template>
    <div class="request-list">
        <div class="list-group list-group-flush">
            <a
                v-for="env in list"
                class="list-group-item list-group-item-action"
                :class="{'active': env.id === activeId}"
                :key=env.id
                @click="env.setAsActive()"
            >
                {{env.name}}
                <span class="badge badge-dark text-warning" v-if="env.id === activeId">
                    <i class="fa fa-check"></i>
                    Active
                </span>
            </a>
        </div>
        <sidebar-model-actions
            :id="activeId"
            v-on:create="envCreate"
            v-on:delete="envDeleteActive"
        ></sidebar-model-actions>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import SidebarModelActions from '../sidebar-model-actions'
    export default {
      name: 'environment-list',
      components: {SidebarModelActions},
      computed: {
        ...mapState({
          'list': state => state.environments.list,
          'activeId': state => state.environments.activeId
        })
      },
      methods: {
        ...mapActions([
          'envCreate',
          'envDeleteActive'
        ])
      }
    }
</script>
