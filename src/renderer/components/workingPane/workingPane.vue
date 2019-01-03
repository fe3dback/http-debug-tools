<template>
    <div class="working-pane pt-3">
        <request-edit></request-edit>
    </div>
</template>

<script>
    import RequestEdit from './request/requestEdit'
    export default {
      name: 'working-pane',
      components: {RequestEdit}
    }
</script>
