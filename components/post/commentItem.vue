<template>
  <div>
    <div class="cmt-floor">
            <mycomment v-if='comment.parent' :comment='comment.parent' @reply="sendComment"/>
        <div class="cmt-content">
      <div class="cmt-info">
        {{comment.account.nickname}}
        <i> {{comment.updated_at | checkTime}}</i>
        <span>{{comment.level}}</span>
      </div>
      <p class="cmt-message">{{comment.content}}</p>
      <div class="el-row el-row--flex">
        <div class="cmt-pic" :v-if="item.pics" v-for="(item,index) in comment.pics" :key="index">
          <img :src="'http://127.0.0.1:1337'+item.url" alt="">
        </div>
      </div>
      <div class="cmt-ctrl">
        <a href="javascript:;" @click="sendComment(comment)">回复</a>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { checkTime } from "@/plugins/timeFilter.js";
export default {
     name: "mycomment",
    props: ["comment"],
     methods:{
    sendComment(comment){
      this.$emit("reply",comment)
    }
  },
  filters: {
    checkTime
  }
   
};
</script>

<style lang="less" scoped>
/deep/.cmt-floor {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 2px;
  .cmt-content {
    padding: 5px 10px 0;
    .cmt-info {
      font-size: 12px;
      color: #666;
      i {
        color: #999;
      }
      span {
        float: right;
      }
    }
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
</style>