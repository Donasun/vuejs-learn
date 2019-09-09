# 自定义指令定义对象可以提供如下几个钩子函数（均为可选）：

- bind：只调用一次，指令第一次绑定到元素时调用，在这里可以进行一次性的初始化设置；
- inserted：被绑定元素插入父节点时调用；
- update：所在组件的 VNode（虚拟节点）更新时调用，但是可能发生在其子 VNode 更新之前；
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用；
- unbind：只调用一次，指令与元素解绑时调用，在这里可以移除绑定的事件和其他数据；

# 指令钩子函数会被传入以下参数：

- el：指令所绑定的元素，可以用来操作 DOM ；
- binding：一个对象，binding.value 表示指令的绑定值，如 v-title="'我是标题'" 中，绑定值为'我是标题'；
- vnode：Vue 编译生成的虚拟节点；
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。