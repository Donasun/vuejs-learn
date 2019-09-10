import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
    // mode：路由模式，默认值 'hash' 使用井号（ # ）作路由，
    // 'history' 可利用 History API 来完成页面跳转且无须重新加载
    mode: 'history',
    // 当前精确激活的 <router-link>，其默认值是 'router-link-exact-active'
    linkExactActiveClass: 'active',
    // 指定滚动行为
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            // 有锚点时，滚动到锚点
            return { selector: to.hash }
        } else if (savedPosition) {
            // 有保存位置时，滚动到保存位置
            return savedPosition
        } else {
            // 默认滚动到页面顶部
            return { x: 0, y: 0 }
        }
    },
    routes
})
// 全局前置守卫路由
router.beforeEach((to, from, next) => {
    // 应用根实例
    const app = router.app
    // 从根实例的配置器内取值
    const store = app.$options.store
    // 权限认证
    const auth = store.state.auth
    // 获取目标页面路由参数里的 articleId
    // const articleId = to.params.articleId
    // 当前用户
    const user = store.state.user && store.state.user.name
    // 路由参数中的用户
    const paramUser = to.params.user

    app.$message.hide()

    if (
        (auth && to.path.indexOf('/auth/') !== -1) ||
        (!auth && to.meta.auth) ||
        // 路由参数中的用户不为当前用户，且找不到与其对应的文章时，跳转到首页
        (paramUser && paramUser !== user && !store.getters.getArticlesByUid(null, paramUser).length) 
    ) {
        next('/')
    } else {
        next()
    }
})

// 注册全局后置钩子,显示路由消息参数
router.afterEach((to) => {
    const app = router.app
    const showMsg = to.params.showMsg

    if (showMsg) {
        if (typeof showMsg === 'string') {
            app.$message.show(showMsg)
        } else {
            app.$message.show('操作成功')
        }
    }
})

export default router