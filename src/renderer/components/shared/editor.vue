<template>
    <editor
        v-bind:value="value"
        v-on:input.prevent=onInput
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
          require('brace/mode/xml')
          require('brace/theme/solarized_dark')
          require('brace/snippets/javascript')

          editor.setTheme('ace/theme/solarized_dark')
          editor.session.setMode(`ace/mode/${this.lang}`)
          editor.setFontSize(18)
          editor.setReadOnly(this.readOnly === true)
          editor.session.setOptions({
            tabSize: 2,
            useSoftTabs: true
          })
        },

        onInput (e) {
          if ((typeof e) === 'string') {
            return this.$emit('input', e)
          }

          if (e && e.target && e.target.value) {
            let val = `${e.target.value}` || ''
            return this.$emit('input', val)
          }

          return this.$emit('input', '')
        }
      }
    }
</script>
