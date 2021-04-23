<template>
	<view class="select-city-jianzhike">
		<view class="uni-indexed-list" ref="list" id="list">

			<!-- #ifdef APP-NVUE -->
			<list class="uni-indexed-list__scroll" scrollable="true" show-scrollbar="false">
				<cell v-for="(list, idx) in lists" :key="idx" :ref="'uni-indexed-list-' + idx">
					<!-- #endif -->
					<!-- #ifndef APP-NVUE -->
					<scroll-view :scroll-into-view="scrollViewId" ref="scrollViewRef" class="uni-indexed-list__scroll" scroll-y
					 @scroll="scrollEvent">
						<view class="uni-indexed-list__title-wrapper uni-indexed-list__scroll-class-item-content">
							<text class="uni-indexed-list__title">当前定位</text>
						</view>
						<view class="current-location flex-row flex-align-center uni-indexed-list__scroll-class-item-content">
							<text v-if="locationCity.name ==='位置获取失败,轻触重新获取'" style="color: #FF983F;height: 36rpx;" @click="getLocation">位置获取失败,轻触重新获取</text>
							<template v-else>
								<image :src="locationIconImg" style="width: 32rpx;height: 32rpx;margin-right: 4px;" @click="locationClick" />
								<text @click="locationClick" style="height: 36rpx;line-height: 36rpx;">{{locationCity.name}}</text>
							</template>

						</view>
						<view v-for="(list, idx) in lists" :key="idx" :id="'uni-indexed-list-' + idx" class="uni-indexed-list__scroll-class-item-content">
							<!-- #endif -->
							<uni-indexed-list-item :list="list" :loaded="loaded" :idx="idx" :showSelect="showSelect" :currentCity="currentCity"
							 @itemClick="onClick"></uni-indexed-list-item>
							<!-- #ifndef APP-NVUE -->
						</view>
					</scroll-view>
					<!-- #endif -->
					<!-- #ifdef APP-NVUE -->
				</cell>
			</list>
			<!-- #endif -->
			<view v-if="itemHeightPx" :class="touchmove ? 'uni-indexed-list__menu--active' : ''" @touchstart="touchStart"
			 @touchmove.stop.prevent="touchMove" @touchend="touchEnd" class="uni-indexed-list__menu">
				<view v-for="(list, key) in lists" :key="key" class="uni-indexed-list__menu-item" :style="{'height': itemHeightPx + 'px'}">
					<text class="uni-indexed-list__menu-text" :class="touchmoveIndex == key ? 'uni-indexed-list__menu-text--active' : ''">{{ list.key }}</text>
					<view v-if="touchmove&&touchmoveIndex == key" class="item-view-position">
						<!-- <view class="item-view-position"> -->
						<view class="uni-indexed-list__alert-wrapper">
							<text class="uni-indexed-list__alert">{{ lists[touchmoveIndex].key || list.key }}</text>
						</view>
						<view class="right-triangle">

						</view>
					</view>
				</view>
			</view>

			<!-- <view v-if="touchmove" class="uni-indexed-list__alert-wrapper">
					<text class="uni-indexed-list__alert">{{ lists[touchmoveIndex].key }}</text>
				</view> -->
		</view>
	</view>

</template>
<script>
	import {
		mapGetters
	} from 'vuex'
	import uniIcons from '../uni-icons/uni-icons.vue'
	import uniIndexedListItem from './select-city-item-jianzhike.vue'
	import citySelectFun from '../../common/citySelect.js'
	import locationIconImg from '@s/img/location-icon.png'
	// // #ifdef APP-NVUE
	// const dom = weex.requireModule('dom');
	// // #endif
	// // #ifdef APP-PLUS
	// function throttle(func, delay) {
	// 	var prev = Date.now();
	// 	return function() {
	// 		var context = this;
	// 		var args = arguments;
	// 		var now = Date.now();
	// 		if (now - prev >= delay) {
	// 			func.apply(context, args);
	// 			prev = Date.now();
	// 		}
	// 	}
	// }

	// function touchMove(e) {
	// 	let pageY = e.touches[0].pageY
	// 	let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
	// 	if (this.touchmoveIndex === index) {
	// 		return false
	// 	}
	// 	let item = this.lists[index]
	// 	if (item) {
	// 		// #ifndef APP-NVUE
	// 		this.scrollViewId = 'uni-indexed-list-' + index
	// 		this.touchmoveIndex = index
	// 		// #endif
	// 		// #ifdef APP-NVUE
	// 		dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
	// 			animated: false
	// 		})
	// 		this.touchmoveIndex = index
	// 		// #endif
	// 	}
	// }
	// const throttleTouchMove = throttle(touchMove, 40)
	// // #endif

	/**
	 * IndexedList 索引列表
	 * @description 用于展示索引列表
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=375
	 * @property {Boolean} showSelect = [true|false] 展示模式
	 * 	@value true 展示模式
	 * 	@value false 选择模式
	 * @property {Object} options 索引列表需要的数据对象
	 * @event {Function} click 点击列表事件 ，返回当前选择项的事件对象
	 * @example <uni-indexed-list options="" showSelect="false" @click=""></uni-indexed-list>
	 */
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons,
			uniIndexedListItem
		},
		props: {
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				lists: [],
				winHeight: 0,
				itemHeight: 0,
				winOffsetY: 0,
				itemHeightRpx: 48,
				touchmove: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmoveTimeout: '',
				loaded: false,
				options: [],
				locationIconImg: locationIconImg,
				optionsCityIdList: [],
				heightIndexArr: []
			}
		},
		watch: {
			options: {
				handler: function() {
					this.setList()
				},
				deep: true
			},
			lists(value) {
				if (value.length > 0) {
					let px = 750 / uni.getSystemInfoSync().windowWidth
					let arryHeight = [parseInt(72 / px + 80 / px)] // “当前定位”高度80rpx  定位信息高度72rpx
					value.forEach((item, index) => { // 计算每个索引项的列表高度
						let itemNumber = parseInt(item.items.length % 3 == 0 ? (item.items.length / 3) : ((item.items.length / 3) + 1))
						let tempHeight = parseInt(80 / px + 5 + 16 + (62 + 22) / px * itemNumber)
						arryHeight.push(tempHeight)
					})
					let heightIndexArr = [] // 以页面滚动距离为索引，列表的索引为值的数组
					let indexI = 0

					arryHeight.forEach((item, index) => {
						let tempIndex = indexI
						for (indexI; indexI < item + tempIndex; indexI++) {
							heightIndexArr.push(index - 1)
						}
					})

					this.heightIndexArr = heightIndexArr
					console.log(heightIndexArr)
				}
			}
		},
		computed: {
			itemHeightPx() {
				const info = uni.getSystemInfoSync()
				return 24 / 603 * info.windowHeight
			},
			...mapGetters(['currentCity', 'locationCity'])
		},
		mounted() {
			setTimeout(() => {
				this.setList()
			}, 50)
			setTimeout(() => {
				this.loaded = true
			}, 300);
			this.cityListInit()
		},
		methods: {
			// 城市列表初始化
			cityListInit() {
				citySelectFun.cityListInit(this)
			},
			setList() {
				if (this.optionsCityIdList.length === 0 || this.options.length === 0) {
					return
				}
				let index = 0;
				let that = this
				this.lists = []
				this.options.forEach((value, index) => {
					if (value.data.length === 0) {
						return
					}
					let indexBefore = index
					let items = value.data.map((item, indexs) => {
						let obj = {}
						obj['key'] = value.letter
						obj['name'] = item
						obj['itemIndex'] = indexs
						obj['id'] = that.optionsCityIdList[index][indexs].id
						obj.checked = item.checked ? item.checked : false
						return obj
					})
					this.lists.push({
						title: value.letter,
						key: value.letter,
						items: items,
						itemIndex: indexBefore
					})
				})
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					.in(this)
					.select('#list')
					.boundingClientRect()
					.exec(ret => {
						this.winOffsetY = ret[0].top
						this.winHeight = ret[0].height
						this.itemHeight = this.winHeight / this.lists.length
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['list'], (res) => {
					this.winOffsetY = res.size.top
					this.winHeight = res.size.height
					this.itemHeight = this.winHeight / this.lists.length
				})
				// #endif
			},
			// 设置索引
			setIndex(e) {
				let pageY = e.touches[0].pageY
				let viewY = this.itemHeightPx * this.optionsCityIdList.length
				let minY = (this.winHeight - viewY) / 2
				pageY = pageY - minY
				if (pageY > viewY || pageY <= 0) {
					return false
				}
				return Math.floor((pageY - this.winOffsetY) / this.itemHeightPx)
			},
			touchStart(e) {
				this.touchmove = true
				// let pageY = e.touches[0].pageY
				// let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
				let index = this.setIndex(e)
				if (index === false) {
					return
				}
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
					// #ifdef APP-NVUE
					dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
						animated: false
					})
					// #endif
				}
			},
			touchMove(e) {
				// #ifndef APP-PLUS
				// let pageY = e.touches[0].pageY
				// let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
				let index = this.setIndex(e)
				if (index === false) {
					return
				}
				if (this.touchmoveIndex === index) {
					return false
				}
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
				}
				// #endif
				// #ifdef APP-PLUS
				throttleTouchMove.call(this, e)
				// #endif
			},
			// 页面滚动锚点定位
			scrollEvent(e) {
				if(!this.touchmove){
					this.touchmoveIndex = this.heightIndexArr[parseInt(e.target.scrollTop)]
					console.log(this.touchmoveIndex,e.target.scrollTop)
				}
				
			},
			touchEnd() {
				setTimeout(()=>{
					this.touchmove = false
				},150)
				
				// this.touchmoveIndex = -1
			},
			onClick(e) {
				let {
					idx,
					index
				} = e
				let obj = {}
				for (let key in this.lists[idx].items[index]) {
					obj[key] = this.lists[idx].items[index][key]
				}
				let select = []
				if (this.showSelect) {
					this.lists[idx].items[index].checked = !this.lists[idx].items[index].checked
					this.lists.forEach((value, idx) => {
						value.items.forEach((item, index) => {
							if (item.checked) {
								let obj = {}
								for (let key in this.lists[idx].items[index]) {
									obj[key] = this.lists[idx].items[index][key]
								}
								select.push(obj)
							}
						})
					})
				}
				// this.$emit('click', {
				// 	item: obj,
				// 	select: select
				// })
				citySelectFun.selectCity(obj)
				this.$router.go(-1)
			},
			// 当前定位选择
			locationClick() {
				if (this.locationCity.name === '正在定位...') {
					return
				}
				citySelectFun.selectCity({
					key: "当前定位",
					itemIndex: 0,
					checked: false,
					...this.locationCity
				})
				this.$router.go(-1)
			},
			// 重新定位
			getLocation() {
				citySelectFun.getLocation()
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "@s/styles/index.scss";

	.uni-indexed-list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__scroll {
		flex: 1;
	}

	.uni-indexed-list__menu {
		width: 30px;
		/* background-color: lightgrey; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: absolute;
		top: 0;
		right: 0;
		background: rgba(255, 255, 255, 0.5);
		/* background: #FFFFFF; */
		height: 100%;
		justify-content: center;

	}


	.uni-indexed-list__menu-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;

	}

	.item-view-position {
		position: absolute;
	}

	.uni-indexed-list__menu-text {
		font-size: 12px;
		line-height: 36rpx;
		text-align: center;
		color: #333333;
	}

	.uni-indexed-list__menu--active {
		background: rgba(255, 255, 255, 0.5);
	}

	.uni-indexed-list__menu-text--active {
		color: #FFFFFF;
		background: #3CC3FF;
		border-radius: 20rpx;
		padding: 0 4rpx;
		min-width: 36rpx;
		height: 36rpx;
	}

	.uni-indexed-list__alert-wrapper {
		position: absolute;
		top: -20px;
		right: 32px;
		min-width: 40px;
		height: 40px;
		border-radius: 8px;
		background-color: $tc2;
		display: flex;
		white-space: nowrap;
		align-items: center;
		justify-content: center;
	}

	.uni-indexed-list__alert {
		padding: 0 8px;
		font-size: 28px;
		color: #fff;
	}

	.right-triangle {
		position: absolute;
		top: -8px;
		right: 24px;
		width: 0;
		height: 0;
		border-top: 8px solid transparent;
		border-bottom: 8px solid transparent;
		border-left: 8px solid #3CC3FF;
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

	.current-location {
		padding: 13px 15px;
	}
</style>
