<!-- 我的报名中item封装 -->
<template>
	<view class="uni-jobList-item">
		<text class="uni-listItem-title">{{jobItem.title}}</text>
		<text class="uni-listItem-price">{{jobItem.price}}</text>
		<view class="uni-listItem-time">
			<text class="time">报名时间:{{jobItem.time}}</text>
			<text class="status">{{jobItem.status == 1?"简历被查看":"已报名"}}</text>
		</view>
		<hr />
		<view class="uni-listItem-do">
			<button class="button" @click="toEmployer()">联系雇主</button>
			<text class="report" @click="toReport()">举报</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "jobListItem",
		props: {
			jobItem: {
				type: Object,
				// required: true,
				default: function() {
					return {
						title: "手机兼职小任务，高薪立做，简单易做，高薪立做，简单易做，高薪立做，简单易做",
						price: "400元/天",
						time: "2020-05-15 00:00:00",
						status: 1,
					}
				}
			}
		},
		data() {
			return {

			};
		},
		methods: {
			toEmployer() {
				console.log("你点击了联系雇主")
				// this.$emit("toEmployer",12345678)
			},
			toReport() {
				console.log("你点击了举报")
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/jianzhike/styles/variables.scss";

	.uni-jobList-item {
		margin: 0 15px;
		display: flex;
		flex-direction: column;
		background: #cacaca;
		// background: #FFFFFF;
		border-radius: 8px;
		font-family: PingFangSC-Medium, PingFang SC;

		.uni-listItem-title {
			font-size: $fs2;
			font-weight: 600;
			color: $tc1;
			line-height: $fs2;
			margin: $fs2 0 $fs5 15.5px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.uni-listItem-price {
			margin: 0 0 10px 15.5px;
			font-size: $fs2;
			font-weight: 600;
			color: $mc2;
			line-height: $fs2;
		}

		.uni-listItem-time {
			font-size: $fs4;
			font-weight: 500;
			line-height: $fs4;

			.time {
				margin-left: 15.5px;
				color: $tc2;
			}

			.status {
				float: right;
				margin-right: $fs2;
				color: $mc1;
			}
		}

		.uni-listItem-do {
			margin-bottom: $fs2;
			display: flex;
			align-items: center;

			.button {
				// width: 80px;
				// height: 28px;
				line-height: 28px;
				background: $mc1;
				border-radius: 4px;
				font-size: $fs4;
				font-weight: 500;
				color: #FFFFFF;
				float: left;
				margin-left: $fs2;

			}

			.report {
				font-size: $fs3;
				font-weight: 500;
				color: $tc2;
				float: right;
				margin-right: $fs2;
			}
		}

		hr {
			height: 1px;
			border: none;
			background: #E6E6E6;
			margin: $fs5 $fs2;
		}
	}
</style>
