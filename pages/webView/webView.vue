<template>
	<web-view :src="url" v-if="isLoad" />
</template>

<script>
	import {
		putParameterToUrl,
		urlDelParam
	} from '@co/util.js'
	export default {
		components: {},
		mixins: [],
		data() {
			return {
				url: '',
				isLoad: false,
				options: null,
				option: null,
				type: '',
				adName: '',
				shareTitleHere: '',
				page:0
			}
		},
		
		onLoad: function(option) {
			this.setUrlData(option)
		},
		onShow() {
			this.afterPageBack()
		},

		methods: {
			setUrlData(option) {
				this.option= option
				console.log('option', option)
				this.options = option
				this.url = option.url
				this.type = option.type
				this.adName = option.adName
				if (option.title) {
					wx.setNavigationBarTitle({
						title: option.title
					});
				}
				let url = decodeURIComponent(option.url)
				if (url.indexOf('?') > -1 && url.split('?')) {
					const urlPar = url.split('?')[1]
					// 遍历参数取title
					const titlePar = urlPar.split('&')
					titlePar.forEach(e => {
						if (e.split('=')[0] === 'title') {
							this.shareTitleHere = e.split('=')[1]
						}
					})
				}
				if (option.route) {
					let route = option.route
					url = decodeURIComponent(option.url) + '#/' + route
				}
				if (option.param) {
					let param = decodeURIComponent(option.param)
					if (option.param.indexOf(',')) {
						param = param.replace(/,/g, '&')
					}
					url = url + '?' + param
				}
				this.setUrl(url)
			},
			// 页面跳转回来后的操作
			afterPageBack() {
				// 报名操作后的操作
				if (uni.getStorageSync('isApplyResult')) {
					let flag = uni.getStorageSync('isApplyResult')
					uni.setStorageSync('isApplyResult', false)
					if (this.option && this.page && this.url.indexOf('app_user_token') != -1 && flag) {
						// this.isLoad = false
						// this.url = ''
						// this.setUrlData(this.option)
						// let url = encodeURIComponent(this.option.url)
						// uni.redirectTo({
						// 	url:'/pages/webView/webView'
						// })
						console.log(this.option.url)
						this.$router.replace({
							path: '/pages/webView/webView?url='+this.option.url
						})
					}
				}
				this.page = this.page + 1 //保证第一次不重复加载onLoad
			},
			// 设置url内容
			setUrl(url) {
				//  在路径上加sessionId用于自动登录
				// debugger
				uni.getStorage({
					key: 'token',
					success: (res) => {
						url = urlDelParam(url, 'app_user_token')
						// url = putParameterToUrl({
						//     app_user_token: res.data
						// }, url)
						if (url.indexOf('?') == '-1') {
							url = url + '?app_user_token=' + wx.getStorageSync('userToken')
						} else {
							url = url + '&app_user_token=' + wx.getStorageSync('userToken')
						}
						if (url.indexOf('?') == '-1') {
							url = url + '?sessionId=' + res.data
						} else {
							url = url + '&sessionId=' + res.data
						}
					},
					complete: () => {
						console.log('url', url)
						if (this.$store.state.currentCity.id) {
							url = putParameterToUrl({
								city_id: this.$store.state.currentCity.id
							}, url)
						}
						console.log('url', url)
						this.url = url
						this.isLoad = true
					}
				})
			},
			//  设置位置信息
			setLocationInfo(location, cityList, callback, url) {
				let cityInfo = {}
				if (location && getCityId(location.city, cityList)) {
					url = putParameterToUrl({
						city_id: getCityId(location.city, cityList)
					}, url)
					callback(url)
				} else {
					url = putParameterToUrl({
						city_id: getCityId(location.city, 219)
					}, url)
					callback(url)
				}

			},
		},
		onPullDownRefresh: function() {},
		onShareAppMessage() {
			let url = decodeURIComponent(this.options.url)
			url = urlDelParam(url, 'inviteCode')
			url = urlDelParam(url, 'sessionId')
			url = urlDelParam(url, 'app_user_token')
			url = putParameterToUrl({
				inviteCode: app.globalData.userInfo.accountId
			}, url)
			let shareUrl = '/pages/webView/index?url=' + encodeURIComponent(url)
			if (this.type == 'partner') {
				return {
					title: '兼客合伙人 | 现金大奖“职”等你来',
					path: shareUrl,
					imageUrl: 'https://wodan-idc.oss-cn-hangzhou.aliyuncs.com/shijianke-wechat/jiankezhaopin/images/share.png',
				}
			} else {
				let title = this.adName ? this.adName : app.globalData.indexShare.title
				if (this.shareTitleHere) {
					title = this.shareTitleHere
				}
				return {
					title: title,
					path: shareUrl,
				}
			}
		},
	}
</script>

<style>

</style>
