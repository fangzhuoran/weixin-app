<template>
  <view>
    <view class="goods-list">
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
        <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
        <my-goods :goods="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query: '', // 查询关键词
          cid: '', // 商品分类Id
          pagenum: 1, // 页码值
          pagesize: 10 // 每页显示多少条数据  
        },
        goodsList: [], // 商品列表的数据
        total: 0, // 总数量，用来实现分页
        isloading: false // 是否正在请求数据
      }
    },
    onLoad(options) {
      // 将页面参数转存到 this.queryObj 对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        this.isloading = true
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isloading = false
        // 只要数据请求完毕，就立即按需调用 cb 回调函数
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值,涉及触底加载更多，在原先的基础上加上
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 触底的事件
      onReachBottom() {
        if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
        // 节流阀，避免多次触底，发送多次请求
        if (this.isloading) return
        this.queryObj.pagenum += 1
        console.log(this.queryObj.pagenum)
        this.getGoodsList()
      },
      // 下拉刷新的事件,重置数据
      onPullDownRefresh() {
        this.queryObj.pagenum = 1
        this.total = 0
        this.isloading = false
        this.goodsList = []
        this.getGoodsList(() => uni.stopPullDownRefresh())
      },
      // 点击跳转到商品详情页面
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/good_detail/good_detail?goods_id=' + item.goods_id
        })
      }
    },
  }
</script>

<style lang="scss">

</style>
