<template>
	<button v-if="!hasLogin" class="jk-btn-login-transparent" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"></button>
</template>

<script>
	import config from "@/config";
	import {
		createSession
	} from '@/libs/request'
	import {
		getAccountInfoApi
	} from '@/api/index'
	import {
		weChatPhoneBindApi,
		getPhoneNumberApi,
		weChatLoginApi
	} from '@/api/weChat'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		uploadJcid
	} from '@co/util.js'
	export default {
		name: "uniPopupLogin",
		data() {
			return {
				loginImg: `${config.imgSrc}login-dialog-img.png`
			}
		},
		watch: {},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'systemInfo', 'sessionKeyToken', 'provider', 'openid'])
		},
		created() {

		},
		mounted() {

		},
		methods: {
			...mapMutations(['login', 'setUserInfo']),
			close() {
				this.popup.close()
			},
			getPhoneNumber(e) {
				this.$store.dispatch('getUserOpenId', () => {
					if (e.detail.encryptedData) {
						createSession().then(session => {
							console.log(this.$store.state.openid, 'userCode')
							weChatLoginApi({
								code: this.$store.state.openid,
								login: 0
							}).then(res => {
								let open_id = res.data.content.open_id
								let oauth_id = res.data.content.oauth_id
								let iv = e.detail.iv
								let param = {
									open_id: open_id,
									encrypted_data: e.detail.encryptedData,
									iv: iv,
								}
								getPhoneNumberApi(param).then(res1 => {
									let phone = res1.data.content.phone_num
									let param2 = {
										username: phone,
										user_type: 2,
										dynamic_sms_code: '',
										oauth_id: oauth_id,
										iv: iv
									}
									weChatPhoneBindApi(param2).then(res2 => {
										if (res2.data.errCode === 0) {
											console.log('账号绑定成功')
											uploadJcid('autonym')
											this.login()
											this.$store.commit('setSessionKeyToken', session.content.sessionId)
											uni.setStorageSync('token', session.content.sessionId);
											getAccountInfoApi().then(res => {
												if (res.data.errCode === 0) {
													uni.setStorageSync('usreInfo', res.data.content);
													this.setUserInfo(res.data.content)
												}
											})

										} else {
											console.log('账号绑定失败')
										}

									})
								});
							})
						})
					} else {
						wx.showToast({
							title: '授权失败,请重新授权',
							icon: 'none'

						})
					}
				})

			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "@/static/jianzhike/styles/variables.scss";

	.jk-btn-login-transparent {
		position: absolute;
		height: 100%;
		width: 100%;
		opacity: 0;
		top: 0;
		left: 0;
	}
</style>
