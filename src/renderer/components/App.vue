<template>
  <div class="container-fluid root-app">
    <div class="row h-100">
      <div class="col-4 col-xl-3 sidebar pt-2">
        <sidebar-card title="Environments">
          <environment-list></environment-list>
        </sidebar-card>
        <sidebar-card title="Variables">
          <environment-vars></environment-vars>
        </sidebar-card>
        <sidebar-card title="Requests">
          <request-list></request-list>
        </sidebar-card>
      </div>
      <div class="col-8 col-xl-9">
        <working-pane></working-pane>
      </div>
    </div>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import RequestList from './sidebar/request/RequestList'
  import WorkingPane from './workingPane/workingPane'
  import SidebarCard from './sidebar/sidebar-card'
  import EnvironmentList from './sidebar/environment/EnvironmentList'
  import EnvironmentVars from './sidebar/environment/EnvironmentVars'
  import SidebarModelActionsBtn from './sidebar/sidebar-model-actions-btn'
  export default {
    name: 'landing-page',
    components: {
      SidebarModelActionsBtn,
      EnvironmentVars,
      EnvironmentList,
      SidebarCard,
      WorkingPane,
      RequestList
    },
    created () {
      ipcRenderer.on('vuex-undo', () => {
        // todo undo
        console.log('undo')
      })

      ipcRenderer.on('vuex-redo', () => {
        // todo redo
        console.log('redo')
      })
    }
  }
</script>

<style>
  .root-app {
    border-top: 3px solid #122125;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .sidebar {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #122125;
  }
</style>
