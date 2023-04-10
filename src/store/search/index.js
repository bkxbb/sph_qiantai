import {reqGetSearchInfo} from '@/api'
//search模块的小仓库
//state:仓库，存储数据的地方
const state={
  searchList:{}
}
//mutations:修改state的唯一手段
const mutations={
  GETSEARCHLIST(state,searchList){
    state.searchList=searchList
  }
}
//actions:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions={
  //这里可以书写业务逻辑，但是不能修改state
  async getSearchList({commit},params={}){
    //reqGetSearchInfo这个函数在调用获取服务器数据的时候，至少传递一个参数（空对象）
    //params形参：是用户派发action的时候，第二个参数传递过来的
    let result = await reqGetSearchInfo(params)
    if(result.code==200){
      commit('GETSEARCHLIST',result.data)
    }
  }
}
//getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
  //当前形参state，是当前仓库state，并非大仓库中的state
  goodsList(state){
    //假如没有网|网络不给力，state.searchList.goodsList应该返回的是undefined
    //计算新属性至少给人家一个空数组
    return state.searchList.goodsList||[]
  },
  trademarkList(state){
    return state.searchList.trademarkList||[]
  },
  attrsList(state){
    return state.searchList.attrsList||[]
  },
}

export default{
  state,
  mutations,
  actions,
  getters,
}