<template>
    <div class="vars-preview pt-1 pb-1 pl-2 pr-2">
        <template v-for="v, k in currentEnvVars">
            <div>
                <small class="text-warning">{{k}}:</small>
                <span>{{v}}</span>
            </div>
        </template>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
      name: 'environment-vars',
      computed: {
        ...mapState({
          'list': state => state.environments.list,
          'activeId': state => state.environments.activeId
        }),

        currentEnv () {
          return this.list.find((env) => {
            return env.id === this.activeId
          })
        },

        currentEnvVars () {
          if (!this.currentEnv) {
            return
          }

          return this.currentEnv.getComputedVariables()
        }
      }
    }
</script>

<style>
    .vars-preview {
        overflow: hidden;
        max-height: 150px;
        font-size: 14px;
        line-height: 14px;
        background-color: #042028;
        color: #999;
    }
</style>
