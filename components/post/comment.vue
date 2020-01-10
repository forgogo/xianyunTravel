<template>
  <div>
    <div class="cmt-item" v-for="(item,index) in dataList" :key="index">
      <div class="cmt-info">
        <img :src="'http://157.122.54.189:9095'+item.account.defaultAvatar" alt />
        {{item.account.nickname}}
        <i>{{item.updated_at | checkTime}}</i>
        <span>{{item.level}}</span>
      </div>
      <div class="cmt-content">


       <commentItem v-if="item.parent" :comment="item.parent" @reply="reply"/>



        <div class="cmt-new">
          <p class="cmt-message">{{item.content}}</p>
          <div class="el-row el-row--flex">
            <div class="cmt-pic" :v-if="item.pics" v-for="(item,index) in item.pics" :key="index">
              <img :src="'http://127.0.0.1:1337'+item.url" alt />
              <span>{{item}}</span>
              <!-- <el-image :src="'http://127.0.0.1:1337'+item.url" :preview-src-list="srcList"></el-image> -->
            </div>
          </div>
          <div class="cmt-ctrl">
            <a href="javascript:;" @click="reply(item)">回复</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 8, 16]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import commentItem from "@/components/post/commentItem"
export default {
  props: ["commentNum"],
  data() {
    return {
      comments: [],
      //   分页属性
      currentPage: 1, //默认显示第一页
      pageIndex: 1, //第几页
      pageSize: 2, //每页几条
      total: 0
    };
  },
  components:{
    commentItem
  },
  watch: {
    commentNum() {
      this.getComments();
    }
  },
  filters: {
    checkTime(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
  mounted() {
    setTimeout(() => {
      this.getComments();
    }, 1);
  },
  computed: {
    dataList() {
      if (!this.comments) return [];
      return this.comments.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    }
  },
  methods: {
    getComments() {
      const { id } = this.$route.query;
      this.$axios({
        params: {
          post: id
        },
        url: "/posts/comments"
      }).then(res => {
        this.comments = res.data.data;
        this.total = res.data.total;
        console.log(res);
      });
    },
    // 分页功能
    // 切换每一页显示多少条数据
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
    },
    // 切换到第几页
    handleCurrentChange(val) {
      this.pageIndex = val;
    },
    reply(item) {
      this.$emit("getReply", item);
      console.log(item);
    }
  }
};
</script>

<style lang="less" scoped>
.cmt-item {
  border-bottom: 1px dashed #ddd;
  padding: 20px 20px 5px;
  .cmt-info {
    margin-bottom: 10px;
    font-size: 12px;
    color: #666;
    img {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    i {
      color: #999;
    }
    span {
      float: right;
    }
  }
  > * {
    vertical-align: top;
  }
  .cmt-content {
    padding: 0 0 0 30px;
    .cmt-new {
      .cmt-message {
        margin-top: 10px;
      }
      .cmt-pic {
        width: 80px;
        height: 80px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 5px;
        margin-top: 10px;
        padding: 5px;
        border: 1px dashed #ddd;
        img {
          display: block;
          width: 100%;
          height: 100%;
          -o-object-fit: cover;
          object-fit: cover;
          cursor: pointer;
        }
      }
      .cmt-ctrl {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #1e50a2;
        text-align: right;
      }
    }
  }
}
</style>