var app = getApp(), URL = app.globalData.URL;

Page({
  data: {
    userId: '', //2562788
    themeList: [],
    pageNo: 1,
    isBtnClick: false,
    isEnd: false
  },

  getData: function(){
    if (this.data.isBtnClick) return false;
    this.setData({ isBtnClick: true})
    wx.request({
      url: URL.getSuseumTopicList,
      data: {
        page: this.data.pageNo,
        userId: this.data.userId
      },
      success: (res) => {
        if (res && res.data.success && res.data.data) {
          var themeList = this.data.themeList;
          themeList = themeList.concat(res.data.data)
          console.log(themeList)
          this.setData({
            themeList: themeList,
            isBtnClick: false,
            pageNo: this.data.pageNo + 1
          })
        }
      }
    })
  },

  onReachBottom: function(){
    this.getData();
  },

  onLoad: function (options) {
    if(app.globalData.isLogin){
      this.setData({
        userId: app.globalData.userInfo.userId
      })
    }
    this.getData();
  },

})