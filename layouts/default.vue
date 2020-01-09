<template>
  <div>
    <!-- 头部组件 -->
    <Header />
    <!-- 内容占位组件 -->
    <nuxt />
    
    <!-- 页脚组件 -->
    <Footer />
  </div>
</template>
<script>
// 导入头部组件
import Header from "@/components/user/header.vue";
// 导入页脚组件
import Footer from "@/components/user/footer.vue";
export default {
  // 注册组件
  components: {
    Header,Footer
  }
};
</script>

<style>

@import "../assets/reset.css";
@import "../assets/icon/iconfont.css"
</style>
