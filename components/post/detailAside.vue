<template>
  <div>
    <h4 class="aside-title">相关攻略</h4>
    <div class="recommend-list" v-for="(item,index) in recommend" :key="index">
      <a :href="'/post/detail?id='+item.id" class="recommend-item nuxt-link-active">
        <div class="post-imgText el-row el-row--flex">
          <div class="post-img el-row is-align-middle el-row--flex">
            <img :src="item.images[0]" alt />
          </div>
          <div class="post-text">
            <div>{{item.title}}</div>
            <p>{{item.updated_at | checkTime}} 阅读{{item.watch | checkWatch}}</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      recommend: []
    };
  },
  filters: {
    checkTime(value) {
      return moment(value).format("YYYY-MM-DD");
    },
    checkWatch(value) {
      if (value == null) return 0;
    }
  },
  mounted() {
    this.getRecommend();
  },
  methods: {
    getRecommend() {
      const { id } = this.$route.query;
      this.$axios({
        url: "/posts/recommend",
        parmas: { id }
      }).then(res => {
        // console.log(res);
        this.recommend = res.data.data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.recommend-item {
  display: block;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
  .post-imgText {
    .post-img {
      width: 100px;
      height: 80px;
      flex-shrink: 0;
      background: #ddd;
      overflow: hidden;
      margin-right: 10px;
    }
    .post-text {
      flex: 1;
      position: relative;
      div {
        line-height: 1.4em;
        height: 2.8em;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      p {
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>