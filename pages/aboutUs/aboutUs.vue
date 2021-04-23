<template>
	<view class="page-aboutus">
		<u-navbar title="关于我们"></u-navbar>
		<view class="product-info flex-col-center flex-align-center">
			<view class="logo flex-center-center">
				<img :src="logoImg" alt="">
			</view>
			<view class="product-name">轻工作</view>
			<view class="version">Version:V1.0.0</view>
		</view>
		<view style="width: 100%;background: #F5F7F7;">
			<view style="width:100%;padding:0 30rpx;background: #FFFFFF;border-radius:32rpx;">
				<view class="flex-row flex-row-sb-center position-relative cell-style" style="height: 112rpx;" @click="gotoPage('/pages/webView/webView?title=用户协议&url=https://www.jianke.cc/assets/jianzhike/userAgreement.html')">
					<view class="navigator-text">用户协议</view>
					<image :src="grayRightIconImg" style="width: 24rpx;height: 24rpx;"></image>
				</view>
				<view class="flex-row flex-row-sb-center position-relative cell-style" style="height: 112rpx;" @click="gotoPage('/pages/webView/webView?title=隐私协议&url=https://www.jianke.cc/assets/jianzhike/privacyPolicy.html')">
					<view class="navigator-text">隐私政策</view>
					<image :src="grayRightIconImg" style="width: 24rpx;height: 24rpx;"></image>
				</view>
				<view class="flex-row flex-row-sb-center position-relative cell-style" style="height: 112rpx;" @click="gotoPage('/pages/webView/webView?title=证件信息&url=https://www.jianke.cc/assets/jianzhike/certificateListJZK/index.html')">
					<view class="navigator-text">证件信息</view>
					<image :src="grayRightIconImg" style="width: 24rpx;height: 24rpx;"></image>
				</view>
			</view>
		</view>
		<!-- <u-cell-group>
      <u-cell-item  title="用户协议" @click="gotoPage('/pages/webView/webView?title=用户协议&url=https://www.jianke.cc/assets/jianzhike/privacyPolicy.html')"></u-cell-item>
      <u-cell-item  title="隐私政策" @click="gotoPage('/pages/webView/webView?title=隐私协议&url=https://www.jianke.cc/assets/jianzhike/userAgreement.html')"></u-cell-item>
      <u-cell-item  title="证件信息" @click="gotoPage('/pages/webView/webView?title=证件信息&url=https://www.jianke.cc/assets/jianzhike/certificateListJZK/index.html')"></u-cell-item>
    </u-cell-group> -->
		<div class="company-info">
			福州鼎嘉人力资源服务有限公司版权所有
		</div>
	</view>

</template>

<script>
	import config from "@/config";
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {},
		data() {
			return {
				logoImg: `${config.imgSrc}logo-img.png`,
				grayRightIconImg: `${config.imgSrc}gray-right-icon.png`,
				options: {}
			}
		},
		watch: {},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'systemInfo'])
		},
		methods: {
			gotoPage(url, needLogin) {
				if (this.hasLogin || !needLogin) {
					this.$router.push({
						path: url
					})
				} else if (needLogin && !this.hasLogin) {
					this.openLogin()
				}
			},
		},
		onLoad(options) {
			this.options = options
		},
		onReady() {},
		onShow() {},
		onHide() {},
		onUnload() {},
		onReachBottom() {},
		onPullDownRefresh() {},
		onShareAppMessage() {}
	}
</script>

<style lang="scss">
	@import "@s/styles/index.scss";

	.page-aboutus {

		.cell-style {
			border-bottom: 1rpx solid #E6E6E6;
			background: #FFFFFF;
		}

		.product-info {
			background-color: #F5F7F7;
			height: 392rpx;
		}

		.logo {
			width: 160rpx;
			height: 160rpx;
			background: #D8D8D8;
			border-radius: 50%;
			border: 4rpx solid #C1ECFF;

			img,
			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}
		}

		.product-name {
			margin-top: 32rpx;
			font-size: 32rpx;
			font-weight: 600;
			color: #333333;
			line-height: 32rpx;
		}

		.version {
			margin-top: 24rpx;
			font-size: 24rpx;
			color: #333333;
			line-height: 24rpx;
		}

		.company-info {
			width: 100%;
			position: fixed;
			bottom: 32rpx;
			text-align: center;
			font-size: 24rpx;
			color: #969999;
			line-height: 33rpx;

		}

	}
</style>
