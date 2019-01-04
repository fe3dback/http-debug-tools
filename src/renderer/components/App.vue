<template>
  <div class="container-fluid root-app">
    <div class="row h-100">
      <div class="col-4 col-lg-3 sidebar pt-2">
        <sidebar-card title="Environments">
          <environment-list></environment-list>
        </sidebar-card>
        <sidebar-card title="Requests">
          <request-list></request-list>
        </sidebar-card>
        <sidebar-card title="Application db">
          <div class="btn-group">
            <div class="btn btn-sm">
              <i class="fa fa-file-import"></i>
              Import..
            </div>
            <div class="btn btn-sm">
              <i class="fa fa-file-export"></i>
              Export..
            </div>
            <div class="btn btn-sm">
              <i class="fa fa-download"></i>
              Save
            </div>
            <div class="btn btn-sm">
              <i class="fa fa-upload"></i>
              Load
            </div>
          </div>
        </sidebar-card>
      </div>
      <div class="col-8 col-lg-9">
        <working-pane></working-pane>
      </div>
    </div>
  </div>
</template>

<script>
  import RequestList from './sidebar/request/RequestList'
  import WorkingPane from './workingPane/workingPane'
  import SidebarCard from './sidebar/sidebar-card'
  import EnvironmentList from './sidebar/environment/EnvironmentList'
  export default {
    name: 'landing-page',
    components: {
      EnvironmentList,
      SidebarCard,
      WorkingPane,
      RequestList
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
