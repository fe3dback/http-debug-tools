<template>
    <div class="tabs">
        <ul class="nav nav-tabs">
            <slot></slot>
        </ul>
        <div class="tabs-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'tabs',
      props: ['activeTabId'],
      created () {
        this.$on('tab-click', this.onTabClicked)
      },
      mounted () {
        if (this.activeTabId) {
          this.onTabClicked(this.activeTabId)
        }
      },
      data () {
        return {
          'activeId': null
        }
      },
      methods: {
        onTabClicked (activeId) {
          this.activeId = activeId
          this.$children.forEach((child) => {
            child.$emit('tab-changed', activeId)
          })
        }
      }
    }
</script>

<style>
    .tabs-content {
        padding: 15px 0 0;
    }
</style>
