
import Utils from '../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    isShowLogin: false,
    isShowClose: false,
  },

  /**
   * 生命周期函数--监听页面加载 userId:1349638
   */
  onLoad: function (options) {
    var that = this;
    //wx.showTabBar();
    Utils.setNavigationBar("我的", "#000000", "#F1F3F5");

    this.login = this.selectComponent('#login');
    this.setData({
      url: app.globalData.myLink
    })
    // app.login(() => {
    //   if (app.globalData.isLogin) {
    //     that.initData();
    //   } else {
    //     that.setData({
    //       isShowLogin: true
    //     })
    //     app.globalData.cacheFun = function () {
    //       that.initData();
    //     };
    //   }
    // })
  },

  initData: function() {
    var that = this;
    wx.request({
      url: URL.getMyLink,
      data: {
        openId: app.globalData.userInfo.openId,
        userId: app.globalData.userInfo.userId,
      },
      success: (res) => {
        if (res.data && res.data.data && res.data.success) {
          that.setData({
            isShowLogin: false,
            url: res.data.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  onShow: function () {
   
  },

})