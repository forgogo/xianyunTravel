<template>
  <div class="menus">
    <div v-for="(item,index) in cities" :key="index">
      <div
        :class="[{active:index === currentTab},'menus-item']"
        @mouseenter="onMouseOver(index)"
        @mouseleave="onMouserOut(index)"
      >
        <span>{{item.type}}</span>
        <i class="el-icon-arrow-right"></i>
      </div>

      <div
        class="sub-menus"
        v-show="index === currentTab"
        @mouseenter="onMouseOver(index)"
        @mouseleave="onMouserOut(index)"
      >
        <ul>
          <li v-for="(item,index) in item.children" :key="index">
            <a href="#" class>
              <i>{{index+1}}</i>
              <strong @click="search(item.city)">{{item.city}}</strong>
              <span @click="search(item.city)">{{item.desc}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      cities: [],
      currentTab: ""
    };
  },
  mounted() {
    this.$axios({
      url: "/posts/cities"
    }).then(res => {
      this.cities = res.data.data;
    });
  },
  methods: {
    onMouseOver(index) {
      this.currentTab = index;
      this.isShow = !this.isShow;
    },
    onMouserOut() {
      this.currentTab = "";
      this.isShow = !this.isShow;
    },
    search(city) {
    this.$emit('asideSearch',city)
    }
  }
};
</script>

<style lang="less" scoped>
.menus {
  width: 260px;
  border: 1px solid #ddd;
  border-right: none;
  border-bottom: none;
  box-shadow: 0 0 1px #f5f5f5;
  z-index: 2;
  background-color: #fff;
  .menus-item {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 0 20px;
    font-size: 14px;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.sub-menus {
  position: absolute;
  right: -351px;
  top: 0;
  width: 350px;
  border: 1px solid #ddd;
  background-color: #fff;
  z-index: -1;
  ul {
    li {
      padding: 3px 15px;
      a {
        i {
          font-size: 26px;
          color: orange;
        }
        strong {
          color: orange;
        }
        span {
          color: #9999b3;
        }
      }
    }
  }
}
.active {
  color: orange;
  border-right: none !important;
}
</style>