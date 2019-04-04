<template>
    <div class="event">
        <h3>{{sEvent.type}}</h3>
        <app-editor
            :value=code
            lang="json"
            read-only="true"
            height="200"
        ></app-editor>
    </div>
</template>

<script>
    import AppEditor from '../../shared/editor'
    export default {
      name: 'profiler-event',
      components: {AppEditor},
      props: ['sEvent'],
      computed: {
        code () {
          return JSON.stringify(this.sEvent, null, 2)
        }
      }
    }
</script>
