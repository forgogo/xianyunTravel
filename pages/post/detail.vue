<template>
  <div class="container el-row is-justify-space-between el-row--flex">
    <div class="main">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="#">攻略详情</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 标题 -->
      <h1>{{posts.title}}</h1>
      <div class="post-info">
        <span>攻略: {{posts.city.created_at}}</span>
        <span>阅读量:{{posts.watch}}</span>
      </div>
      <!-- 文章内容 -->
      <div class="post-content"></div>
      <!-- 功能杂项 -->
      <div class="post-ctrr">
        <div class="el-row is-justify-center el-row--flex">
          <div class="ctrl-item">
            <i class="iconfont">&#xe9ca;</i>
            <p>评论({{posts.comments.length}})</p>
          </div>
          <div class="ctrl-item" @click="postsStar">
            <i class="iconfont">&#xe633;</i>
            <p>收藏</p>
          </div>
          <div class="ctrl-item">
            <i class="iconfont">&#xe6f3;</i>
            <p>分享</p>
          </div>
          <div class="ctrl-item" @click="postLike">
            <i class="iconfont">&#xe7c8;</i>
            <p>点赞({{posts.like}})</p>
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="cmt-wrapper">
        <h4 class="cmt-title">评论</h4>
        <span class="replyTag el-tag el-tag--info" v-show="isShow">
          @{{replyName}}
          <i class="el-tag__close el-icon-close" @click="removeReply"></i>
        </span>
        <div class="cm-input">
          <el-input
            resize="none"
            type="textarea"
            placeholder="说点什么吧"
            v-model="comment.content"
            maxlength="120"
            show-word-limit
          ></el-input>
          <!-- 图片上传 -->
          <div class="cmt-input-ctrls el-row is-justify-space-between el-row--flex">
            <el-upload
              :limit="3"
              name="files"
              action="http://127.0.0.1:1337/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="coverSuccess"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
            <div id="btn">
              <el-button type="primary" @click="postCom">提交</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="cmt-list">
        <comment :commentNum="commentNum" @getReply="getReply" />
      </div>
    </div>
    <div class="aside">
      <detailAside />
    </div>
  </div>
</template>

<script>
import detailAside from "@/components/post/detailAside";
//评论item
import comment from "@/components/post/comment";
export default {
  data() {
    return {
      isShow: false,
      replyName: "",
      commentNum: "",
      // 发布评论属性
      comment: {
        content: "",
        pics: [],
        post: ""
        // id:''
      },
      posts: {
        city: "",
        comments: []
      },
      textarea: "",
      //   图片上传属性
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    postCom() {
      const {
        user: { userInfo }
      } = this.$store.state;
      this.$axios({
        method: "post",
        url: "/comments",
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        },
        data: this.comment
      }).then(res => {
        console.log(res);
        this.$refs.upload.clearFiles();
        this.comment.content = "";
        this.comment.pics = [];
        this.comment.post = "";
        this.commentNum += 1;
        this.$message({
          message: "评论发布成功！",
          type: "success"
        });
      });
    },
    getPosts() {
      const { id } = this.$route.query;
      this.$axios({
        url: "/posts",
        params: { id }
      }).then(res => {
        this.posts = res.data.data[0];
        this.comment.post = id;
        document.querySelector(".post-content").innerHTML = this.posts.content;
        // console.log(res);
      });
    },
    // 收藏文章
    postsStar() {
      const {
        user: { userInfo }
      } = this.$store.state;
      const { id } = this.$route.query;
      this.$axios({
        url: "/posts/star",
        params: { id },
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      })
        .then(res => {
          console.log(res);
          this.$message({
            message: "恭喜你，收藏成功！",
            type: "success"
          });
        })
        .catch(error => {
          this.$message({
            message: "收藏过了呢",
            type: "warning"
          });
        });
    },
    // 分享文章
    // 点赞文章
    postLike() {
      const {
        user: { userInfo }
      } = this.$store.state;
      const { id } = this.$route.query;
      this.$axios({
        url: "/posts/like",
        params: { id },
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      })
        .then(res => {
          console.log(res);
          this.posts.like += this.posts.like;
          this.$message({
            message: "恭喜你，点赞成功！",
            type: "success"
          });
        })
        .catch(error => {
          this.$message({
            message: "点赞过了呢",
            type: "warning"
          });
        });
    },
    //图片上传方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      console.log(this.dialogImageUrl);

      this.dialogVisible = true;
    },
    coverSuccess(response) {
      // console.log(response);
      // 如果文件上传成功，将本次上传成功的url保存
      this.comment.pics.push(response[0]);
      console.log(this.comment.pics);
    },
    // 移除封面图片钩子函数
    // eslint-disable-next-line no-unused-vars
    coverRemove(file, fileList) {
      let id = file.response.data.id;
      for (let i = 0; i < this.comment.pics.length; i++) {
        if (this.comment.pics[i].id === id) {
          // 找到了，就是你
          this.comment.pics.splice(i, 1);
          break;
        }
      }
    },
    getReply(data) {
      this.isShow = true;
      document.querySelector(".el-textarea__inner").focus();
      this.replyName = data.account.nickname;
      this.comment.follow = data.id;
    },
    removeReply() {
      this.isShow = false;
      delete this.comment.id;
    }
  },
  components: {
    detailAside,
    comment
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  .main {
    width: 700px;

    h1 {
      width: 100%;
      padding: 20px 0;
      border-bottom: 1px solid #ddd;
    }
    .post-info {
      color: #999;
      padding: 20px;
      text-align: right;
      span {
        margin-left: 20px;
      }
    }
    .post-ctrr {
      padding: 50px 0 30px;

      .ctrl-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 20px;
        cursor: pointer;
        i {
          display: block;
          font-size: 30px;
          color: orange;
        }
      }
    }
    .cmt-wrapper {
      margin-bottom: 20px;
      .cmt-title {
        font-weight: 400;
        font-size: 18px;
        margin-bottom: 20px;
      }
      .replyTag {
        margin-bottom: 10px;
      }
    }
  }
  .el-textarea {
    margin-bottom: 10px;
  }
  /deep/.post-content {
    line-height: 1.5;
    img {
      max-width: 700px;
    }
  }
  #btn {
    margin-top: 100px;
  }
  .aside {
    width: 280px;
    // 相关攻略
  }
  .cmt-list {
    border: 1px solid #ddd;
    margin-bottom: 22px;
  }
}
</style>