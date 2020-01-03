<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :data="cacheFlightsData" @setDataList="setDataList" />
        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <!-- 航班列表 -->
        <flightsItem v-for="(item, index) in dataList" :key="index" :data="item" />

        <!-- size-change：切换条数的时候触发 -->
        <!-- current-page：选择页数的时候触发  -->
        <!-- current-page: 当前页数 -->
        <!-- page-size：当前条数 -->
        <!-- total：总条数 -->
        <div class="block">
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
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
//机票头部组件
import FlightsListHead from "@/components/air/flightsListHead.vue";
//筛选模块
import FlightsFilters from "@/components/air/flightsFilters.vue";
//机票组件
import FlightsItem from "@/components/air/flightsItem.vue";
//右边历史记录组件
import FlightsAside from "@/components/air/flightsAside.vue";
import moment from "moment";

export default {
  data() {
    return {
      flightsData: {
        info: {},
        options: {}
      }, //这段航班的所有数据
      // 缓存的变量，当该变量一旦被赋值之后不会被修改
      // 复制一份数据传给筛选组件进行筛选
      cacheFlightsData: {
        info: {},
        options: {},
        flights: []
      },
      //分页插件的属性
      currentPage: 1, //默认显示第一页
      pageIndex: 1, // 当前页数
      pageSize: 8 //当前显示的条数
    };
  },
  methods: {
    getData() {
      this.$axios({
        url: `/airs`,
        params: this.$route.query //获取由url传过来的5个参数
      }).then(res => {
        this.flightsData = res.data;
        // 这个是缓存的变量，一旦赋值之后不能被改
        this.cacheFlightsData = { ...res.data };

        // 总条数
        this.total = this.flightsData.total;

        // 分页初始化为1
        this.pageIndex = 1;
        // this.dataList = res.data.flights;
        this.setDataList(); //初始化dataList数据 将切割后保存的数组放进去 显示过的不再出现
      });
    },
    // 分页插件的方法
    //创建方法
    setDataList(arr) {
      if (arr) {
        this.pageIndex = 1;
        this.flightsData.flights = arr;
        this.flightsData.total = arr.length;
      }
      //开始的数据
      // const start = (this.pageIndex - 1) * this.pageSize;
      // //最后一天数据的位置
      // const end = start + this.pageSize;
      // //将数据切割
      // this.dataList = this.flightsData.flights.slice(start, end);
    },
    // 切换条数时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
    }
  },
  computed: {
    // 计算属性监听函数内部引用实例的属性变化，一旦发生了变化，该函数会重新计算，并且返回新的值
    dataList() {
      // 请求如果还没完成，返回空数组
      if (!this.flightsData.flights) return [];

      // 计算分页的数据
      return this.flightsData.flights.slice(
        // 假如第2页 就会把第2页之前的都切割掉 只显示后面的
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
    }
  },
  mounted() {
    this.getData();
  },
  watch: {
    $route() {
      this.getData();
    }
  },
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
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
.block {
  text-align: center;
}
.aside {
  width: 240px;
}
</style>