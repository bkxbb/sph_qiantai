module.exports = {
  productionSourceMap:false,
  
 // 关闭ESLINT校验工具
  lintOnSave:false,

  //代理跨域
  devServer: {
    proxy: {
    '/api': {// 匹配所有以 '/api'开头的请求路径
      target: 'http://gmall-h5-api.atguigu.cn',// 代理目标的基础路径
      changeOrigin: true,
      //pathRewrite: {'^/api': ''}//代理服务器将请求地址转给真实服务器时会将 /api 去掉
    },
  
  }
}


}
