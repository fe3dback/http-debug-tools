<template>
    <div class="vars-preview pt-1 pb-1 pl-2 pr-2">
        <template v-if="!currentEnvVarsIsEmpty">
            <template v-for="v, k in currentEnvVars">
                <div>
                    <small class="text-warning">{{k}}:</small>
                    <span>{{v}}</span>
                </div>
            </template>
        </template>
        <template v-else>
            <small class="text-warning">Not exist yet</small>
        </template>
    </div>
</template>

<script>
    import {getComputedVariables} from '../../../store/models/environment'
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

          return getComputedVariables(this.currentEnv)
        },

        currentEnvVarsIsEmpty () {
          if (!this.currentEnvVars) {
            return true
          }

          for (let key in this.currentEnvVars) {
            if (Object.prototype.hasOwnProperty.call(this.currentEnvVars, key)) {
              return false
            }
          }

          return true
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
