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
    import {mapGetters} from 'vuex'
    export default {
      name: 'environment-vars',
      computed: {
        ...mapGetters([
          'currentEnvVars',
          'currentEnvVarsIsEmpty'
        ])
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
