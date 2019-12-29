//vuex 仓库 
//保存 user下的数据
export const state = {
  // name: "1223"
  userInfo: {} //登录后的数据，包含token和user对象
}

//同步修改state的数据
export const mutations = {
  //mutations函数的第一个参数必须是state，state就是上面的state对象
  setUserInfo(state, data) {
    state.userInfo = data
  }

}
//异步修改state的数据
export const actions = {
  login({commit}, data) {
    return this.$axios({
      url: '/accounts/login',
      method: 'post',
      data: data
    }).then(res => {
         console.log(res.data);
      const data = res.data
      //保存到vuex仓库 state 
      commit("setUserInfo",data)
      return true
    }).catch(error => {  return false})
  }

}
