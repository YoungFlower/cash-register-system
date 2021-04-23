<template>
  <view class="uni-popup-login">
    <view class="uni-dialog-bgc">
      <img :src="loginImg" style="width:100%;height: 250rpx;"/>
    </view>

    <view class="uni-dialog-content">
      <text class="uni-dialog-content-text">立即登录,解锁高薪工作</text>
    </view>
    <view class="uni-dialog-button-group">

      <view class="uni-dialog-button">
        <view class="uni-dialog-button" @click="close">
          <text class="uni-dialog-button-text">取消</text>
        </view>
        <view class="uni-dialog-button uni-border-left">
          <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <text class="uni-dialog-button-text uni-button-color open-type">立即登录</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/config";
import { uploadJcid } from '@co/util.js'
import {createSession} from '@/libs/request'
import {getAccountInfoApi} from '@/api/index'
import {weChatPhoneBindApi, getPhoneNumberApi, weChatLoginApi} from '@/api/weChat'
import {mapState, mapMutations} from 'vuex'

export default {
  name: "uniPopupLogin",
  data() {
    return {
      loginImg: `${config.imgSrc}login-dialog-img.png`
    }
  },
  inject: ['popup'],
  watch: {},
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'systemInfo', 'sessionKeyToken', 'provider','openid'])
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
		
      if (e.detail.encryptedData) {
        createSession().then(session => {
		  	console.log(this.$store.state.openid,'userCode')
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
                    uni.setStorageSync('isApplyResult',true)
                  console.log('账号绑定成功')
				  uploadJcid('autonym')
                  this.close()
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
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/static/jianzhike/styles/variables.scss";

.uni-popup-login {
  width: 560rpx;
  border-radius: $fs2;
  overflow: hidden;
  background-color: #fff;

  uni-button {
    border: none;
    padding: 0;
    bottom: 0;
    background-color: #fff;
  }

  uni-button::after {
    border: none;
  }

  button {
    width: 100%;
    border: none;
    padding: 0;
    bottom: 0;
    background-color: #fff;
  }

  button::after {
    border: none;
  }
}

.uni-dialog-bgc {
  height: 250rpx;
}

.uni-dialog-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.uni-dialog-content-text {
  font-size: $fs3;
  line-height: $fs0;
  font-weight: 500;
  color: #000000;
  margin: 0 24px 43.5px 24px;
  font-family: PingFangSC-Regular, PingFang SC;
}

.uni-dialog-button-group {
  display: flex;
  border-top-color: #D8D8D8;
  border-top-style: solid;
  border-top-width: 1px;
  width: 100%;
  height: 48.5px;
}

.uni-dialog-button {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 48px;
}

.uni-border-left {
  border-left-color: #D8D8D8;
  border-left-style: solid;
  border-left-width: 1px;
}

.uni-dialog-button-text {
  font-size: $fs2;
  color: $tc2;
}

.uni-button-color {
  color: $mc1;
}

</style>
