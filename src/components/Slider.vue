<template>
  <!-- 是否显示跑马灯 -->
  <div v-if="slides.length" class="carousel slide" @mouseover="stop" @mouseout="play">
    <!-- 显示区域 -->
    <div class="carousel-inner">
      <!-- 过渡组件 -->
      <transition
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutLeft"
      >
        <div v-if="show" key="current">
          <!-- slot用法,目的让父组件定义子组件部分内容 -->
          <slot :currentSlide="currentSlide"></slot>
        </div>
        <div v-else key="next" class="item next">
          <slot :currentSlide="currentSlide"></slot>
        </div>
      </transition>
    </div>

    <!-- 跳转器，指示 -->
    <div class="carousel-indicators">
      <li
        v-for="(n,index) in slides.length"
        :key="index"
        :class="{active:n-1===currentIndex}"
        @click="playTo(n-1)"
      ></li>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
export default {
  name: "Slider",
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    delay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      currentIndex: 0,
      show: true
    };
  },
  computed: {
    currentSlide() {
      return this.slides[this.currentIndex];
    },
    nextIndex() {
      if (this.currentIndex === this.slides.length - 1) {
        return 0;
      } else {
        return this.currentIndex + 1;
      }
    }
  },
  mounted() {
    if (this.autoplay) this.play();
  },

  methods: {
    play() {
      if (this.autoplay) {
        this.interval = setInterval(() => {
          // 进入下一张图片显示
          this.playTo(this.nextIndex);
        }, this.delay);
      }
    },
    stop() {
      // 停止 清除间隔器
      if (this.interval) clearInterval(this.interval);
    },
    playTo(n) {
      // 若当前页就是要播放的页面，则不进行图片转换
      if (this.currentIndex === n) return;
      //  否则先关闭当前显示，等待动画结束，再图片显示
      this.show = false;
      setTimeout(() => {
        this.currentIndex = n;
        this.show = true;
      }, 0);
    }
  }
};
</script>

<style scoped>
.carousel {
  margin-top: 4px;
  padding-bottom: 30px;
}
.carousel-inner > div {
  min-height: 177px;
}
@media (min-width: 1200px) {
  .carousel-inner > div {
    min-height: 228px;
  }
}
.carousel-indicators {
  bottom: 0;
  border-radius: 12px;
  background-color: hsla(0, 0%, 100%, 0.3);
  margin-bottom: 0px;
  padding: 4px 8px;
}
.carousel-indicators li {
  margin: 0 3px;
  border: 1px solid #ff8580;
  background-color: #f4665f;
}
</style>
