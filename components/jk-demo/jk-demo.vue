<template>
  <view class="jk-demo">


  </view>
</template>

<script>
import config from "@/config";
export default {
  components: {},
  props:{
    type: {
      type: Number,
      default: 1
    }
  },
  watch: {},
  methods: {
  },
  onLoad(options){
    this.options = options
  },
  onReady(){},
  onShow() {
  },
  onHide() {
  },
  onUnload() {
  },
  onReachBottom() {
  },
  onPullDownRefresh() {
  },
  onShareAppMessage(){}
}
</script>

<style lang="scss">
@import "@s/styles/index.scss";

</style>
