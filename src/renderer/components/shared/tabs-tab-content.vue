<template>
    <div class="tab-content" v-if="active">
        <slot></slot>
    </div>
</template>

<script>
    export default {
      name: 'tabs-tab-content',
      props: ['id'],
      data () {
        return {
          active: false
        }
      },
      created () {
        this.$on('tab-changed', function (newTabId) {
          this.setActiveStatus(this.id === newTabId)
        })
      },
      methods: {
        setActiveStatus (status) {
          this.active = status
        }
      }
    }
</script>
