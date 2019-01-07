<template>
    <div class="card mb-3">
        <div class="card-header pt-1 pb-1" @click="toggle">
            <div class="row">
                <div class="col">
                    <small>{{title}}</small>
                </div>
                <div class="col-3 ml-auto pr-1 text-right">
                    <i class="fa" :class="{
                        'fa-eye-slash': !active,
                        'fa-eye': active,
                    }"></i>
                </div>
            </div>
        </div>
        <template v-if="active">
            <slot ></slot>
        </template>
    </div>
</template>

<script>
    export default {
      name: 'sidebar-card',
      props: ['title'],
      data () {
        return {
          active: true
        }
      },
      methods: {
        toggle () {
          this.active = !this.active
        }
      }
    }
</script>
