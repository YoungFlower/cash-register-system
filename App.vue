<script>
import { mapMutations } from 'vuex'
import { weChatLoginApi } from '@/api/weChat'
import { getAccountInfoApi } from '@/api/index'
import { getCityListApi, getGlobalInfoApi } from '@/api/index'
import { createSession } from '@/libs/request'
// import {
//   $getMapInfo
// } from '@/libs/mapInfo'
import { getLocation } from '@co/citySelect.js'
export default {
  onLaunch: function(option) {
    uni.getSystemInfo({
      success: res => {
        this.$store.commit('setSystemInfo', res)
      }
    })
  },
  onPageNotFound(res) {
    this.$toast({
      title: '页面不存在,将返回首页',
      icon: 'none',
      duration: 2000,
      success: () => {
        this.$router.push({ path: '/pages/tabBar/index/index' })
      }
    })
  },
  onShow: function() {},
  onHide: function() {},
  methods: {
    ...mapMutations(['login', 'setSessionKeyToken', 'setUserInfo']),
    loadAd() {},
    // 静默登录(通过判断是否有用户信息缓存判断)
    wxLogin() {
      if (!this.sessionKeyToken && uni.getStorageSync('usreInfo')) {
        createSession().then(session => {
          uni.login({
            provider: this.$store.state.provider,
            success: loginRes => {
              this.$store.commit('setOpenid', loginRes.code)
              let params = {
                code: loginRes.code,
                login: 1
              }
              weChatLoginApi(params).then(res => {
                this.getUserInfo(session)
                this.$store.dispatch('getGlobalInfo')
              })
            }
          })
        })
      } else {
        createSession()
      }
      this.$store.dispatch('getGlobalInfo')
    },
    // 获取用户信息
    getUserInfo(session) {
      getAccountInfoApi().then(res => {
        if (res.data.errCode === 0) {
          console.log('静默登录成功')
          this.login()
          // #ifndef H5
          this.$store.commit('setSessionKeyToken', session.content.sessionId)
          uni.setStorageSync('token', session.content.sessionId)
          // #endif
          this.setUserInfo(res.data.content)
        } else {
          this.$store.dispatch('getUserOpenId')
          console.log('静默登录失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';
@import 'uview-ui/index.scss';
/*@import '/common/styles/index.scss';*/

/* #endif*/


$color1: #00bfff;
$color2: #87cefa;
$color3: #00ffff;
$color4: #add8e6;
$color5: #b0e0e6;
$color6: #afeeee;
.back-color{


  background: $color6; /* Old browsers */
  background: -moz-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
      $color3 46%,
    $color3 46%,
    $color4 56%,
      $color5 92%,
    $color6 100%
  ); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left bottom,
    right top,
    color-stop(0%, $color1),
    color-stop(17%, $color2),
    color-stop(46%, $color3),
    color-stop(46%, $color3),
    color-stop(56%, $color3),
    color-stop(92%, $color2),
    color-stop(100%, $color6)
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
    $color3 46%,
    $color3 46%,
    $color4 56%,
    $color5 92%,
    $color6 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
    $color3 46%,
    $color3 46%,
    $color4 56%,
    $color5 92%,
    $color6 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    45deg,
     $color1 0%,
    $color2 17%,
    $color3 46%,
    $color3 46%,
    $color4 56%,
    $color5 92%,
    $color6 100%
  ); /* IE10+ */
  background: linear-gradient(45deg,  $color1 0%, $color2 17%, $color3 46%, $color3 46%, $color4 56%, $color5 92%, $color6 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$color1', endColorstr='$color6',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

}
</style>
