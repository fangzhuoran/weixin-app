<template>
  <view class="search-box">
    <!-- 使用 uni-ui 提供的搜索组件 -->
    <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        showSync: true,
        searchVal: "",
        timer: null, // 延时器的 timerId
        kw: '', // 搜索关键词
        searchResults: [], // 搜索结果列表
        historyList: ['a', 'app', 'apple'], // 搜索关键词的历史记录
      };
    },
    methods: {
      input(e) {
        clearTimeout(this.timer)
        // 重新启动一个延时器，并把 timerId 赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e
          this.getSearchList()
        }, 500)
      },
      // 根据搜索关键词，搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        // 发起请求，获取搜索建议列表
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 搜索关键词存储到history中
        this.saveSearchHistory()
      },
      // 搜索建议跳转
      gotoDetail(goods_id) {
        uni.navigateTo({
          // 指定详情页面的 URL 地址，并传递 goods_id 参数
          url: '/subpkg/good_detail/good_detail?goods_id=' + goods_id
        })
      },
      saveSearchHistory() {
        this.historyList.push(this.kw)
        // 防止出现重复历史记录
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        // 这里需要转换一下，避免是伪数组
        this.historyList = Array.from(set)
        //持久化，保存到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      onLoad() {
        this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
      },
      // 清空搜索历史记录
      cleanHistory() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      // 点击跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    computed: {
      historys() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 设置定位效果为“吸顶”
    position: sticky;
    // 吸顶的“位置”
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;

    .sugg-list {
      padding: 0 5px;

      .sugg-item {
        font-size: 12px;
        padding: 13px 0;
        border-bottom: 1px solid #efefef;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .goods-name {
          // 文字不允许换行（单行文本）
          white-space: nowrap;
          // 溢出部分隐藏
          overflow: hidden;
          // 文本溢出后，使用 ... 代替
          text-overflow: ellipsis;
          margin-right: 3px;
        }
      }
    }

    .history-box {
      padding: 0 5px;

      .history-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 13px;
        border-bottom: 1px solid #efefef;
      }

      .history-list {
        display: flex;
        flex-wrap: wrap;

        .uni-tag {
          margin-top: 5px;
          margin-right: 5px;
        }
      }
    }
  }

  .uni-searchbar {
    display: flex;
    flex-direction: row;
    position: relative;
    padding: 16rpx;
    background-color: #c00000;
  }
</style>
