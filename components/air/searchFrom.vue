<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      //时间控制
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        }
      },
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0, //搜索顶部tab切换
      form: {
        departCity: "", // 出发城市
        departCode: "", // 出发城市代码
        destCity: "", // 到达城市
        destCode: "", // 到达城市代码
        departDate: "" // 日期字符串
      }
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {
      this.currentTab = index;
      if ((this.currentTab = 1)) {
        this.$message.error("还没往返的卖");
        this.currentTab = 0;
        return;
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDepartSearch(value, cb) {
      const arr = await this.querySearchAsync(value);
      if (arr.length > 0) {
        // 不在下拉列表中选择，则默认选择第一项
        this.form.departCity = arr[0].value;
        this.form.departCode = arr[0].sort;
      }
      cb(arr);
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async queryDestSearch(value, cb) {
      const arr = await this.querySearchAsync(value);
      if (arr.length > 0) {
        // 不在下拉列表中选择，则默认选择第一项
        this.form.destCity = arr[0].value;
        this.form.destCode = arr[0].sort;
      }
      // console.log(arr);
      cb(arr);
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      console.log(item);
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {},

    // 确认选择日期时触发
    handleDate(value) {
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;

      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      // 自定义校验规则 （通过状态来判断）
      const rules = {
        departCity: {
          value: this.form.departCity,
          err_message: "出发城市不能为空"
        },
        destCity: {
          value: this.form.destCity,
          err_message: "到达城市不能为空"
        },
        departDate: {
          value: this.form.departDate,
          err_message: "出发日期不能为空"
        }
      };
      let valid = true;
      //  Object.keys(rules) 方法返回的是一个数组
      Object.keys(rules).forEach(key => {
        if (valid === false) return;

        if (rules[key].value === "") {
          this.$message.error(rules[key].err_message);
          valid = false;
          return;
        }
      });
      if (valid === false) return;

      this.$store.commit('air/setHistory', this.form)
      
      this.$router.push({
        path: "/air/flights",
        query: this.form
      });
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
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>