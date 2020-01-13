<template>
  <div
    ref="container"
    class="monaco-editor-wrapper"
    :style="`height: ${height}px`"
  />
</template>
<script>
import * as monaco from 'monaco-editor';

export default {
  name: 'Editor',
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    minimap: {
      type: Boolean,
      default: false,
    },
    current: Number,
    editorOptions: {
      type: Object,
      default: function() {
        return {
          selectOnLineNumbers: true, // 显示行号
          roundedSelection: false,
          cursorStyle: 'line', // 光标样式
          automaticLayout: false, // 自动布局
          glyphMargin: true, // 字形边缘
          useTabStops: false,
          fontSize: 28, // 字体大小
          autoIndent: true, // 自动布局
        };
      },
    },
    height: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      editor: null,
      suggestionsDispose: null,
      theme: {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'custom-info', foreground: 'a3a7a9', background: 'ffffff' },
          { token: 'custom-error', foreground: 'ee4444' },
          { token: 'custom-notice', foreground: '1055af' },
          { token: 'custom-date', foreground: '20aa20' },
        ],
        colors: {
          'editor.background': '#212844',
        },
      },
    };
  },
  methods: {
    initEditor(code = '') {
      monaco.editor.defineTheme('myTheme', this.theme);
      this.editor = monaco.editor.create(this.$refs.container, {
        value: null,
        language: 'json',
        theme: 'myTheme', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        editorOptions: this.editorOptions,
        minimap: {
          enabled: this.minimap,
        },
        readOnly: this.readOnly,
        formatOnType: true,
        formatOnPaste: true,
        detectIndentation: true,
        autoIndent: true,
        tabSize: 2,
        indentSize: 2,
      });
      this.editor.onDidBlurEditorWidget(() => {
        if (this.editor) {
          this.$emit('change', this.editor.getValue());
        }
      });
      this.setValue(code);
    },
    getValue() {
      if (this.editor) {
        return this.editor.getValue();
      }
    },
    setValue(code) {
      let res;
      try {
        res = JSON.stringify(JSON.parse(code), null, '\t');
      } catch {
        res = code;
      }
      this.editor.setValue(res);
    },
    remove() {
      if (this.editor) {
        if (this.editor.getModel()) {
          this.editor.getModel().dispose();
        }
        this.editor.dispose();
        this.editor = null;
      }
    },
  },
  beforeDestroy() {
    this.remove();
  },
};
</script>
<style lang="less" scoped>
.monaco-editor-wrapper {
  overflow: hidden;
  border-top: 1px solid #1c2139;
  border-bottom: 1px solid #1c2139;
}
</style>
