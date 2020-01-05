<template>
  <div class="main">
    <div class="air-column">
      <h2>剩机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in userForm.users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input v-model="item.username" placeholder="姓名" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input v-model="item.id" placeholder="证件号码" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in data.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×${userForm.users.length}  最高赔付${item.compensation}元`"
            @change="handleInsurance(item.id)"
            border
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="userForm.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="userForm.contactPhone" placeholder="请输入手机号码">
              <template slot="append">
                <el-button @click="handleSendCaptcha" id="btn">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="userForm.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
    <input type="hidden" :value="allPrice" />
  </div>
</template>

<script>
import { captCode } from "@/plugins/api/cityApi";
export default {
  props: {
    // 接收机票信息
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      userForm: {
        contactName: "", //联系人名字
        contactPhone: "", //手机号码
        insurances: [], //保险id
        invoice: false, //发票
        captcha: "", //验证码
        seat_xid: "", //座位id
        air: "", //航班id
        users: [
          {
            username: "",
            id: ""
          }
        ]
      }
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.userForm.users = [
        ...this.userForm.users,
        {
          username: "",
          id: ""
        }
      ];
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.userForm.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      if (!this.userForm.contactPhone) {
        this.$message.error("手机号码不能为空");
        return;
      }
      this.$axios({
        data: { tel: this.userForm.contactPhone },
        url: "/captchas",
        method: "post"
      })
        .then(res => {
          const btn = document.querySelector("#btn");
          const span = document.querySelector("#btn>span");
          btn.disabled = true;
          let time = +btn.dataset.time || 60;

          const timerId = setInterval(function() {
            time--;
            span.innerHTML = "（已发送）" + time + "s";
            if (time === 0) {
              btn.disabled = false;
              span.innerHTML = "获取验证码";
              // 清除定时器，让倒计时效果停下来
              clearInterval(timerId);
            }
          }, 1000);
          this.$alert("验证码： " + res.data.code, "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        })
        .catch(error => {
          this.$alert("还没输入手机号码哦！", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        });
    },
    //选择保险
    handleInsurance(id) {
      // 存在则去除
      if (this.userForm.insurances.indexOf(id) > -1) {
        //slice(0) 创建一个与原始数组相同的新数组
        let arr = this.userForm.insurances.slice(0);
        arr.splice(this.userForm.insurances.indexOf(id), 1);
        this.userForm.insurances = arr;
      } else {
        // 不存在添加到insurances
        //new Set 数组去重 es6新语法
        this.userForm.insurances = [
          ...new Set([...this.userForm.insurances, id])
        ];
      }
    },

    // 提交订单
    handleSubmit() {
      const params = this.$route.query;

      this.userForm.air = params.id;
      this.userForm.seat_xid = params.seat_xid;
      // 结构  等价于 userInfo =this.$store.state.user
      const {
        user: { userInfo }
      } = this.$store.state;
      console.log(this.userForm);

      this.$axios({
        url: `/airorders`,
        method: "POST",
        data: this.userForm,
        headers: {
          Authorization: `Bearer ${userInfo.token || "NO TOKEN"}`
        }
      }).then(res => {
        console.log(res);

        // 跳转到付款页
        this.$router.push({
          path: "/air/pay"
        });
      });
    }
  },
  computed: {
    // 计算总价格
    allPrice() {
      let price = 0;
      let len = this.userForm.users.length; //有几个乘客
      price += this.data.seat_infos.org_settle_price * len + 50 * len; //乘客 乘 乘客数量 并且加上燃油附加费
      price +=
        this.userForm.insurances.length * this.userForm.users.length * 30; //保险费费用
      const data = { price, len };
      // 触发设置总金额事件
      this.$emit("setAllPrice", data);

      return price;
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>