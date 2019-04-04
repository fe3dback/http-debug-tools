<template>
    <div class="events">
        <profiler-event v-for="sEvent in sEvents" :sEvent="sEvent"></profiler-event>
    </div>
</template>

<script>
    import ProfilerEvent from './profilerEvent'
    export default {
      name: 'response-profiler',
      components: {ProfilerEvent},
      props: ['scheme'],
      computed: {
        sEvents () {
          console.log(this.scheme)
          return (this.scheme && this.scheme.events) ? this.scheme.events : []
        }
      }
    }
</script>
