import Vue from 'vue'
import App from './App'
// 小程序上需要导入包，发送axios
import {$http} from '@escook/request-miniprogram'
// 在顶级对象uni上挂载$http的方法做请求
uni.$http = $http
$http.baseUrl = 'https://www.uinav.com'

Vue.config.productionTip = false
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}
// 封装请求成功的函数
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
