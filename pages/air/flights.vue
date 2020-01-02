<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->

        <!-- 航班列表 -->
        <flightsItem v-for="(item, index) in dataList" :key="index" :data="item" />
        <div class="block">
          <!-- size-change：切换条数的时候触发 -->
          <!-- current-page：选择页数的时候触发  -->
          <!-- current-page: 当前页数 -->
          <!-- page-size：当前条数 -->
          <!-- total：总条数 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="flightsData.total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
//机票头部组件
import FlightsListHead from "@/components/air/flightsListHead.vue";
//机票组件
import FlightsItem from "@/components/air/flightsItem.vue";
import moment from "moment";

export default {
  data() {
    return {
      flightsData: {}, //这段航班的所有数据
      dataList: {}, //机票详细信息
      //分页插件的属性
      currentPage: 1, //默认显示第一页
      pageIndex: 1, // 当前页数
      pageSize: 2 //当前显示的条数
    };
  },
  methods: {
    getData() {
      this.$axios({
        url: `/airs`,
        params: this.$route.query //获取由url传过来的5个参数
      }).then(res => {
        this.flightsData = res.data;

        // this.dataList = res.data.flights;
        this.setDataList(); //初始化dataList数据 将切割后保存的数组放进去 显示过的不再出现

        // console.log(this.flightsData);
      });
    },
    // 分页插件的方法
    //创建方法
    setDataList() {
      //开始的数据
      const start = (this.pageIndex - 1) * this.pageSize;
      //最后一天数据的位置
      const end = start + this.pageSize;
      //将数据切割
      this.dataList = this.flightsData.flights.slice(start, end);
    },
    // 切换条数时触发
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      //   console.log(11);

      this.pageSize = val;
      this.pageIndex = 1;
      this.setDataList();
    },
    handleCurrentChange(val) {
      this.pageIndex = value;
      this.setDataList();
    }
  },
  mounted() {
    this.getData();
  },
  components: {
    FlightsListHead,
    FlightsItem
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>