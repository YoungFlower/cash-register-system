<template>
	<view class="jk-job-item">
		<view v-if="type==='card'" class="job-card" @click="gotoJobDetail">
			<view class="company-name flex-align-center text-ellipsis-nowarp">{{job.enterprise_info.enterprise_name}}</view>
			<view class="job-body">
				<view class="job-title-card">
					{{job.job_title}}
				</view>
				<view class="salary">
					{{job.salary.salaryStr}}
				</view>
				<view class="label flex-row">
					<view class="label-item">
						{{ job.job_classfie_name}}
					</view>
					<view class="label-item">
            {{ job.job_rank_type_str}}
					</view>
				</view>
			</view>
		</view>
		<view v-if="type==='list'" class="job-list" @click="gotoJobDetail" style="margin-top: 0;">
			<view class="job-title text-ellipsis">
				<!-- {{setRed(job.job_title,searchText)}} -->
				<span v-if="searchText" class="text-ellipsis" style="width: 100%;" v-html="setRed(job.job_title,searchText)"></span>
				<span v-else>{{job.job_title}}</span>
			</view>
			<div class="flex-row-sb-center flex-row-no-wrap flex-align-end">
				<view class="flex-col" style="width: 75%;">

					<view class="salary">
						{{job.salary.salaryStr}}
					</view>
					<view v-if="(job.address_area_name || job.city_name)&&job.job_classify_type!=1" class="location-style flex-row flex-align-center">
						<image :src="locationImg" style="width: 26rpx;height: 26rpx;margin-right: 8rpx;" />{{job.address_area_name || job.city_name}}
					</view>
					<!-- 线下全职 -->
					<view class="text-ellipsis-nowarp" v-if="job.job_classify_type==3&&job.job_tags.length>0"
					 :style="{'margin-top': (job.address_area_name || job.city_name)&&job.job_classify_type!=1?'14rpx':'20rpx'}"
					 style="width: 100%;">
						<text v-for="(item,index) in job.job_tags" class="tag-item">
							{{item.tag_title}}
						</text>
					</view>
					<!-- 线下兼职 -->
					<view class="text-ellipsis-nowarp" v-if="job.job_classify_type==2"
					 :style="{'margin-top': (job.address_area_name || job.city_name)&&job.job_classify_type!=1?'14rpx':'20rpx'}"
					 style="width: 100%;">
						<text v-if="job.salary.settlement_value" class="tag-item">{{job.salary.settlement_value}}</text>
						<text v-if="job.dead_time_start_end_str" class="tag-item">{{job.dead_time_start_end_str | filterTime}}</text>
					</view>
				</view>
				<template v-if="showApply&&gloabData.job_list_apply">

					<view v-if="!hasApply" class="btn-apply position-relative" @click.stop="apply">
						<jk-btn-login-transparent />
						报名
					</view>
					<view v-else="hasApply" class="dis-btn-apply">
						已报名
					</view>
				</template>
			</div>

			<uni-popup ref="login">
				<jk-popup-login></jk-popup-login>
			</uni-popup>

		</view>

		<workTimeSelect ref="workTimeSelect" />
		<popupApplyList ref="popupApplyList" />
	</view>
</template>

<script>
	import config from "@/config";
	import {
		mapState
	} from 'vuex'
	import workTimeSelect from '@cps/jk-work-time-select/jk-work-time-select'
	import popupApplyList from '@cps/jk-popup-apply-list/jk-popup-apply-list'
	import {
		applyReady
	} from '@co/signUp.js'
	export default {
		components: {
			workTimeSelect,
			popupApplyList
		},
		props: {
			type: {
				type: String,
				default: 'list'
			},
			job: {
				type: Object,
				required: true
			},
			showApply: {
				type: Boolean,
				default: true
			},
			searchText: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				locationImg: `${config.imgSrc}location.png`,
				hasApply: false
			};
		},
		watch: {
			applyIdArr(value) {
				this.hasApply = value.indexOf(this.job.job_uuid) != -1
			}
		},
		computed: {
			...mapState(['gloabData', 'applyIdArr'])
		},
		methods: {
			gotoJobDetail() {
				this.$router.push({
					path: '/pages/jobDetail/jobDetail',
					query: {
						job_id: this.job.job_id
					}
				})
			},
			// 报名
			apply() {
				applyReady(this, this.job)
			},
			// 打开登录弹窗
			openLogin() {
				this.$store.dispatch('getUserOpenId')
				this.$refs.login.open()
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
		mounted() {},
		activated() {
			console.log('1111111111111111111111111111111111111111111111111111111111111111')
		},
		onLoad(options) {
			this.options = options
		},
		filters: {
			filterTime(value) {
				value = value.replace(/\//g, "月")
				value = value.replace('-', '日至')
				value = value + '日'
				return value
			},
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

	.jk-job-item {
		.rich-text{
			overflow: hidden; //一定要写
			text-overflow: ellipsis; //超出省略号
		}
		.job-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #333333;
			line-height: 45rpx;
			width: 280rpx;
			height: 92rpx; //高度不能乱写，你要自己去看你的两行文字占多少高度
			overflow: hidden; //一定要写
			text-overflow: ellipsis; //超出省略号
		}

		.job-title-card {
			font-size: 32rpx;
			font-weight: 600;
			color: #333333;
			line-height: 45rpx;
			width: 280rpx;
			height: 92rpx; //高度不能乱写，你要自己去看你的两行文字占多少高度

			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			word-wrap: break-word;
			white-space: normal !important;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.salary {
			margin-top: 22rpx;
			font-size: 32rpx;
			font-weight: 600;
			color: #FF983F;
			line-height: 32rpx;
		}

		.tag-item {
			background: $mc5;
			color: $tc2;
			padding: 8rpx;
			margin-right: 16rpx;
			border-radius: 4rpx;
		}

		.job-card {
			width: 337rpx;
			height: 375rpx;
			border-radius: 16rpx;
			overflow: hidden;

			.company-name {
				// width: 375rpx;
				height: 80rpx;
				padding: 28rpx 24rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FF983F;
				background-color: #FFEEE0;
				line-height: 28rpx;
			}

			.job-body {
				margin-top: -8rpx;
				padding: 32rpx 24rpx;
				background-color: #FFFFFF;
				border-radius: 16rpx;

				.label {
					margin-top: 47rpx;

					.label-item {
						padding: 8rpx;
						margin-right: 16rpx;
						background: #F7F8F8;
						border-radius: 4rpx;
						font-size: 24rpx;
						color: #989999;
						line-height: 24rpx;
					}
				}
			}
		}

		.job-list {
			.job-title {
				width: 100%;
				line-height: 32rpx;
				height: 32rpx;
			}

			.btn-apply {
				height: 56rpx;
				padding: 0 34rpx;
				background: #3CC3FF;
				border-radius: 8rpx;
				font-size: 26rpx;
				color: #FFFFFF;
				line-height: 56rpx;
			}

			.dis-btn-apply {
				height: 56rpx;
				padding: 0 34rpx;
				background: #DCE0E0;
				border-radius: 8rpx;
				font-size: 26rpx;
				color: #FFFFFF;
				line-height: 56rpx;
			}
		}
		.font-color-mc1{
			color: $mc1;
		}
		.location-style{
			color: $tc2;
			font-size: 26rpx;
			line-height: 26rpx;
			height: 26rpx;
			margin-top: 20rpx;
		}
	}
</style>
