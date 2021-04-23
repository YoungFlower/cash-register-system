<template>
  <view class="uni-popup-login-phone">
    <view class="uni-dialog-bgc">
      <img :src="loginImg" style="width:100%;height: 100px;"/>
    </view>

    <view class="uni-dialog-content">
      <text class="uni-dialog-content-text">立即登录,解锁高薪工作</text>
    </view>
    <view style="padding: 16px;">
      <view class="input-row">
        <text class="text">手机号</text>
        <u-input  v-model="phone"   type="number" placeholder="输入手机号" maxlength="11"/>
      </view>
      <view class="input-row vCode" >
        <text class="text">动态密码</text>
        <div class="flex-row">
          <u-input  v-model="code"   type="text" placeholder="输入动态密码" maxlength="6"/>
          <text v-if="!isSend" class="getVCode" @click="sendCode">获取验证码</text>
          <text v-else class="getVCode" @click="sendCode">{{second}}</text>
        </div>

      </view>
      <div class="btn-big" @click="loginPhone" style="width: 500rpx;margin-top: 32rpx;">登录</div>
    </view>

  </view>
</template>

<script>
import config from "@/config";
import {createSession} from '@/libs/request'
import {getAccountInfoApi,getSmsAuthenticationCodeApi,loginByphoneApi} from '@/api/index'
import {weChatPhoneBindApi, getPhoneNumberApi, weChatLoginApi} from '@/api/weChat'
import {mapState, mapMutations} from 'vuex'

export default {
  name: "uniPopupLogin",
  data() {
    return {
      loginImg: `${config.imgSrc}login-dialog-img.png`,
      phone:'',
      code:'',
      isSend:false,
      second:60
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
    // 发送验证码
    sendCode() {
      console.log(this.phone)
      if (new RegExp(/^1[3456789]\d{9}$/).test(this.phone) && this.phone) {
        let param = {
          port:'weChat',
          phone_num: this.phone,
          opt_type: 7,
          user_type: 2
        }
        createSession().then(session => {
          this.$store.commit('setSessionKeyToken', session.content.sessionId)
          uni.setStorageSync('token', session.content.sessionId);
          getSmsAuthenticationCodeApi(param).then(res => {
            if (res.data.errCode == 0) {
              this.isSend = true
              var t = setInterval(() => {
                if (this.second <= 0) {
                  clearInterval(t)
                  this.second = 60
                  this.isSend = false
                  return
                }
                this.second--
              }, 1000)
            } else if (res.data.errCode == 59) {
              uni.showToast({
                title: res.rspMsg,
              });
            } else {
              uni.showToast({
                title: '您的账号异常，请稍后重试',
              });
            }
          })
        })
        } else {
        uni.showToast({
          title: '请输入正确的手机号码',
        });
      }
    },
    // 登录
    loginPhone() {
      if(this.phone&&this.code){
        let param = {
          username: this.phone,
          dynamic_sms_code: this.code,
          user_type: 2,
        }
        loginByphoneApi(param).then(res=> {
          this.close()
          this.login()
          getAccountInfoApi().then(res => {
            if (res.data.errCode === 0) {
              uni.setStorageSync('usreInfo', res.data.content);
              this.setUserInfo(res.data.content)
            }
          })
        })
      }
    },

  },
}
</script>

<style lang="scss" scoped>
@import "@/static/jianzhike/styles/variables.scss";

.uni-popup-login-phone {
  width: 600rpx;
  border-radius: $fs2;
  overflow: hidden;
  background-color: #fff;
  .getVCode {
    color: #3CC3FF;
  }
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
  height: 100px;
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
