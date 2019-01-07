<template>
    <div class="btn-group w-100">
        <sidebar-model-actions-btn
                icon="plus"
                title="Create"
                @click="$emit('create')">
        </sidebar-model-actions-btn>
        <sidebar-model-actions-btn
                icon="edit"
                title="Edit"
                @click="$emit('edit')"
                v-if="id && hideEdit !== true">
        </sidebar-model-actions-btn>
        <sidebar-model-actions-btn
                icon="clone"
                title="Clone"
                @click="$emit('clone')"
                v-if="id">
        </sidebar-model-actions-btn>
        <sidebar-model-actions-btn
                icon="trash"
                title="Delete"
                @click="$emit('delete')"
                v-if="id">
        </sidebar-model-actions-btn>
    </div>
</template>

<script>
    import SidebarModelActionsBtn from './sidebar-model-actions-btn'
    export default {
      name: 'sidebar-model-actions',
      components: {SidebarModelActionsBtn},
      props: ['id', 'hideEdit']
    }
</script>
