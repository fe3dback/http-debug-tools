<template>
    <div class="row working-pane pt-2">
        <div class="col">
            <request-edit></request-edit>
        </div>
    </div>
</template>

<script>
    import RequestEdit from './request/requestEdit'
    export default {
      name: 'working-pane',
      components: {RequestEdit}
    }
</script>
