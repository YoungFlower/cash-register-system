<template>
	<view class="popup-apply-list" v-if="show">
		<u-popup v-model="show" mode="bottom" border-radius="32" :closeable="true" :mask-close-able="false">
			<view class="flex-row-no-wrap flex-center-center font-color-mc1" style="padding:40rpx 30rpx 0 30rpx;">
				<image :src="pickUpImg" style="width: 184rpx;height: 152rpx;margin-right: 24rpx;"/>
				<view>
					<view style="font-size: 32rpx;">
						提交成功,多投几个岗位
					</view>
					<view class="flex-row flex-align-center">
						<image :src="admissionImg" style="width: 32rpx;height: 32rpx;margin-right: 16rpx;font-size: 24rpx;"></image>
						录取率+65%
					</view>
				</view>
			</view>
			<view style="padding:0 30rpx;">
				<view class="item-view flex-row-no-wrap flex-align-center flex-row-sb" v-for="(item,index) in list" :key="index" @click="clickCheck(index)">
					<view class="flex-row-no-wrap flex-align-center" style="width: 410rpx;">
						<image v-show="item.check" :src="checkImg"/>
						<image v-show="!item.check" :src="unCheckImg"/>
						<view class="text-ellipsis-nowarp font-color-tc1" style="width: 354rpx;">
							{{item.jobTitle}}
						</view>
					</view>
					<view class="text-ellipsis-nowarp font-color-mc2" style="width: 280rpx;text-align: end;">
						{{item.jobSalary}}
					</view>
				</view>
			</view>
			<!-- 保存按钮 -->
			<view class="button-save" @click="save">
				下一步
			</view>
		</u-popup>
	</view>
</template>

<script>
	
	import {applyListFun} from '@co/signUp.js'
	import config from "@/config";
	export default {
		data() {
			return {
				show: false,
				pickUpImg: `${config.imgSrc}pick-up.png`,
				admissionImg: `${config.imgSrc}admission.png`,
				checkImg: `${config.imgSrc}check.png`,
				unCheckImg: `${config.imgSrc}un-check.png`,
				list:[],
				// list: [{
				// 	jobTitle:'1111111111111111撒发发发嘎嘎',
				// 	jobSalary:'1233元-1515元/天',
				// 	"jobId":930492,
				// },{
				// 	jobTitle:'1111111111111111撒发发发嘎嘎',
				// 	jobSalary:'1233元-1515元/天',
				// 	"jobId":930492,
				// },{
				// 	jobTitle:'1111111111111111撒发发发嘎嘎',
				// 	jobSalary:'1233元-1515元/天',
				// 	"jobId":930492,
				// },{
				// 	jobTitle:'1111111111111111撒发发发嘎嘎撒发发发嘎嘎',
				// 	jobSalary:'1233元-1515元/天',
				// 	"jobId":930492,
				// },{
				// 	jobTitle:'11111111111111111111111111111111撒发发发嘎嘎',
				// 	jobSalary:'1233元-1515元/天',
				// 	"jobId":930492,
				// }]
			};
		},
		methods:{
			openApplyList(list) {
				list.forEach((item,index) => {
					item.check = true
				})
				console.log(list)
				this.list = list
				this.show = true
			},
			clickCheck(index) {
				let list = this.list
				list[index].check = !list[index].check
				this.list = JSON.parse(JSON.stringify(list))
			},
			closeApplyList() {
				this.show = false
			},
			// 保存空list
			saveEmptyList() {
				applyListFun(this,[])
			},
			// 下一步
			save() {
				let list = this.list
				let jobIdArry= []
				list.forEach((item,index) => {
					if(item.check == true) {
					jobIdArry.push(item.jobId)
					}
					
				})
				// console.log(jobIdArry)
				// jobIdArry = JSON.stringify([930492])
				// jobIdArry = ['930492','930492']
				// jobIdArry=[]
				applyListFun(this,jobIdArry)
			}
		}
	}
</script>

<style lang="scss">
@import "@s/styles/index.scss";
.popup-apply-list{
	.font-color-mc1{
		color: $mc1;
	}
	.button-save {
		width: 690rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: $mc1;
		color: #FFFFFF;
		text-align: center;
		line-height: 88rpx;
		font-size: 32rpx;
		font-weight: 600;
		margin: $fs0 30rpx;
	}
	.item-view{
		padding-top:44rpx;
		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 24rpx;
		}
	}
	.font-color-tc1{
		color: $tc1;
	}
	.font-color-mc2{
		color: $mc2;
		font-weight: 600;
	}
}
</style>
