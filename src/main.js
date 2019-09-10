import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局指令
import './directives'
import './components'
import store from './store'

// 引入由组件扩展而来的插件
import Message from './plugins/message'
// 引入外部库扩展插件
import VueSweetalert2 from './plugins/vue-sweetalert2'
// 注册全局过滤器
import './filters'
import { mockArticles } from './mock/data'
import ls from './utils/localStorage'
import './mock'
import axios from 'axios'

Vue.prototype.$axios = axios

Vue.use(VueSweetalert2)
Vue.use(Message)

Vue.config.productionTip = false

const AddMockData = (() => {
  const isAddMockData = true
  let userArticles = ls.getItem('articles')

  if (Array.isArray(userArticles)) {
    userArticles = userArticles.filter(article => parseInt(article.uid) === 1)
  } else {
    userArticles = []
  }

  if (isAddMockData) {
    // 将用户数据与模拟数据进行合并
    store.commit('UPDATE_ARTICLES', [...userArticles, ...mockArticles(50)])
  } else {
    store.commit('UPDATE_ARTICLES', userArticles)
  }
})()



new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
