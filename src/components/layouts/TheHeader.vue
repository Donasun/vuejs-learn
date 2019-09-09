<!-- 单文件组件的文件名，应该始终以单词大写开头（PascalCase），或者始终以横线（kebab-case）连接。推荐使用大写开头的方式。 -->
<template>
  <div class="navbar navbar-default topnav">
    <div class="container">
      <div class="navbar-header">
        <a href="/" class="navbar-brand">
          <span class="title">{{ logo.title }}</span>
          <img :src="logo.src" :alt="logo.title">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheHeader',
  data() {
    return {
      logo: {
        src: `${this.uploadsUrl}communities/hIZjRRdF8oVYZy69XJnT.png`,
        title: 'VuejsCaff'
      }
    }
  },
  beforeCreate() {
    this.uploadsUrl = 'https://cdn.learnku.com/uploads/'
  }
};
</script>

<style scoped>
.title { display: none;}
</style>