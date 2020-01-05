//vuex 仓库 
//保存 user下的数据
export const state = () => ({

  history: [],
  Price: {
    people: '1',
    insurances: '',
    price:""
  },
})

//同步修改state的数据
export const mutations = {
  //mutations函数的第一个参数必须是state，state就是上面的state对象
  setHistory(state, data) {
    state.history.unshift(data)
  },
  setTotalPrice(state, data) {
    state.total = data
  }

}
//异步修改state的数据
export const actions = {


}
