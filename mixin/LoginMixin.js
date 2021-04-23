export default {

    data() {
        return {
        }
    },
    components: {},
    computed: {},
    mounted() {
    },
    created() {
    },
    methods: {
        openLogin(){
            this.$store.dispatch('getUserOpenId')
            this.$refs.login.open()
        },

    },

}
