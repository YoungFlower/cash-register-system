<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key == '热门'?'热门城市':list.key }}</text>
		</view>
		<!-- <view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
					<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<view v-if="showSelect" style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
						</view>
						<text class="uni-indexed-list__item-content">{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view> -->

		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="city-list">
			<view v-for="(item, index) in list.items" :key="index" class="city-list-item text-ellipsis-nowarp" :class="[currentCity.id == item.id? 'city-list-item-active' : '']"
			 @click="onClick(idx, index)">
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			...mapGetters(['currentCity'])
		},
		methods: {
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			}
		}
	}
</script>

<style scoped>
	.city-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin: 5px 0 16px 0;
	}

	.city-list-item {
		text-align: center;
		line-height: 62rpx;
		width: 198rpx;
		height: 62rpx;
		margin: 22rpx 0 0 30rpx;
		padding: 0 12px;
		background: #F7F8F8;
		border-radius: 8rpx;
		overflow: hidden;
		border: 1rpx solid #F7F8F8;
	}

	.uni-indexed-list__list {
		background-color: #ffffff;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-indexed-list__item {
		font-size: 16px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding-left: 15px;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: 15px;
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #e5e5e5;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #f7f7f7;
	}

	.uni-indexed-list__title {
		padding: 0 30rpx;
		line-height: 80rpx;
		font-size: 14px;
		color: #969999;
		height: 80rpx;
	}

	.city-list-item-active {
		background: #E6F7FF;
		border-radius: 8rpx;
		color: #3CC3FF;
		border: 1rpx solid #3CC3FF;
	}
</style>
