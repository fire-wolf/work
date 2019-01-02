// pages/famous/famousList/famousList.js
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    title:'',
    famousList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.showLoading({
      title: '加载中...',
    })

    //app.login((res)=>{
      if (app.globalData.isLogin){
        this.setData({
          userId: app.globalData.userInfo.userId
        })
        this.getFamousHistoryList();
      }else{
        this.getTopList();
      }
    //})
  }, 
  getFamousHistoryList: function() {
    wx.request({
      url: URL.getFamousHistoryList,
      data: {
        page: 1,
        userId: this.data.userId
      },
      success: (res) => {
        if (res && res.data.success && res.data.data && res.data.data.list && res.data.data.list.length>0) {
          this.setData({
            famousList: res.data.data.list,
            title: res.data.data.dataType == 'top' ? '热门推荐' : '最近浏览'
          })
          wx.hideLoading();
        }else{
          this.getTopList()
        }
      },
      fail: (msg) => {
        wx.hideLoading();
      }
    })
  },

  getTopList: function () {
    wx.request({
      url: URL.getFamousTopList,
      data: {
        page: 1,
      },
      success: (res) => {
        if(res && res.data.success && res.data.data){
          this.setData({
            famousList: res.data.data,
            title: '热门推荐'
          })
        }
        wx.hideLoading();
      },
      fail: (msg) => {
        wx.hideLoading();
      }
    })
  },

  toFamousDetail:function(e){
    wx.navigateTo({
      url: '/pages/topic/famous/detail/detail?companyId=' + e.currentTarget.dataset.companyid
    })
  },

  toSearch: function(e){
    wx.navigateTo({ 
      url: '/pages/topic/famous/search/search'
    })
  },
})