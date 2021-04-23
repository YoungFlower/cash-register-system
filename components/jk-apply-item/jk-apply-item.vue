<template>
	<view class="jk-job-item">
		<view class="job-list">
			<view @click="gotoJobDetail">
				<view class="job-title text-ellipsis">
					{{job.job_title}}
				</view>
				<view class="flex-row-sb-center" style="margin-top: 12rpx;">
					<view class="salary">
						{{job.salary.salaryStr}}
					</view>
				</view>
				<view class="flex-row-sb-center" style="margin-top: 20rpx;">
					<view class="apply-time">
						报名时间:{{job.stu_apply_resume_time | parseTime}}
					</view>
					<view class="apply-state">
						<view v-if="job.trade_loop_status ==1">
							<view v-if="job.ent_read_resume_time" class="apply-state red">简历被查看</view>
							<view v-else class="apply-state red">已报名</view>

						</view>
						<view v-if="job.trade_loop_status == 2">
							<view class="apply-state red">已录用</view>
						</view>
						<view v-if="job.trade_loop_status == 3 && job.trade_loop_finish_type == 1">
							<view class="apply-state red">已取消报名</view>
						</view>
						<view v-if="job.trade_loop_status == 3 && job.trade_loop_finish_type == 2">
							<view class="apply-state red">已拒绝</view>
						</view>
						<view v-if="job.trade_loop_status == 3 && job.trade_loop_finish_type == 3">
							<view class="apply-state red">已完工</view>
						</view>
						<view v-if="job.trade_loop_status == 3 && job.trade_loop_finish_type == 4">
							<view v-if="job.stu_absent_type == 1">
								<view class="apply-state red">沟通一致</view>
							</view>
							<view v-if="job.stu_absent_type == 2">
								<view class="apply-state red">放鸽子</view>
							</view>
						</view>
						<view v-if="job.trade_loop_status == 3 && job.trade_loop_finish_type == 5">
							<view class="apply-state red">已拒绝</view>
						</view>
						<view v-if="job.trade_loop_status == 3 && job.trade_loop_finish_type == 6">
							<view class="apply-state red">已下架</view>
						</view>
					</view>
				</view>
			</view>
			<view class="gray-line" style="margin-top: 24rpx;"></view>
			<view class="flex-row-sb-center" style="margin-top: 24rpx;">
				<view class="btn-contact" @click="openContact">联系雇主</view>
				<view v-if="job.is_complainted===1" class="report">举报成功</view>
				<view v-else class="report" @click="gotoReportJob">举报</view>
			</view>
		</view>
		<uni-popup ref="popupCopy">
			<jk-popup-dialog v-if="getContactType().type===-1" :dialogImage="dialogImg" :one-button="true" @confirm="close"
			 :title="`${getContactType().str}`">

			</jk-popup-dialog>
			<jk-popup-dialog v-else :one-button="true" :dialogImage="dialogImg" @confirm="copy" :title="`${getContactType().str}:${getContactType().value}`"
			 :content="`已为您复制该${getContactType().str},需由您自行搜索添加`">

			</jk-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupCall">
			<jk-popup-dialog :dialogImage="dialogImg" :title="'联系雇主'" :content="`${getContactType().str}`" :text-right="'拨打'"
			 :text-left="'取消'" @confirm="call"></jk-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import config from "@/config";

	export default {
		components: {},
		props: {
			job: {
				type: Object,
				required: true
			},
		},
		data() {
			return {
				dialogImg: `${config.imgSrc}dialog-img.png`,
				contact: {}
			}
		},
		watch: {},
		methods: {
			//  跳转岗位详情
			gotoJobDetail() {
				this.$router.push({
					path: '/pages/jobDetail/jobDetail',
					query: {
						job_id: this.job.job_id
					}
				})
			},
			// 跳转投诉岗位
			gotoReportJob() {
				this.$router.push({
					path: '/pages/reportJob/reportJob',
					query: {
						job_id: this.job.job_id,
						title: this.job.job_title
					}
				})
			},
			// 获取联系方式
			getContactType() {
				let data = this.job
				let contactData = {}
				if (data.wechat_public) {
					contactData = {
						type: 1,
						value: data.wechat_public,
						str: `微信公众号`
					}
				} else if (data.qq_group) {
					contactData = {
						type: 5,
						value: data.qq_group,
						str: `qq群`
					}
				} else if (data.wechat_number) {
					contactData = {
						type: 2,
						value: data.wechat_number,
						str: `微信号`
					}
				} else if (data.qq_number) {
					contactData = {
						type: 3,
						value: data.qq_number,
						str: `qq号`
					}
				} else if (data.other) {
					contactData = {
						type: 6,
						value: data.other,
						str: `联系方式`
					}
				} else if (data.contact_phone_num) {
					contactData = {
						type: 4,
						value: data.contact_phone_num,
						str: `电话号码为${data.contact_phone_num}`
					}
				} else {
					contactData = {
						type: -1,
						value: '请静候雇主与您联系',
						str: '请静候雇主与您联系'
					}
				}
				this.contact = contactData
				return contactData

			},
			// 打开联系弹窗
			openContact() {
				if (this.contact.type === 4) {
					this.$refs.popupCall.open()
				} else {
					this.$refs.popupCopy.open()
				}

			},
			// 打电话
			call() {
				uni.makePhoneCall({
					phoneNumber: this.contact.value
				});
				this.$refs.popupCall.close()
			},
			// 复制文本
			copy() {
				uni.setClipboardData({
					data: this.contact.value,
					success: () => {
						this.$toast('复制成功')
						this.$refs.popupCopy.close()
					}
				});
			},
			close() {
				this.$refs.popupCopy.close()
			}
		},
		computed: {

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

	.jk-job-item {
		.job-title {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			line-height: 45rpx;
			width: 280rpx;
			height: 92rpx; //高度不能乱写，你要自己去看你的两行文字占多少高度
			overflow: hidden; //一定要写
			text-overflow: ellipsis; //超出省略号
		}

		.salary {
			margin-top: 22rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #FF983F;
			line-height: 32rpx;
		}

		.job-list {
			.job-title {
				width: 100%;
				line-height: 32rpx;
				height: 32rpx;
			}

			.apply-time {
				font-size: 26rpx;
				color: #969999;
				line-height: 26rpx;
			}

			.apply-state {
				font-size: 26rpx;
				color: #3CC3FF;
				line-height: 26rpx;
			}

			.btn-contact {
				width: 160rpx;
				height: 56rpx;
				text-align: center;
				background: #3CC3FF;
				border-radius: 8rpx;
				font-size: 26rpx;
				color: #FFFFFF;
				line-height: 56rpx;
			}

			.report {
				font-size: 28rpx;
				color: #969999;
				line-height: 28rpx;
			}
		}

	}
</style>
