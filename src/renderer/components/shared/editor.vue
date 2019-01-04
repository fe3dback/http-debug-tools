<template>
    <editor
        v-bind:value=value
        v-on:input="$emit('input', $event.target.value)"
        :lang=lang

        theme="github"
        width="100%"
        :height=height

        @init="editorInit"
    ></editor>
</template>

<script>
    export default {
      name: 'app-editor',
      props: ['value', 'lang', 'readOnly', 'height'],
      components: {
        editor: require('vue2-ace-editor')
      },
      methods: {
        editorInit: function (editor) {
          require('brace/ext/language_tools')
          require('brace/mode/html')
          require('brace/mode/json')
          require('brace/theme/github')
          require('brace/snippets/javascript')

          editor.setTheme('ace/theme/github')
          editor.session.setMode(`ace/mode/${this.lang}`)
          editor.setFontSize(18)
          editor.setReadOnly(this.readOnly === true)
        }
      }
    }
</script>
