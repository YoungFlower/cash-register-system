<template>
  <view class="jk-list-loading flex-center-center"  v-if="show">
    <u-loading  :show="show"></u-loading>
  </view>
</template>

<script>
import config from "@/config";
export default {
  components: {},
  props:{
    show: {
      type: Boolean,
      default: false
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
.jk-list-loading {
  height: 30vh;
}
</style>
