<template>
	<view class="birthday">
		<u-picker mode="time" v-model="show" :title="title" :params="params" :start-year="minTime" :end-year="maxTime" :default-time="currentDate" @confirm="onConfirm"></u-picker>
	</view>
</template>

<script>
	// import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		parseTime
	} from '@co/util.js'
	export default {
		components: {
			// wPicker
		},
		props:{
			title: {
				type: String,
				default: ''
			},
			postType: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				show:false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				currentDate: parseTime(new Date().valueOf() - 3600 * 24 * 1000 * 24 * 365).substr(0,4)+'-06',
				minTime: parseTime(new Date().valueOf() - 3600 * 24 * 1000 * 100 * 365).substr(0,4),
				maxTime: parseTime(new Date().valueOf() - 3600 * 24 * 1000 * 16 * 365).substr(0,4)
			};
		},
		mounted() {
			console.log(this.currentDate)
		},
		methods: {
			onConfirm(e) {
				console.log(e)
				if(this.postType === 'thisPage') {
					this.$parent.setBirthday(e.year + '-' + e.month +'-01')
				}else {
					this.$store.commit('setUserInfoBirthday',e.year + '-' + e.month +'-01')
				}
			},
			showModal() {
				this.show=true
			}
		},
	}
</script>

<style lang="scss">
</style>
