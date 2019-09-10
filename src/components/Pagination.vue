<template>
  <!--生成分页链接 -->
  <ul v-if="totalPage > 1" class="pagination">
    <!-- 首页 -->
    <li :class="{disabled:internalCurrentPage === 1}">
      <a href="javascript:;" @click="changePage(internalCurrentPage -1)"></a>
    </li>
    <!-- 当前页 -->
    <li v-for="(n,index) in totalPage" :key="index" :class="{active:internalCurrentPage === n}">
      <a href="javascript:;" @click="changePage(n)">{{ n }}</a>
    </li>
    <!-- 最后一页 -->
    <li :class="{disabled:internalCurrentPage === totalPage}">
      <a href="javascript:;" @click="changePage(internalCurrentPage + 1)">»</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    // 当前页
    currentPage: {
      type: Number,
      default: 1
    },
    // 总记录数
    total: {
      type: Number,
      required: true
    },
    // 每页显示的记录数
    pageSize: {
      type: Number,
      default: 7,
      validator: value => value > 0
    },
    // 当前页改变后的回调
    onPageChange: {
      type: Function,
      default: () => {}
    }
  },

  data() {
    // 组件内的当前页
    return {
      internalCurrentPage: 1
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  watch: {
    currentPage: {
      immediate: true,
      handler(page) {
        // 更新组件内的当前页，为父组件上currentPage的当前值
        this.internalCurrentPage = page;
      }
    }
  },
  methods: {
    changePage(page) {
      //  当前页或超出范围的页码不响应
      if (
        page === this.internalCurrentPage ||
        page < 1 ||
        page > this.totalPage
      )
        return;
      // 点击非当前页，触发父组件传下来的回调函数
      this.onPageChange(page);
    }
  }
};
</script>

<style scoped>
</style>
