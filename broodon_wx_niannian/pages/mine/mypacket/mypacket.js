var app = getApp(),
  URL = app.globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIdentify: true,
    balance: '0.00',
    yunMediaRoot: URL.yunMediaRoot, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBalance();
    wx.setNavigationBarTitle({
      title: '钱包',
    })
  },
  getBalance: function() {
    var that = this;
    wx.request({
      url: URL.getBalance,
      data: {
        userId: app.globalData.userInfo.userId,
      },
      method: 'GET',
      success: function(res) {
        if (res && res.data) {
          that.setData({
            balance: res.data.balance ? parseFloat(res.data.balance).toFixed(2):'0.00'
          })
        }
      },
    })
  },
  toIdentify: function() {
    wx.navigateTo({
      url: '/pages/mine/identify/identify',
    })
  },
  toTakeMoney: function() {
    this.getIDnumber(() => {
      wx.navigateTo({
        url: '/pages/mine/takemoney/takemoney?balance='+this.data.balance,
      })
    })
  },
  toRecord: function(e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/mine/record/record?type=' + type,
    })
  },
  //获取用户认证信息
  getIDnumber: function(callback) {
    var that = this;
    wx.request({
      url: URL.getIDnumber,
      data: {
        userId: app.globalData.userInfo.userId || '',
        devKey: 'default'
      },
      method: 'GET',
      success: function(res) {
        if (res && res.data) {
          if (res.data.success) {
            that.setData({
              isIdentify: true
            })
            callback && callback();
          } else {
            that.setData({
              isIdentify: false
            })
          }
        }
      },
    })
  },
})