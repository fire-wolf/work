
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    isIphoneX: app.globalData.isIphoneX,
    yunMediaRoot: URL.yunMediaRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var explainInfo = app.globalData.msgObj.explainInfo, list = [];
    list = explainInfo[0].content.split(",");
    this.setData({
      images: list
    })

    //分享者信息
    app.setInviteInfo(options);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '?inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '?inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: '念念',
      path: '/pages/download/download' + param,
      imageUrl: 'https://file.niannian99.com/niannianyun/wx/download/down_share.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})