<template>
    <div class="btn btn-sm" @click="$emit('click')">
        <i class="fa" :class="`fa-${icon}`"></i>
        <span
            :title=title
            class="d-none d-xl-inline-block"
            data-toggle="tooltip"
            data-placement="bottom"
        >
            {{title}}
        </span>
    </div>
</template>

<script>
    export default {
      name: 'sidebar-model-actions-btn',
      props: ['title', 'icon']
    }
</script>
