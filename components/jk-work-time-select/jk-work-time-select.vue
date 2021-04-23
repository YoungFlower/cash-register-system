<template>
	<view v-if="show">
		<u-calendar v-model="show" :mode="mode" :min-date="minDate" :max-date="maxDate" @change="changeReturn"></u-calendar>
	</view>
</template>

<script>
	import {parseTime} from '@/common/util.js'
	import {baseInfoCheck} from '@co/signUp.js'
	export default {
		data() {
			return {
				show:false,
				minDate:parseTime(new Date().valueOf()),
				maxDate:''
			};
		},
		methods:{
			openUcalendar(minDate,maxDate) {
				this.minDate= minDate.substr(0,10)
				this.maxDate = maxDate.substr(0,10)
				this.show=true
			},
			// 选择时间后报名
			changeReturn(e) {
				let arry = this.setTimeArry(e.startDate,e.endDate)
				let applyDetail = this.$store.state.applyDetail
				applyDetail.timeArry = arry
				this.$store.commit('setApplyDetail', applyDetail)
				baseInfoCheck(this)
			},
			// 设置时间数组
			setTimeArry(start,end) {
				let startTime = new Date(start).valueOf()
				let endTime = new Date(end).valueOf()
				let returnArry = []
				for(let i = startTime ;i<=endTime;i=i+24*60*60*1000) {
					returnArry.push(parseTime(i))
				}
				return returnArry
			}
		}
	}
</script>

<style lang="scss">

</style>
