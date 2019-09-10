import Vue from 'vue'
import validator from './validator'
import dropdown from './dropdown'
import title from './title'
// 注册全局指令需要使用 Vue.directive，
// 第一个参数 'validator' 是指令名称，
// 第二个参数 validator 是指令对象或者指令函数
const directives = {
  validator,
  dropdown,
  title
}
//Object.entries 返回给定对象的键值对数组
for (const [key, value] of Object.entries(directives)) {
  Vue.directive(key, value)
}