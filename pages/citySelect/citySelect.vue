<template>
<view>
  <selectCity />
</view>
</template>

<script>
    import config from "@/config";
	import selectCity from '@/components/select-city-jianzhike/select-city-jianzhike.vue'
    export default {
        components: {
			selectCity
		},
        data() {
            return {
                options:{}
            }
        },
        watch: {},
        computed: {},
        methods: {},
        onLoad(options){
            this.options = options
        },
        onReady(){},
        onShow() {
        },
        onHide() {
        },
        onUnload() {
        },
        onReachBottom() {
        },
        onPullDownRefresh() {
        },
        onShareAppMessage(){}
    }
</script>

<style lang="scss">
@import "@/static/jianzhike/styles/index.scss";

</style>
