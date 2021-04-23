<template>
  <view class="jk-no-data flex-col-center" :style="{'height':height}">
    <view class="no-data flex-col flex-align-center">
      <template :type="1">
        <img :src="noEmployImg" alt="" style="margin-top: 0;">
        <view class="tip-text">
        {{text}}
        </view>
      </template>

    </view>
  </view>
</template>

<script>
import config from "@/config";

export default {
  components: {},
  data() {
    return {noEmployImg: `${config.imgSrc}no-employ-img.png`,}
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    height:{
      type:String,
      default:'auto'
    },
    text:{type:String,default: '暂无数据'}
  },
  watch: {},
  methods: {},
  onLoad(options) {
    this.options = options
  },
  onReady() {
  },
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
  onShareAppMessage() {
  }
}
</script>

<style lang="scss">
@import "@s/styles/index.scss";
.jk-no-data {
  .no-data {
    img,image {
      margin-top: 90rpx;
      width: 550rpx;
      height: 400rpx;
    }
    .tip-text {
      margin: 40rpx 0;
      font-size: 28rpx;
      color: #B4B8B8;
      line-height: 28rpx;
    }
  }
}

</style>
