import axios from 'axios'

//城市查询

export const getCity =(params)=>{
    return axios({
        url: `/airs/city`,
        params
    })
}
//获取城市方法封装

// export const querySearchAsync = (queryString)=>{
//       //获取城市数据方法封装
      
//         return new Promise((resolve, reject) => {
//           //如果用户没有输入关键词 则返回空
//           if (!queryString) {
//             return resolve([]);
//           }
  
//           axios({
//             url: "/airs/city",
//             params: { name: queryString } //用户输入的关键词
//           }).then(res => {
//             // console.log(res);
//             const { data } = res.data;
//             // 下拉提示列表必须要有value字段
//             //.map 遍历并重组  返回新的对象、//由于服务器要求返回的城市名称不能带有市 所以要便数组 发挥新
//             const arr = data.map(v => {
//               return {
//                 ...v,
//                 value: v.name.replace("市", "")
//               };
//             });
//             // console.log(arr);
  
//             resolve(arr);
//           });
//         });
      
// }