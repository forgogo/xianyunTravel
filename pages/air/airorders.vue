<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{orderDetails.base_price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import { async } from "q";
export default {
  data() {
    return {
      orderDetails: "",
      orderNo: "",
      nonce_str: "",
      timer: null
    };
  },
  mounted() {
    // 这个处理方法是有缺陷的，不100%准确
    // userInfo在页面加载完才赋值
    setTimeout(v => {
      const { id } = this.$route.query;
      const {
        user: { userInfo }
      } = this.$store.state;

      // 请求二维码
      this.$axios({
        url: `airorders/${id}`,
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      }).then(res => {
        console.log(res);
        this.orderNo = res.data.orderNo;
        this.nonce_str = res.data.nonce_str;
        this.orderDetails = res.data.air;
        // price 用于展示
        const { payInfo, price } = res.data;

        // 生成二维码到canvas
        const stage = document.querySelector("#qrcode-stage");
        QRCode.toCanvas(stage, payInfo.code_url, {
          width: 200
        });
        //查询是否付款成功
        this.timer = setInterval(async () => {
          const isResolve = await this.checkPay();
          console.log(isResolve);
          if (isResolve) {
            clearInterval(this.timer);
           
            return ;
          }
        }, 1000);
      });
    }, 200);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    async checkPay() {
      const { id } = this.$route.query;
      const {
        api,
        user: { userInfo }
      } = this.$store.state;
      this.$axios({
        url: "/airorders/checkpay",
        method: "post",
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        },
        data: {
          id,
          nonce_str: this.nonce_str,
          out_trade_no: this.orderNo
        }
      }).then(res => {
        const { statusTxt } = res.data;

        if (statusTxt === "支付完成") {
          this.$confirm("订单支付成功", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "success"
          }).then(_=>{
               this.$router.push('/');
          });

          clearInterval(this.timer);
        }

        return Promise.resolve(false);
      });
    }
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>