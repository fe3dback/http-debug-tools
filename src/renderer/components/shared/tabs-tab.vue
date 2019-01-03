<template>
    <li class="nav-item">
        <a class="nav-link" :class="{'active': active, 'disabled': disabled}" href="#" @click="chooseTab">
            <slot></slot>
        </a>
    </li>
</template>

<script>
    export default {
      name: 'tabs-tab',
      props: ['id', 'disabled'],
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
        },

        chooseTab () {
          if (this.disabled) {
            return
          }

          this.$parent.$emit('tab-click', this.id)
        }
      }
    }
</script>
