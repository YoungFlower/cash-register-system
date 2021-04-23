<!-- 我的收藏中item封装 -->

<template>
	<view class="uni-favorite-item flex-col">
		<text class="favorite-item-title">{{favoriteItem.title}}</text>
		<view class="flex-row" :style="{'margin-bottom':((favoriteItem.welfare && favoriteItem.place)==''?'16px':'')}">
			<view class="">
				<text class="favorite-item-price">{{favoriteItem.price}}</text>
			</view>
			<view class="favorite-item-button" v-if="welfare == ''">
				<button :style="{'background':(favoriteItem.status == 1?'#3CC3FF':'#DCE0E0')}" @click="toApply">
					{{favoriteItem.status == 1?"报名":"已报名"}}
				</button>
			</view>
		</view>
		<view class="favorite-item-place" v-if="favoriteItem.place">
			<image :src="placeImage" mode=""></image>
			<text>{{favoriteItem.place}}<text>·距离</text>{{favoriteItem.distance}}</text>
		</view>
		<view class="favorite-item-welfare" v-if="welfare != ''">
			<view class="">
				<text v-for="(item,index) in welfare">{{item}}</text>
			</view>
			<view class="favorite-item-button" v-if="favoriteItem.hasButton == 1">
				<button :style="{'background':(favoriteItem.status == 1?'#3CC3FF':'#DCE0E0')}" @click="toApply">
					{{favoriteItem.status == 1?"报名":"已报名"}}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import placeImage from "@/static/jianzhike/img/place.png"
	export default {
		name: "favoriteListItem",
		props: {
			favoriteItem: {
				type: Object,
				required: true,
			}
		},
		created() {
			if (this.favoriteItem.welfare != "") {
				console.log("123")
				this.welfare = this.favoriteItem.welfare.split(",")
				console.log(this.welfare)
			}

		},
		data() {
			return {
				placeImage: placeImage,
				welfare: [],
			};
		},
		methods: {
			toApply() {
				console.log("点击了报名");
				console.log(this.favoriteItem.welfare)

			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/jianzhike/styles/variables.scss";

	.uni-favorite-item {
		font-family: PingFangSC-Medium, PingFang SC;
		background: #cacaca;
		// background: #FFF;

		.favorite-item-title {
			width: 319px;
			font-size: $fs2;
			font-weight: 600;
			color: $tc1;
			line-height: $fs2;
			margin: $fs2 0 10.5px 15.5px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.flex-row {
			justify-content: space-between;
			align-items: center;

			.favorite-item-price {
				height: $fs2;
				font-size: $fs2;
				line-height: $fs2;
				font-weight: 600;
				color: #FF983F;
				margin-left: 15.5px;
			}
		}

		.favorite-item-button {
			width: 60px;
			height: 28px;
			margin-right: 15px;

			button {
				line-height: 28px;
				width: 60px;
				padding: 0;
				border-radius: 4px;
				font-size: $fs4;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		.favorite-item-place {
			display: flex;
			align-items: center;
			margin-left: 15.5px;
			margin-bottom: 4px;
			margin-top: 10px;
		}

		.favorite-item-place image {
			width: $fs4;
			height: $fs4;
			margin-right: 4px;
		}

		.favorite-item-place text {
			font-size: $fs4;
			font-weight: 500;
			color: #969999;
			line-height: $fs4;
		}

		.favorite-item-welfare {
			margin-left: 15.5px;
			margin-bottom: $fs0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				width: 32px;
				height: $fs0;
				line-height: $fs0;
				background: #F7F8F8;
				border-radius: 2px;
				font-size: $fs5;
				font-weight: 500;
				color: #969999;
				margin-right: 4px;
				padding: 2px 4px;
			}
		}

	}
</style>
