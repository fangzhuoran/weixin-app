export  async function getList(api,list){
  const {
      data: res
    } = await uni.$http.get(api)
    if (res.meta.status != 200) return uni.$showMsg()
    this.list = res.message
}