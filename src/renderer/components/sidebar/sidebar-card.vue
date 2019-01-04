<template>
    <div class="card mb-3">
        <div class="card-header pt-1 pb-1">
            {{title}}
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
      name: 'sidebar-card',
      props: ['title']
    }
</script>
