<template>
    <div class="navbar navbar-default topnav">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" @click="toggleNav">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <router-link to="/" class="navbar-brand">
                    <span class="title">{{ logo.title }}</span>
                    <img :src="logo.src" :alt="logo.title">
                </router-link>
            </div>
            <div id="top-navbar-collapse" :class="['collapse', 'navbar-collapse', { in: showCollapsedNav }]">
                <ul class="nav navbar-nav">
                    <li v-for="(item, index) in navList" :class="{ active: index === activeNavIndex }" :key="item">
                        <a href="#" @click="changeNavIndex(index)">{{ item }}</a>
                    </li>
                </ul>
                <div class="navbar-right">
                    <SearchInput/>
                    <TheEntry />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TheEntry from '@/components/layouts/TheEntry';
import SearchInput from '@/components/layouts/SearchInput';
export default {
    name: 'TheHeader',
    components: {
        TheEntry,
        SearchInput
    },
    data() {
        return {
            logo: {
                src: `${this.uploadsUrl}communities/hIZjRRdF8oVYZy69XJnT.png`,
                title: 'VuejsCaff'
            },
            navList: ['社区', '头条', '问答', '教程'],
            activeNavIndex: 0,
            // 使用数组语法对 class 进行绑定
            // 只有当 showCollapsedNav 返回 true 时才添加 'in' 这个类名
            showCollapsedNav: false
        }
    },
    beforeCreate() {
        this.uploadsUrl = 'https://cdn.learnku.com/uploads/'
    },
    methods: {
        changeNavIndex(index) {
            this.activeNavIndex = index
        },
        toggleNav() {
            this.showCollapsedNav = !this.showCollapsedNav
        }
    }
};
</script>
<style scoped>
.title {
    display: none;
}
</style>