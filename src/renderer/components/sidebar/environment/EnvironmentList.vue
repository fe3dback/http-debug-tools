<template>
    <div class="request-list">
        <div class="list-group list-group-flush">
            <template v-for="env in list">
                <a
                    class="list-group-item list-group-item-action"
                    :class="{'active': env.id === activeId}"
                    :key=env.id
                    @click="envSetActive(env.id)"
                >
                    {{env.name}}
                    <span class="badge badge-dark text-warning" v-if="env.id === activeId">
                        <i class="fa fa-check"></i>
                        Active
                    </span>
                </a>
                <vue-modal :name="`env-edit-${env.id}`" width="90%" height="90%" classes="">
                    <div slot="top-right">
                        <div class="btn btn-warning mt-2 mr-2" @click="$modal.hide(`env-edit-${env.id}`)">
                            <i class="fa fa-times"></i>
                        </div>
                    </div>
                    <div class="bg-dark env-modal">
                        <div class="container">
                            <environment-edit :env=env></environment-edit>
                        </div>
                    </div>
                </vue-modal>
            </template>
        </div>
        <sidebar-model-actions
            :id="activeId"
            v-on:create="envCreate"
            v-on:delete="envDeleteActive"
            v-on:clone="envCloneActive"
            v-on:edit="onEdit"
        ></sidebar-model-actions>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import SidebarModelActions from '../sidebar-model-actions'
    import EnvironmentEdit from '../../workingPane/environment/EnvironmentEdit'
    export default {
      name: 'environment-list',
      components: {EnvironmentEdit, SidebarModelActions},
      computed: {
        ...mapState({
          'list': state => state.environments.list,
          'activeId': state => state.environments.activeId
        })
      },
      methods: {
        ...mapActions([
          'envCreate',
          'envSetActive',
          'envDeleteActive',
          'envCloneActive'
        ]),
        onEdit () {
          if (!this.activeId) {
            return
          }
          this.$modal.show(`env-edit-${this.activeId}`)
        }
      }
    }
</script>

<style>
    .env-modal {
        padding: 35px 0;
        border: 5px solid #b58900;
    }
</style>
