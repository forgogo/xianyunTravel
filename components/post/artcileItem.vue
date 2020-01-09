<template>
  <div>
    <div class="list" v-for="(item,index) in posts" :key="index">
      <div class="post-item" v-if="item.images.length===3">
        <h4 class="post-list-title" title="塞班贵？一定是你的打开方式不对！6000块玩转塞班">
          <a :href="'/post/detail?id='+item.id">{{item.title}}</a>
        </h4>
        <p class="post-desc">
          <a :href="'/post/detail?id='+item.id" class>{{item.summary}}</a>
        </p>
        <div class="card-images">
          <a :href="'/post/detail?id='+item.id" v-for="(item,index) in item.images" :key="index">
            <img :src="item" />
          </a>
        </div>
        <div class="post-info el-row is-justify-space-between el-row--flex">
          <div class="post-info-left el-row is-align-middle el-row--flex">
            <span>
              <i class="el-icon-location-outline"></i>
              {{item.cityName}}
            </span>
            <div class="post-user el-row is-align-middle el-row--flex">
              by
              <a href="/user/personal" class>
                <img :src="'http://157.122.54.189:9095'+item.account.defaultAvatar" />
              </a>
              <a href="/user/personal" class>{{item.account.nickname}}</a>
            </div>
            <span>
              <i class="el-icon-view"></i>
              {{item.watch}}
            </span>
          </div>
          <span class="post-info-right">{{item.like === null ? "0" : item.like }} 赞</span>
        </div>
      </div>
      <!-- 左图右文 -->
      <div class="post-item second" v-else-if="item.images.length<3">
        <div class="post-cover">
          <a :href="'/post/detail?id='+item.id" class>
            <img :src="item.images[0]" />
          </a>
        </div>
        <div class="post-content">
          <h4 :title="item.title" class="post-list-title">
            <a :href="'/post/detail?id='+item.id">{{item.title}}</a>
          </h4>
          <p class="post-desc">
            <a :href="'/post/detail?id='+item.id">{{item.summary}}</a>
          </p>
          <div class="post-info el-row is-justify-space-between el-row--flex">
            <div class="post-info-left el-row is-align-middle el-row--flex">
              <span>
                <i class="el-icon-location-outline"></i>
                {{item.cityName}}
              </span>
              <div class="post-user el-row is-align-middle el-row--flex">
                by
                <a href="/user/personal" class>
                  <img :src="'http://157.122.54.189:9095'+item.account.defaultAvatar" />
                </a>
                <a href="/user/personal" class>{{item.account.nickname}}</a>
              </div>
              <span>
                <i class="el-icon-view"></i>
                {{item.watch}}
              </span>
            </div>
            <span class="post-info-right">{{item.like === null ? "0" : item.like }} 赞</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  // 父传子 接受父组件传过来的航班信息
  props: {
    // 数据
    posts: {
      type: Array,
      // 默认是空数组
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
// 文章列表样式
.post-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}
.post-list-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 15px;
  font-weight: 400;
  font-size: 18px;
}
.post-desc {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 14px;
  height: 63px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
}
.card-images {
  display: flex;
  margin: 15px 0;
  a {
    width: 100%;
    img {
      width: 220px;
      height: 150px;
      display: block;
      -o-object-fit: cover;
      object-fit: cover;
    }
  }
}
.post-info {
  display: flex;
  font-size: 12px;
  .post-user {
    a {
      color: orange;
      img {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 100px;
        margin: 5px;
      }
    }
  }
  .post-info-left {
    font-size: 12px;
    color: #999;
    > * {
      margin-right: 10px;
    }
  }
  .post-info-right {
    font-size: 16px;
    color: orange;
  }
}
//左图又文
.second {
  display: flex;
  justify-content: space-between;
}
.post-cover {
  width: 220px;
  height: 150px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 10px;
  a {
    img {
      display: block;
      width: 100%;
      height: 100%;
      -o-object-fit: cover;
      object-fit: cover;
    }
  }
}
.post-content {
  width: 470px;
}
</style>