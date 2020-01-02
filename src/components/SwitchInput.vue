<template>
  <div :class="checkClass" @click="checkHandler"></div>
</template>
<script>
export default {
  name: 'switch-input',
  props: {
    value: {
      type: Boolean,
    },
  },
  data() {
    return {
      check: this.value,
    };
  },
  watch: {
    value(val) {
      this.check = val;
    },
  },
  methods: {
    checkHandler() {
      this.$emit('input', !this.check);
    },
  },
  computed: {
    checkClass() {
      return {
        'switch-wrapper': true,
        check: this.check,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.switch-wrapper {
  position: relative;
  width: 70px;
  height: 30px;
  border-radius: 16px;
  background-color: #dcdfe6;
  transition: all 0.5s;
  cursor: pointer;
  &::after {
    position: absolute;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: #ffffff;
    transition: all 0.5s;
    content: ' ';
    top: 2px;
    left: 2px;
  }
  &.check {
    background-color: #409eff;
    &::after {
      left: 40px;
    }
  }
}
</style>
