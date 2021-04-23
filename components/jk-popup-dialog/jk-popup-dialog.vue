<template>
	<view class="uni-popup-dialog">
		<view class="uni-dialog-bgc" v-if="dialogImage">
			<image :src="dialogImage" style="width:100%;height: 100px;"></image>
		</view>
		<view class="uni-dialog-title" v-if="title">
			<text class="uni-dialog-title-text" :style="{'margin-top':(dialogImage==''?'28px':'')}" :class="[setting?'setting':'']">{{title}}</text>
		</view>
		<view class="uni-dialog-content">
			<text class="uni-dialog-content-text" :style="{'margin-top':(title ==''?'12px':'')}" v-if="mode === 'base'">{{content}}</text>
		</view>
		<view class="uni-dialog-button-group">
			<view class="uni-dialog-button" v-if="oneButton" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">{{textCenter}}</text>
			</view>
			<view class="uni-dialog-button" v-else>
				<view class="uni-dialog-button" @click="close">
					<text class="uni-dialog-button-text">{{textLeft}}</text>
				</view>
				<view class="uni-dialog-button uni-border-left" @click="onOk">
					<text class="uni-dialog-button-text uni-button-color">{{textRight}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * PopUp 弹出层-对话框样式
	 * @description 弹出层-对话框样式
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} value input 模式下的默认值
	 * @property {String} placeholder input 模式下输入提示
	 * @property {String} type = [success|warning|info|error] 主题样式
	 *  @value success 成功
	 * 	@value warning 提示
	 * 	@value info 消息
	 * 	@value error 错误
	 * @property {String} mode = [base|input] 模式、
	 * 	@value base 基础对话框
	 * 	@value input 可输入对话框
	 * @property {String} content 对话框内容
	 * @property {Boolean} beforeClose 是否拦截取消事件
	 * @event {Function} confirm 点击确认按钮触发
	 * @event {Function} close 点击取消按钮触发
	 */

	export default {
		name: "uniPopupDialog",
		props: {
			// 设置的样式
			setting:{
				type: Boolean,
				default: false,
			},
			value: {
				type: [String, Number],
				default: ''
			},
			placeholder: {
				type: [String, Number],
				default: '请输入内容'
			},
			/**
			 * 对话框主题 success/warning/info/error	  默认 success
			 */
			type: {
				type: String,
				default: 'error'
			},
			/**
			 * 对话框模式 base/input
			 */
			mode: {
				type: String,
				default: 'base'
			},
			/**
			 * 对话框背景
			 */
			dialogImage: {
				type: String,
				default: "",
			},
			/**
			 * 对话框按钮（是否只有一个）
			 */
			oneButton: {
				type: Boolean,
				default: false,
			},
			/**
			 * 对话框标题
			 */
			title: {
				type: String,
				default: "",
			},
			/**
			 * 对话框内容
			 */
			content: {
				type: String,
				default: ''
			},
			/**
			 * 对话框操作
			 */
			textLeft: {
				type: String,
				default: "取消"
			},
			textRight: {
				type: String,
				default: "确定"
			},
      textCenter: {
				type: String,
				default: "知道了"
			},
			/**
			 * 拦截取消事件 ，如果拦截取消事件，必须监听close事件，执行 done()
			 */
			beforeClose: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogType: 'error',
				focus: false,
				val: "",
			}
		},
		inject: ['popup'],
		watch: {
			type(val) {
				this.dialogType = val
			},
			mode(val) {
				if (val === 'input') {
					this.dialogType = 'info'
				}
			},
			value(val) {
				this.val = val
			}
		},
		created() {
			// 对话框遮罩不可点击
			this.popup.mkclick = false
			if (this.mode === 'input') {
				this.dialogType = 'info'
				this.val = this.value
			} else {
				this.dialogType = this.type
			}
		},
		mounted() {
			this.focus = true
		},
		methods: {
			/**
			 * 点击确认按钮
			 */
			onOk() {
				this.$emit('confirm', () => {
          this.popup.close()
        })
			},
			/**
			 * 点击取消按钮
			 */
			close() {
				// if (this.beforeClose) {
				// 	this.$emit('close', () => {
				// 		this.popup.close()
				// 	})
				// 	return
				// }
				console.log("你点击了" + this.textLeft)
				this.popup.close()
				if(this.beforeClose) {
					this.$parent.$parent.backFunction&&this.$parent.$parent.backFunction()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/jianzhike/styles/variables.scss";
	.setting{
		margin-top: 96rpx!important;
		font-weight: 500!important;
		font-size: 28rpx!important;
	}
	.uni-popup-dialog {
		width: 560rpx;
		border-radius: $fs2;
    overflow: hidden;
		background-color: #fff;
	}

	/* 没有这一行，会有默认8px的间距 */
	.uni-dialog-bgc {
		height: 100px;
	}

	.uni-dialog-title {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.uni-dialog-title-text {
		font-size: $fs1;
		line-height: $fs1;
		font-weight: 600;
		color: #000000;
		font-family: PingFangSC-Medium, PingFang SC;
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
		margin: 40rpx auto;
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

	.uni-dialog-input {
		flex: 1;
		font-size: 14px;
	}

	.uni-popup__success {
		color: #4cd964;
	}

	.uni-popup__warn {
		color: #f0ad4e;
	}

	.uni-popup__error {
		color: #dd524d;
	}

	.uni-popup__info {
		color: #909399;
	}
</style>
