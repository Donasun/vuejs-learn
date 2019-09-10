import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'
import * as moreActions from './actions'
import * as moreGetters from './getters'

Vue.use(Vuex)
// state：共享的状态，我们不能直接更改状态
const state = {
    // 用户信息，初始值从本地 localStorage 获取
    user: ls.getItem('user'),
    // 添加 auth 来保存当前用户的登录状态
    auth: ls.getItem('auth'),
    // 所有文章状态
    articles: ls.getItem('articles'),
    searchValue: '',
    origin: location.origin

}
// 更改状态的方法，我们可以在这里更改状态
const mutations = {
    UPDATE_USER(state, user) {
        // 改变 user 的值
        state.user = user
        // 将改变后的值存入 localStorage
        ls.setItem('user', user)
    },
    // 添加 UPDATE_AUTH 来更改当前用户的登录状态
    UPDATE_AUTH(state, auth) {
        state.auth = auth
        ls.setItem('auth', auth)
    },
    // 更改所有文章的事件类型
    UPDATE_ARTICLES(state, articles) {
        state.articles = articles
        ls.setItem('articles', articles)
    },
    // 更新搜索值的事件类型
    UPDATE_SEARCH_VALUE(state, searchValue) {
        state.searchValue = searchValue
    }
}

const actions = {
    login({ commit }, user) {
        // 登录时有传用户信息，就更新下用户信息
        if (user) commit('UPDATE_USER', user)

        // 更新当前用户的登录状态为已登录
        commit('UPDATE_AUTH', true)
        // 跳转到首页
        // push 是路由的一个方法，用来跳转到一个新的地址，第一个参数是字符串或者一个描述地址对象
        router.push('/')
    },
    logout({ commit }) {
        commit('UPDATE_AUTH', false)
        router.push({ name: 'Home', params: { logout: true } })
    },
    // 更新个人信息
    updateUser({ state, commit }, user) {
        // 获取仓库的个人信息
        const stateUser = state.user
        // 简单的数据类型判断
        if (stateUser && typeof stateUser === 'object') {
            // 合并新旧个人信息，等价于 user = Object.assign({}, stateUser, user)
            user = { ...stateUser, ...user }
        }

        commit('UPDATE_USER', user)
    },
    ...moreActions

}

const getters = {
    // 第一参数是 state，因为要传 id，所以这里返回一个函数
    getArticleById: (state) => (id) => {
        // 从仓库获取所有文章
        // let articles = state.articles
        // 使用派生状态 computedArticles 作为所有文章
        let articles = getters.computedArticles
        // 所有文章是一个数组时
        if (Array.isArray(articles)) {
            // 传进来的 id 和文章的 articleId 相同时，返回这些文章
            articles = articles.filter(article => parseInt(id) === parseInt(article.articleId))
            return articles.length ? articles[0] : null
        } else {
            return null
        }
    },
    // 混入 moreGetters, 你可以理解为 getters = Object.assign(getters, moreGetters)
    ...moreGetters
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

export default store