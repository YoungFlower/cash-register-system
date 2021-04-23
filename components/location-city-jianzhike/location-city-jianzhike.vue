<template>
	<view class="location-city" :style="{'height':windowHeight + 'px'}">
		<!-- 顶部定位相关 -->
		<view style="width:100%;height:208rpx;padding:24rpx 30rpx 30rpx 32rpx;">
			<view class="title">当前定位</view>
			<view class="long-content" v-if="locationCity.name==='正在定位...'">
				<view class="desc">定位服务尚未开启</view>
				<view class="btn" @click="getLocateCityInfo">去开启</view>
			</view>
			<view class="short-content" v-else-if="locationCity.id>0">
				<view class="desc" @click="selectOne">
					{{locationCity.name+(locationCity.name?('-'+locationCity.areaName):'')}}
				</view>
			</view>
			<view class="long-content" v-else="locationCity.name === '位置获取失败,轻触重新获取'">
				<view class="desc">获取定位失败</view>
				<view class="btn" @click="getLocateCityInfo">重新获取</view>
			</view>
		</view>

		<!-- 选择城市相关 -->
		<view class="list-view" v-if="provinceList.length>0" :style="{'height':'calc(100% - ' + proportion * 209 + 'px)','width':'100%','overflow': 'hidden','border':'1rpx solid #E9EBEB'}">
			<scroll-view class="left" scroll-y scroll-y="true" style="width:190rpx;">
				<view :class="[provinceIndex==index?'left-cell-active-background':'left-cell']" v-for="(item,index) in provinceList"
				 :key=index @click="selectProvince(index)">
					<view :class="[provinceIndex==index?'left-cell-active':'']">{{item.provinceName}}</view>
				</view>
			</scroll-view>
			<scroll-view class="middle" scroll-y="true" style="width:280rpx;">
				<view :class="['middle-cell',(cityIndex!=index?'':'middle-cell-active')]" v-for="(item,index) in provinceList[provinceIndex].cities"
				 :key=index @click="selectCity(index)">
					<view>{{item.name}}</view>
					<view :class="['navigator-arrow'+(cityIndex==index?'-active':'')]"></view>
				</view>
			</scroll-view>
			<scroll-view class="right" scroll-y scroll-y="true" :style="{'width':'280rpx','background': cityIndex>=0?'#F2F5F5':'#FFFFFF'}">
				<view :class="['right-cell',(!item.checked?'':'right-cell-active')]" v-for="(item,index) in provinceList[provinceIndex].cities[cityIndex].childArea"
				 :key=index @click="selectAreaone(index)">
					<view>{{item.name}}</view>
					<image v-if="item.checked" :src="checkedImg"></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import citySelectFun from '@co/citySelect.js'
	import checkedImg from '@s/img/checked.png'
	export default {
		components: {},
		data() {
			return {
				options: {},
				provinceList: [],
				provinceIndex: 0, // 已选中的省份
				cityIndex: 0, // 已选中的城市
				areaIndex: -1, // 已选中的区域
				hisProvinceIndex: -1, // 历史选中的省份
				hisCityIndex: -1, // 历史选中的城市
				hisAreaIndex: -1, // 历史选中的区域
				checkedImg: checkedImg
			}
		},
		watch: {},
		computed: {
			...mapGetters(['currentCity', 'locationCity']),
			proportion() {
				const {
					windowWidth,
					windowHeight
				} = uni.getSystemInfoSync();
				return windowWidth / 750
			},
			windowHeight() {
				const {
					windowHeight
				} = uni.getSystemInfoSync();
				return windowHeight
			}
		},
		methods: {
			// 城市定位初始化
			getLocateCityInfo() {
				citySelectFun.getLocation()
			},

			// 选择省份
			selectProvince(index) {
				this.provinceIndex = index
				this.cityIndex = 0
				this.areaIndex = 0
			},


			// 城市选择
			selectCity(index) {
				this.cityIndex = index
				this.areaIndex = 0
			},

			// 选择一个
			selectOne() {
				console.log(this.locationCity)
				citySelectFun.setLocationCity(this,this.locationCity)
			},

			// 区域选择
			selectAreaone(index) {
				let list = this.provinceList
				let check = !list[this.provinceIndex].cities[this.cityIndex].childArea[index].checked
				let data = this
				let hisString = data.hisProvinceIndex.toString() + data.hisCityIndex.toString() + data.hisAreaIndex.toString()
				let string = data.provinceIndex.toString() + data.cityIndex.toString() + index.toString()
				list[data.provinceIndex].cities[data.cityIndex].childArea[index].checked = check
				if (data.hisProvinceIndex >= 0 && (string != hisString))
					list[data.hisProvinceIndex].cities[data.hisCityIndex].childArea[data.hisAreaIndex].checked = false
				this.provinceList = list
				this.hisProvinceIndex = this.provinceIndex
				this.hisCityIndex = this.cityIndex
				this.hisAreaIndex = index
				this.areaIndex = index
				let temp = list[data.provinceIndex].cities[data.cityIndex]
				citySelectFun.setLocationCity(this,{
					id: temp.id,
					name: temp.name,
					areaName: temp.childArea[index].name,
					areaId: temp.childArea[index].id
				})
			},
		},
		mounted() {
			citySelectFun.getProvinceListInit(this)
		}
	}
</script>

<style lang="scss">
	@import "@s/styles/index.scss";

	.location-city {
		height: 100%;
		width: 100%;

		.title {
			font-size: 28rpx;
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
			line-height: 40rpx;
		}

		.long-content {
			margin-top: 25rpx;
			// width: calc(100% - 48rpx);
			height: 88rpx;
			background: rgba(240, 240, 240, 1);
			border-radius: 8px;
			display: flex;
			flex-direction: row;
			padding: 0 24rpx;
			align-items: center;
			justify-content: space-between;
		}

		.over {
			max-width: 180rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
		}

		.desc {
			font-size: 28rpx;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 40rpx;
		}

		.btn {
			margin-right: 8rpx;
			padding: 0 16rpx;
			height: 40rpx;
			background: rgba(255, 119, 75, 1);
			border-radius: 2rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			line-height: 33rpx;
		}

		.short-content {
			display: inline-block;
			margin-top: 25rpx;
			padding: 24rpx 22rpx;
			background: rgba(240, 240, 240, 1);
		}

		.short-content>.desc {
			display: inline
		}

		.more-title {
			width: 100%;
			height: 48rpx;
			font-size: 34rpx;
			font-weight: 400;
			color: rgba(144, 147, 153, 1);
			line-height: 48rpx;
		}

		.ready-select-cell {
			min-width: 128rpx;
			padding: 0 5rpx;
			height: 30px;
			background: rgba(25, 199, 234, 0.1);
			border-radius: 6rpx;
			margin: 7px 35rpx 7px 0;
			font-size: 28rpx;
			font-weight: 400;
			color: rgba(25, 199, 234, 1);
			line-height: 30px;
			text-align: center;
			position: relative;
		}

		.ready-select-cell>image {
			position: absolute;
			top: -11rpx;
			right: -11rpx;
			width: 26rpx;
			height: 26rpx;
		}

		.block {
			display: block;
		}

		.save {
			background: rgba(25, 199, 234, 1);
			border-radius: 10rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			line-height: 50rpx;
		}

		.list-view {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: row;
			background: rgba(247, 249, 250, 1);
			color: $tc1;

			.left-cell {
				display: flex;
				align-items: center;
				width: 190rpx;
				height: 104rpx;
				background: #fff;
			}

			.left-cell>view {
				padding: 0 0 0 32rpx;
			}

			.left-cell-active {
				padding: 0 0 0 26rpx;
				
				height: 104rpx;
				// min-height: 52px;
				// line-height: 52px;
				display: flex;
				align-items: center;
				border-left: 6rpx solid $mc1;
				color: $mc1;
			}

			.left-cell-active-background {
				display: flex;
				align-items: center;
				width: 190rpx;
				height: 104rpx;
				background: rgba(247, 249, 250, 1);
			}

			.middle-cell {
				display: flex;
				align-items: center;
				width: 280rpx;
				height: 104rpx;
				color: $tc1;
			}

			.middle-cell-active {
				color: $mc1 !important;
			}

			.right-cell {
				color: $tc1;
			}

			.middle-cell>view,
			.right-cell>view {
				padding: 0 0 0 64rpx;
				// color: #333333;
			}

			.right-cell>image {
				width: 44rpx;
				height: 44rpx;
				margin-left: 15px;
				/* position: absolute;
		    top: calc((100% - 44rpx) / 2);
		    right:  */
			}

			.right-cell-active {
				color: $mc1 !important;
			}


			.navigator-arrow-active::after {
				content: " ";
				display: inline-block;
				height: 12rpx;
				width: 12rpx;
				border-width: 2rpx 2rpx 0 0;
				margin-top: -4rpx;
				right: 14rpx;
				border-color: #19C7EA;
				border-style: solid;
				transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
				position: absolute;
				top: 50%;
			}

			.navigator-arrow-active {
				padding-right: 52rpx;
				position: relative;
				color: #aeaeae;

			}

			.navigator-arrow {
				padding-right: 52rpx;
				position: relative;
				color: #aeaeae;
			}

			.navigator-arrow:after {
				content: " ";
				display: inline-block;
				height: 18rpx;
				width: 18rpx;
				border-width: 4rpx 4rpx 0 0;
				border-color: #aeaeae;
				border-style: solid;
				transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
				position: absolute;
				top: 50%;
				margin-top: -8rpx;
				right: 28rpx;
			}


			.middle {
				height: 100%;
				background: rgba(247, 249, 250, 1);
			}

			.right {
				height: 100%;
				/* background: #F2F5F5; */
			}

			.right-cell {
				display: flex;
				align-items: center;
				width: 280rpx;
				height: 104rpx;
			}

			.left {
				/* position: relative; */
				height: 100%;
				background: rgba(242, 245, 245, 1);
			}

			.navigator-arrow::after {
				height: 12rpx;
				width: 12rpx;
				border-width: 2rpx 2rpx 0 0;
				margin-top: -4rpx;
				right: 14rpx;

			}
		}


	}
</style>
