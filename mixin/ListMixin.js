export default {

    data() {
        return {
            jobList:[],
            pageSize:30,
            pageNum:1,
            noData:false,
            finish:false,
        }
    },
    components: {},
    computed: {},
    mounted() {
    },
    created() {
    },
    methods: {
        dealList(list,number = 0){
            this.pageNum++
			if(number === 1) {
				this.jobList = list
			}else {
				this.jobList = this.jobList.concat(list)
			}
            
            if(this.jobList.length===0){
                this.noData = true
            }
            else if (list.length < this.pageSize){
                this.finish = true
            }
        }
    },
    onReachBottom() {
        if (this.finish){ return}
        this.getJobList()
    },
}
