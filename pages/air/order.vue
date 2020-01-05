<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <OrderForm :data="infoData" @setAllPrice='setAllPrice'/>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data="infoData" :allPrice="allPrice" />
      </div>
    </el-row>
  </div>
</template>

<script>
//订单表单组件
import OrderForm from "@/components/air/orderForm.vue";
//侧边栏
import OrderAside from "@/components/air/OrderAside.vue";
export default {
  data() {
    return {
      // 机票信息
      infoData: {
        insurances: [], // 初始化保险数据
        seat_infos: {} // 初始化座位数据
      },
      allPrice: {}
    };
  },
  mounted() {
    //获取用户信息并保存
    const params = this.$route.query;
    this.$axios({
      params,
      url: `/airs/${this.$route.query.id}`
    }).then(res => {
      this.infoData = res.data;
      this.insurances = res.data.insurances;
    });
  },
  methods: {
    setAllPrice(data) {
      this.allPrice = data;
    }
  },
  components: {
    OrderForm,
    OrderAside
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>