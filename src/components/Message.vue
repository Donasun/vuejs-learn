<template>
    <div v-show="show" :class="`alert alert-${type} alert-dismissible`">
        <button @click="close" type="button" class="close"><span>×</span></button>
        {{ msg }}
    </div>
</template>
<script>
export default {
    name: 'Message',
    props: {
        // 是否显示消息框
        show: {
            type: Boolean,
            default: false
        },
        // 消息框的类型
        type: {
            type: String,
            default: 'success'
        },
        // 消息
        msg: {
            type: String,
            default: ''
        }
    },
    watch: {
        //监听 show 的新值 value，完整的传参是 show(val, oldVal)
        show(value) {
            if (value) {
                this.$nextTick(() => {
                    //当新值返回 true 时，我们将当前元素滚动到可视区域的顶部
                    this.$el.scrollIntoView(true)
                })
            }
        }
    },
    methods: {
        close() {
            // 可以触发一个事件来更新 show
            this.$emit('update:show', false)
        }
    }
};
</script>
<style scoped>
</style>