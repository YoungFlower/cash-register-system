<template>
  <view class="jk-btn-certification">
    <view v-if="type==='company'" class="certification-company flex-row flex-align-center">
      <image :src="enterpriseCertificationIcon"></image>
      <view class="text">已认证</view>
    </view>
    <view v-else class="flex-row flex-align-center" :class="[marginTop?'personal-certificate-icon':'certification-personal']" :style="{'background-color':bColor}">
      <image :src="personalCertificateIcon"></image>
      <view class="text">个人认证</view>
    </view>

  </view>
</template>

<script>
import config from "@/config";
export default {
  components: {},
  data(){
    return{
      enterpriseCertificationIcon: `${config.imgSrc}enterprise-certification-icon.png`,
      personalCertificateIcon: `${config.imgSrc}personal-certificate-icon.png`,
    }
  },
  props:{
    type: {
      type: String,
      default: 'company'
    },
    bColor: {
      type: String,
      default: '#E6F7FF'
    },
	marginTop: {
		type:Boolean,
		default:true
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
.jk-btn-certification {
  .certification-company {
	height: 36rpx;
	padding:4rpx 3rpx 4rpx 7rpx;
	border-radius: 40rpx;
	font-size: 20rpx;
	border: 2rpx solid #FF983F;
	.text{
	  font-size: 25rpx;
	line-height: 20rpx;
	color: #FF983F !important;
	transform:scale(0.8);
	}
	image,img {
	  width: 20rpx;
	  height: 20rpx;
	}
  }
  .certification-personal{
	  height: 36rpx;
	  border: 1rpx solid $mc1;
	  padding:4rpx 4rpx 4rpx 8rpx;
	  border-radius: 40rpx;
	  font-size: 20rpx;
	  background: #E6F7FF;
	  .text{
	    font-size: 25rpx;
      line-height: 20rpx;
      color: #3CC3FF !important;
	    transform:scale(0.8);
	  }
	  image,img {
	    width: 20rpx;
	    height: 20rpx;
	  }
  }
  .personal-certificate-icon {
    margin-top: 16rpx;
    padding:8rpx;
    padding-right: 12rpx;
    background: #E6F7FF;
    border-radius: 10px;
    .text {
      font-size: 24rpx;
      color: #3CC3FF !important;
      line-height: 24rpx;
    }
    img,image{
      width: 28rpx;
      height: 28rpx;
      margin-right: 8rpx;
    }
  }
}

</style>
