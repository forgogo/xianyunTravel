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
    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="userForm.captcha" maxlength="6">
        <template slot="append">
          <el-button @click="handleSendCaptcha" id="btn">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="nickname">
      <el-input v-model="userForm.nickname" placeholder="你的名字" maxlength="8"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="userForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="userForm.checkPass" placeholder="确认密码"></el-input>
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
      let reg = /^.{6,12}$/;
      if (!value) {
        callback(new Error("密码不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入6-12位密码"));
      } else {
        callback(this.$refs.userForm.validateField("checkPass"));
      }
    };
    var validateUserName = (rule, value, callback) => {
      let reg = /^13[1-9]\d{8}$/;
      if (value === "") {
        callback(new Error("请输入用户名/手机"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确手机号码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        username: "",
        password: "",
        nickname: "",
        captcha: "", //	手机验证码
        checkPass: "" //确认密码
      },
      rules: {
        username: [{ validator: validateUserName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(userForm) {
      this.$refs[userForm].validate(valid => {
        // console.log(this.userForm);
        if (valid) {
          //   const { checkPass, ...props } = this.userForm;

          //   this.$axios({
          //     url: `/accounts/register`,
          //     method: "POST",
          //     data: props
          //   })
          //     .then(res => {
          //       console.log(res.data);
          //       this.$message({
          //   message: '恭喜你，注册成功',
          //   type: 'success'
          // });
          //     })
          //     .catch(error => {
          //       console.log(error.message);

          //       this.$message.error("手机验证码错误");
          //     });
          this.$store.dispatch("user/register", this.userForm).then(res => {
            // console.log(res);
            if (res) {
              // 成功提示
              this.$message({ message: "注册成功，正在跳转", type: "success" });
              // 跳转到首页
              setTimeout(() => {
                this.$router.replace("/");
              }, 1000);
            } else {
              this.$message.error("用户名或密码错误！");
            }
          });
        }
      });
    },
    handleSendCaptcha() {
      if (!this.userForm.username) {
        this.$message.error("手机号码不能为空");
        return;
      }
      this.$axios({
        data: { tel: this.userForm.username },
        url: "/captchas",
        method: "post"
      })
        .then(res => {
          console.log(res);
          const btn = document.querySelector("#btn");
          const span = document.querySelector("#btn>span");
          btn.disabled = true;
          let time = +btn.dataset.time || 60;

          const timerId = setInterval(function() {
            time--;
            span.innerHTML = time + "s";
            if (time === 0) {
              btn.disabled = false;
              span.innerHTML = "获取验证码";
              // 清除定时器，让倒计时效果停下来
              clearInterval(timerId);
            }
          }, 1000);
          // btn.disabled = true;
          // console.log(btn);
          this.$alert("验证码： " + res.data.code, "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        })
        .catch(error => {
          // console.log(error);
          this.$alert("还没输入手机号码哦！", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
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