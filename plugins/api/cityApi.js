import axios from 'axios'

//城市查询

export const getCity =(params)=>{
    return axios({
        url: `/airs/city`,
        params
    })
}