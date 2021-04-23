<template>
  <view class="jk-employer-item" @click="gotoeEployerInfoPage">
   <div class="flex-row">
     <div class="profile">
       <img :src="employerInfo.profile_url" alt="">
     </div>
     <div class="info flex-col flex-col-center" style="width: 542rpx;">
       <div class="name">
         {{employerInfo.true_name || ''}}
       </div>
       <div class="flex-row" style="margin-top: 16rpx;">
         <text>{{employerInfo.industry_name}}</text>
         <text v-if="employerInfo.job_ing_count>0" style="margin-left: 24rpx;">{{`在招${employerInfo.job_ing_count}个岗位`}}</text>
       </div>
       <div class="flex-row flex-align-center" style="margin-top: 12rpx;max-width: 100%;">
         <div class="text-ellipsis-nowarp" style="margin-bottom: 8rpx;margin-top: 4rpx;margin-right: 16rpx;" 
		 :style="{'max-width':(526-(employerInfo.verifiy_status===3?104:0)-(employerInfo.id_card_verify_status===3?160:0))+'rpx'}">
		 <!-- <span v-html="setRed(employerInfo.enterprise_name,searchText)"></span> -->
		 <span v-if="searchText" class="text-ellipsis" style="width: 100%;" v-html="setRed(employerInfo.enterprise_name,searchText)"></span>
		 <span v-else>{{employerInfo.enterprise_name}}</span>
		 </div>
         <jk-btn-certification v-if="employerInfo.verifiy_status===3" :type="'company'" :style="{'margin-right': employerInfo.id_card_verify_status===3?16:0 +'rpx'}" ></jk-btn-certification>
		 <jk-btn-certification v-if="employerInfo.id_card_verify_status===3"  type="person" :marginTop="false"></jk-btn-certification>
       </div>
     </div>
   </div>
  </view>
</template>

<script>
import config from "@/config";
export default {
  components: {},
  props:{
    employerInfo:{type:Object,required:true},
	searchText: {
		type: String,
		default: ''
	}
  },
  watch: {},
  methods: {
    gotoeEployerInfoPage(){
      this.$router.push({path:'/pages/employerInfo/employerInfo',query:{accountId:this.employerInfo.account_id}})
    },
	setRed(value,searchText) {
		console.log(value)
		if (value.indexOf(searchText) != -1) {
			let reg = new RegExp(searchText, "g");
			value = value.replace(reg, '<span class="font-color-mc1">' + searchText + '</span>')
		}
		return '<div class="rich-text">'+value+'</div>'
	}
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
.jk-employer-item {
	.rich-text{
		overflow: hidden; //一定要写
		text-overflow: ellipsis; //超出省略号
	}
  .profile {
    img,image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      overflow: hidden;

    }
  }
  .info {
    margin-left: 24rpx;
    .name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333333;
      line-height: 32rpx;
    }
    text {
      font-size: 26rpx;
      color: #969999;
      line-height: 26rpx;
    }
  }
  .font-color-mc1{
  	color: $mc1;
  }
}
</style>
