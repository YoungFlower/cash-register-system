<template>
  <view class="jk-search-label">
    <view class="label-box flex-row-sb-center">
      <img v-if="label.hotLabelEnum===2" :src="activeIcon" alt="">
      <img v-if="label.hotLabelEnum===3" :src="hotIcon" alt="">
      <img v-if="label.hotLabelEnum===4" :src="recommendIcon" alt="">
      <img v-if="label.hotLabelEnum===5" :src="newIcon" alt="">
      {{label.hotWord}}
    </view>
  </view>
</template>

<script>
import config from "@/config";
export default {
  components: {},
  data(){
    return{
      recommendIcon: `${config.imgSrc}recommend-yellow-icon.png`,
      newIcon: `${config.imgSrc}new-yellow-icon.png`,
      hotIcon: `${config.imgSrc}hot-yellow-icon.png`,
      activeIcon: `${config.imgSrc}active-yellow-icon.png`,
    }
  },
  props:{
    label: {
      type: Object,
      required: true
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
.jk-search-label {
  .label-box {
    height: 56rpx;
    padding: 0 16rpx;
    background: #F7F8F8;
    border-radius: 24px;
    font-size: 26rpx;
    color: #333333;
    line-height: 56rpx;
    img,image{
      width: 30rpx;
      height: 30rpx;
      margin-right: 4rpx;
    }
  }
}
</style>
