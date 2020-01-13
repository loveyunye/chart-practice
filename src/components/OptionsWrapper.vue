<template>
  <div class="options-wrapper">
    <span class="label">默认配置：</span>
    <div class="defalut">
      <Editor ref="defalut" readOnly :height="160" />
    </div>
    <span class="label">当前配置：</span>
    <div class="current">
      <Editor ref="current" />
    </div>
    <div class="save">
      <span class="wraning">{{ wraning }}</span>
      <button @click="save">保存</button>
    </div>
  </div>
</template>
<script>
import Editor from './Editor';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'options-wrapper',
  components: {
    Editor,
  },
  data() {
    return {
      wraning: '',
    };
  },
  computed: {
    ...mapState('chart', ['defaultOptions', 'currentOptions']),
  },
  methods: {
    ...mapMutations('chart', ['setCurrentOptions']),
    save() {
      let options;
      try {
        const code = this.$refs.current.getValue();
        options = JSON.parse(code);
      } catch (error) {
        console.error(error);
        this.setWraning(true);
        return;
      }
      this.setWraning(false);
      this.setCurrentOptions(options);
    },
    setWraning(wran) {
      this.wraning = wran ? '！格式不正确' : '';
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.defalut.initEditor(JSON.stringify(this.defaultOptions));
      this.$refs.current.initEditor(JSON.stringify(this.currentOptions));
    });
  },
  watch: {
    defaultOptions: {
      handler(val) {
        this.$refs.defalut.setValue(JSON.stringify(val));
        this.$refs.current.setValue(JSON.stringify(val));
        this.setWraning(false);
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
.options-wrapper {
  .label {
    line-height: 40px;
    font-size: 1.2rem;
    margin-left: 10px;
    font-weight: 500;
  }
  .save {
    padding: 0 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      color: red;
    }
    button {
      border: none;
      outline: none;
      height: 24px;
      border-radius: 2px;
      padding: 0 16px;
      color: #ffffff;
      background-color: #409eff;
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>
