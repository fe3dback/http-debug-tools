<template>
    <div class="preview-editor">
        <template v-if="value">
            <app-editor
                height="450px"
                :lang=lang
                :value=value
                :read-only=true>
            </app-editor>
        </template>
        <template v-else>
            <div class="alert alert-info">
                <i class="fa fa-question-circle"></i>
                {{notExistMsg}}
            </div>
        </template>
    </div>
</template>

<script>
    import AppEditor from '../../shared/editor'
    export default {
      name: 'response-preview-editor',
      components: {AppEditor},
      props: ['value', 'lang', 'notExistMsg']
    }
</script>
