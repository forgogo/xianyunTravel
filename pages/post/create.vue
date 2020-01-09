<template>
  <div class="container">
    <div class="el-row is-justify-space-between el-row--flex">
      <div class="main">
        <h2>发表新攻略</h2>
        <p class="create-desc">分享你的个人游记，让更多人看到哦！</p>
        <!-- 表格 -->
        <el-form :model="postForm" ref="postForm" class="demo-ruleForm">
          <el-form-item :prop="postForm.title" :rules="[{ required: true, message: '标题不能为空'}]">
            <el-input placeholder="请输入标题" v-model="postForm.title" autocomplete="off"></el-input>
          </el-form-item>
          <input
            type="file"
            style="display: none;"
            id="getFile"
            @change="selectContentImg($event)"
            accept="image/gif, image/jpeg, image/jpg, image/png"
          />
          <!-- 富文本框 -->
          <div
            class="quill-editor"
            :content="postForm.content"
            @change="onEditorChange($event)"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            v-quill:myQuillEditor="editorOption"
          ></div>
          <!-- 选择城市 -->
          <el-form-item label="出发城市">
            <!-- fetch-suggestions 返回输入建议的方法 -->
            <!-- select 点击选中建议项时触发 -->
            <el-autocomplete
              v-model="city"
              :fetch-suggestions="queryearch"
              placeholder="请搜索出发城市"
              @select="handleSelect"
              class="el-autocomplete"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('postForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="aside">
        <div class="draft-box">
          <h4 class="draft-title">草稿箱（0）</h4>
          <div class="draft-list"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quillConfig from "@/plugins/quill-config.js";

export default {
  data() {
    return {
      city: "",
      postForm: {
        title: "", //文章标题
        city: "", //城市id | 城市名称
        content: "" //文章内容
      },

      // 富文本框属性
      editorOption: {
        // some quill options
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              ["image"]
            ],
            handlers: {
              image: function() {
                // 意思是使用插入图片的功能时候，触发文件上传控件的点击事件
                document.getElementById("getFile").click();
              }
            }
          }
        }
      }
    };
  },
  methods: {
    submitForm(postForm) {
      this.$refs[postForm].validate(valid => {
        if (valid) {
          const {
            user: { userInfo }
          } = this.$store.state;
          this.$axios({
            method: "post",
            url: "/posts",
            headers: {
              Authorization: `Bearer ${userInfo.token || "NO TOKEN"}`
            },
            data: this.postForm
          }).then(res => {
            this.$message({
              message: "恭喜你，发布成功",
              type: "success"
            });

            this.city = "";
            this.postForm.title = "";
            this.postForm.content = "";
            this.postForm.city = "";
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 选择城市方法
    handleSelect(item) {
      // console.log(item);
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryearch(value, cb) {
      const arr = await this.querySearchAsync(value);
      if (arr.length > 0) {
        // 不在下拉列表中选择，则默认选择第一项
        this.city = arr[0].value;
        this.postForm.city = arr[0].id;
      }
      // console.log(arr);
      cb(arr);
    },
    //获取城市数据方法封装
    querySearchAsync(queryString) {
      return new Promise((resolve, reject) => {
        //如果用户没有输入关键词 则返回空
        if (!queryString) {
          return resolve([]);
        }

        this.$axios({
          url: "/airs/city",
          params: { name: queryString } //用户输入的关键词
        }).then(res => {
          // console.log(res);
          const { data } = res.data;
          // 下拉提示列表必须要有value字段
          //.map 遍历并重组  返回新的对象、//由于服务器要求返回的城市名称不能带有市 所以要便数组 发挥新
          const arr = data.map(v => {
            return {
              ...v,
              value: v.name.replace("市", "")
            };
          });
          // console.log(arr);

          resolve(arr);
        });
      });
    },
    // 富文本框方法
    onEditorBlur(editor) {
      // console.log("editor blur!", editor);
      // this.postForm.content=editor
    },
    onEditorFocus(editor) {
      // console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      // console.log("editor ready!", editor);
    },
    onEditorChange({ editor, html, text }) {
      // console.log("editor change!", editor, html, text);
      this.postForm.content = html;
    },
    // 选择图片之后的处理
    selectContentImg(e) {
      let file = e.target.files;
      if (file.length > 0) {
        let data = new FormData();
        for (let item of file) {
          data.append("files", item);
        }
        const request = new XMLHttpRequest();
        request.open("POST", "http://127.0.0.1:1337/upload");

        request.send(data);
        request.onload = data => {
          this.postForm.content += `<img src="http://127.0.0.1:1337${
            data.target.responseText.split(",")[7].split('"')[3]
          }" alt="内容图片">`;
        };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
  .main {
    font-weight: 400;
    font-size: 22px;
    margin-bottom: 10px;
    width: 750px;
    .el-input {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 100%;
    }
  }
  .create-desc {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
  }
  .aside {
    width: 200px;
    .draft-box {
      border: 1px solid #ddd;
      padding: 10px;
    }
    .draft-title {
      margin-bottom: 10px;
      font-weight: 400;
      color: #666;
    }
  }
}
.quill-editor,
.quill-code {
  height: 20rem;
}
.quill-editor {
  border: 1px solid #ccc !important;
  border-bottom: none;
  margin-bottom: 22px;
}
.quill-code {
  border: none;
  height: auto;
  > code {
    width: 100%;
    margin: 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0;
    height: 10rem;
    overflow-y: auto;
  }
}
</style>