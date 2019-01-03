<template>
  <div class="container-fluid root-app">
    <div class="row h-100">
      <div class="col-4 col-lg-3 sidebar">
        <request-list></request-list>
      </div>
      <div class="col">
        <working-pane></working-pane>
      </div>
    </div>
  </div>
</template>

<script>
  import RequestList from './sidebar/request/RequestList'
  import WorkingPane from './workingPane/workingPane'
  export default {
    name: 'landing-page',
    components: {
      WorkingPane,
      RequestList
    }
  }
</script>

<style>
  .root-app {
    border-top: 3px solid indigo;
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
    border-right: 1px solid #333;
  }
</style>
