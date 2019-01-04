<template>
    <div class="btn-group w-100">
        <div class="btn btn-sm w-25" @click="$emit('create')">
            <i class="fa fa-plus"></i> Create
        </div>
        <div class="btn btn-sm w-25" @click="$emit('edit')" v-if="id && hideEdit !== true">
            <i class="fa fa-edit"></i> Edit
        </div>
        <div class="btn btn-sm w-25" @click="$emit('copy')" v-if="id">
            <i class="fa fa-copy"></i> Copy
        </div>
        <div class="btn btn-sm w-25" @click="$emit('delete')" v-if="id">
            <i class="fa fa-trash"></i> Delete
        </div>
    </div>
</template>

<script>
    export default {
      name: 'sidebar-model-actions',
      props: ['id', 'hideEdit']
    }
</script>
