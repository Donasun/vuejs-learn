<template>
    <div>
        <Message :show.sync="msgShow" :type="msgType" :msg="msg" />
    </div>
</template>
<script>
export default {
    name: 'Home',
    data() {
        return {
            msg: '', // 消息
            msgType: '', // 消息类型
            msgShow: false // 是否显示消息，默认不显示
        }
    },
    // 组件内的路由导航守卫
    beforeRouteEnter(to, from, next) {
        // 参数 to 和 from 都是 路由对象 （route object）
        // 表示当前激活的路由的状态信息
        // name：路由的名称，如 'Register'；
        // path：路由的路径，如 '/auth/register'；
        // params：路由参数对象，如 { id: "1" }；
        // query：URL 查询参数对象，如 { page: "1" }；
        // meta：元信息对象，如 { auth: true }；
        // 路由的名称，对应路由配置中的 name
        const fromName = from.name
        // 确认导航
        next(vm => {
            // 通过 vm 参数访问组件实例，已登录时，评估路由名称
            if (vm.$store.state.auth) {
                switch (fromName) {
                    // 如果从注册页面跳转过来
                    case 'Register':
                        // 该守卫不能访问 this，但我们通过传一个回调给 next，就可以使用上面的 vm 来访问组件实例
                        vm.showMsg('注册成功')
                        break
                }
            }
        })
    },
    methods: {
        showMsg(msg, type = 'success') {
            this.msg = msg
            this.msgType = type
            this.msgShow = true
        }
    }
};
</script>
<style scoped>
</style>