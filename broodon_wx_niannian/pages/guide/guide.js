var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBtnClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享者信息
    app.setInviteInfo(options);

  },

  goWtite: function() {
    var that = this;
    if (this.data.isBtnClick) return false;
    this.setData({
      isBtnClick: true
    })
    app.login(function(){
      if(app.globalData.isLogin){
        app.globalData.hisUrl = "";
        wx.navigateTo({
          url: '/pages/msg/begin/begin',
          success: function(){
            setTimeout(function(){
              that.setData({
                isBtnClick: false
              })
            },2000)
          }
        })
      }else{
        app.globalData.cacheUrl = "/pages/msg/begin/begin";
        app.globalData.hisUrl = "/pages/guide/guide";
        wx.navigateTo({
          url: '/pages/login/login',
          success: function () {
            setTimeout(function () {
              that.setData({
                isBtnClick: false
              })
            }, 2000)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '?inviteActiviName=wxapp&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '?inviteActiviName=wxapp&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: '念念',
      path: '/pages/guide/guide' + param,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})