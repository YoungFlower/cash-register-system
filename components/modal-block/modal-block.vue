<template>
  <div class='modal-block' @click="routerEvent">
    {{name}}
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    name: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang='scss'>
.modal-block {
  display: inline-block;
  font-size: 24rpx;
  text-align: center;
  width: 100rpx;
  height: 100rpx;
  padding: 18rpx;
  line-height: 32rpx;
  margin: 16rpx 33rpx;
  background: rgba(255, 255, 255, 0.4);
  color: rgba(0, 0, 0, 0.6);
  border-radius: 20rpx;
}
</style>