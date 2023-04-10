//配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
//使用插件
Vue.use(VueRouter)
import routes from './routes'
//引入store
import store from '@/store'
//先把VueRouter原型对象的push，先保存一份
let originPush=VueRouter.prototype.push
let originReplace=VueRouter.prototype.replace

//重写push|replace
//第一个参数：告诉原来push方法，你往哪里跳转（传递那些参数）
//第二个参数：成功的回调
//第三个参数：失败的回调
VueRouter.prototype.push=function (location,resolve,reject) {
  if(resolve&&reject){
    //call与apply区别
    //相同：都可以调用函数一次，都可以篡改函数的上下文一次
    //不同：call传递参数用逗号隔开，apply方法执行，传递数组
    originPush.call(this,location,resolve,reject)
  }else{
    originPush.call(this,location,()=>{},()=>{})
  }
}

VueRouter.prototype.replace=function (location,resolve,reject) {
  if(resolve&&reject){
    originReplace.call(this,location,resolve,reject)
  }else{
    originReplace.call(this,location,()=>{},()=>{})
  }
}

//配置路由
let router = new VueRouter({
  //配置路由
  routes,
  //滚动行为
  scrollBehavior(to, from, savedPosition) {
    // y=0代表滚动条在最上方
    return { y:0 }
  },
})
//全局守卫：前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to,from,next)=>{
  //to:可以获取到你要跳转到那个路由
  //from:可以获取到你从那个路由而来
  //next:放行函数   可放行到指定路由:next('/')   next(false)
  // next()
  //用户登录了，才会有token
  let token = store.state.user.token
  //用户信息
  let name=store.state.user.userInfo.name
  if(token){
    //用户已经登录了，还想去login[不能去]
    if(to.path=='/login'||to.path=='/register'){
      next('/home')
    }else{
      //登录了，但去的不是login
      //如果用户名已有
      if(name){
        next()
      }else{
        //没有用户信息,派发action让仓库存储用户信息再跳转
        try {
          //获取用户信息成功
          await store.dispatch('getUserInfo')
          next()
        } catch (error) {
          //token失效了,获取不到用户信息，重新登录
          //清除token
          await store.dispatch('userLogout')
          next('/login')
        }
      }
    }
  }else{
    //未登录,不能去交易相关、支付相关、个人中心
    let toPath=to.path
    if(toPath.indexOf('/trade')!=-1||toPath.indexOf('/pay')!=-1||toPath.indexOf('/center')!=-1){
      //把未登录的时候想去而没有去成的信息，存储于地址栏中【路由】
      next('/login?redirect='+toPath)
    }else{
      next()
    }
  }
})


export default router