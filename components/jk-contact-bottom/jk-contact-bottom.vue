<template>
  <view class="jk-contact-bottom">
    <view class="contact">
      如有疑问.您可拨打客服热线:400-168-9788 或
      <br>
      <button open-type="contact">联系在线客服</button>
    </view>

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
.jk-contact-bottom {
  .contact {
    text-align: center;
    margin-top: 46rpx;
    background-color: #fff;
    font-size: 24rpx;
    color: #969999;
    line-height: 33rpx;
    uni-button {
      display: inline-block;
      border: none;
      padding: 0;
      bottom: 0;
      font-size: 24rpx;
      line-height: 33rpx;
      color: $mc1;

    }

    uni-button::after {
      border: none;
    }

    button {
      display: inline-block;
      border: none;
      padding: 0;
      bottom: 0;
      background-color: #fff;
      font-size: 24rpx;
      line-height: 33rpx;
      color: $mc1;
    }

    button::after {
      border: none;
    }
  }
}

</style>
