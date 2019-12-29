<template>
  <el-form
    :model="userForm"
    status-icon
    :rules="rules"
    ref="userForm"
    label-width="100px"
    class="demo-userForm"
  >
    <el-form-item prop="username">
      <el-input v-model="userForm.username" autocomplete="off" placeholder="用户名/手机"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input type="password" v-model.number="userForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <p class="form-text">
      <a href="/user/login#">忘记密码</a>
    </p>
    <el-form-item>
      <el-button type="primary" id="btn" @click="submitForm('userForm')">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名/手机"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: validateUserName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(userForm) {
      this.$refs[userForm].validate(valid => {
        if (valid) {
          //    this.$axios({
          //        url:'/accounts/login',
          //        method:'post',
          //        data:this.userForm
          //    }).then(res=>{
          //     //    console.log(res.data);
          //     const data =res.data
          //        //保存到vuex仓库 state

          //    }).catch(error=>{
          //        this.$message.error('用户名或密码错误！')
          //        console.log(error);

          //    })
          this.$store.dispatch("user/login", this.userForm).then(res => {
            // console.log(res);
            if (res) {
              // 成功提示
              this.$message({ message: "登录成功，正在跳转", type: "success" });
              // 跳转到首页
              setTimeout(() => {this.$router.replace("/");}, 1000);
            } else {
              this.$message.error("用户名或密码错误！");
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-form {
  padding: 25px;
}
/deep/.el-form-item__content {
  margin-left: 0 !important;
}
.el-button--primary {
  width: 100%;
}
.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}
.el-button--primary {
  margin-top: 10px;
}
</style>