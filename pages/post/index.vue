<template>
  <div class="container">
    <div class="el-row is-justify-space-between el-row--flex">
      <div class="menus-wrapper">
        <div class="menus-body">
          <!-- 左边侧边栏 -->
          <cebianlan />
          <!-- 推荐城市 -->
          <div class="aside-recommend">
            <h4 class="aside-title">推荐城市</h4>
            <a href="/post#" class="aside-recommend-item">
              <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" />
            </a>
          </div>
        </div>
      </div>
      <div class="post-wrapper">
        <!-- 搜索框 -->
        <div>
          <el-input placeholder="请输入想去的地方，比如：'广州'" v-model="searchCity" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search(searchCity)"></el-button>
          </el-input>
        </div>
        <div class="search-recommend">
          推荐：
          <span>广州</span>
          <span>上海</span>
          <span>北京</span>
        </div>
        <!-- 写游记 -->
        <div class="post-title">
          <h4>推荐攻略</h4>
          <el-button type="primary">
            <i class="el-icon-edit"></i>写游记
          </el-button>
        </div>
        <!-- 文章列表 -->
        <div class="post-list">
          <artcileItem :posts="dataList" />
        </div>
        <!-- size-change：切换条数的时候触发 -->
        <!-- current-page：选择页数的时候触发  -->
        <!-- current-page: 当前页数 -->
        <!-- page-size：当前条数 -->
        <!-- total：总条数 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cebianlan from "@/components/post/aside.vue";
//文章列表

import artcileItem from "@/components/post/artcileItem.vue";
export default {
  data() {
    return {
      searchCity: "",
      posts: [], //文章详情
      cachePosts: [], //创建新数组，保存文章列表
      //分页插件的属性
      currentPage: 1, //默认显示第一页
      pageIndex: 1, // 当前页数
      pageSize: 5, //当前显示的条数
      total: 0
    };
  },
  mounted() {
    this.getPosts();
  },

  components: {
    cebianlan,
    artcileItem
  },
  computed: {
    // 计算属性监听函数内部引用实例的属性变化，一旦发生了变化，该函数会重新计算，并且返回新的值
    dataList() {
      // 请求如果还没完成，返回空数组
      if (!this.posts) return [];

      // 计算分页的数据
      return this.posts.slice(
        // 假如第2页 就会把第2页之前的都切割掉 只显示后面的
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    }
  },
  methods: {
    getPosts() {
      this.$axios({
        url: "/posts"
      }).then(res => {
        this.total = res.data.total;
        this.posts = res.data.data;

        // this.cachePosts =this.posts.slice(0,this.pageSize+1);

        // 分页初始化为1
        this.pageIndex = 1;
      });
    },
    // 切换条数时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
    },
    handleCurrentChange(val) {
      console.log(val);

      this.pageIndex = val;
    },
    search(city) {
      this.$axios({
        url: "/posts",
        parmas:{city:70}
      }).then(res=>{
        console.log(city);
        
        console.log(res);
        
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;

  .menus-wrapper {
    position: relative;
    width: 260px;
    z-index: 2;
  }
  .post-wrapper {
    width: 700px;
  }
  .aside-recommend {
    margin-top: 20px;
    .aside-title {
      font-weight: 400;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 10px;
    }
    .aside-recommend-item {
      img {
        width: 100%;
        display: block;
      }
    }
  }
  .post-wrapper {
    .search-recommend {
      padding: 10px 0;
      font-size: 12px;
      color: #666;
    }
    .post-title {
      h4 {
        font-weight: 400;
        font-size: 18px;
        color: orange;
        &::after {
          display: block;
          content: "";
          width: 72px;
          height: 2px;
          background: orange;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
  }
}
</style>