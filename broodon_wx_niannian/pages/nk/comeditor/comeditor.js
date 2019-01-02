import Util from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtValue: null,
    mainHeight: '',
    targetUserId: null
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    if (options.msgId) {
      that.setData({
        msgId: options.msgId,
        targetUserId: options.targetUserId,
        mainHeight: app.globalData.sysInfo.screenHeight - 60
      }); 

    }
  },
  onComment: function (e) {
    var that = this, types = e.target.dataset.attr;
    
      if (e.detail.value == "") {
        wx.showToast({ title: '请输入要评论的内容！', icon: "none" });
        return false;
      }
      app.login(function (data) {
        if (app.globalData.isLogin) {
          app.globalData.cacheUrl = '';
          Util.sendComm({ msgId: that.data.msgId, userId: app.globalData.userInfo.userId, targetUserId: that.data.targetUserId, content: e.detail.value.replace(/  /g, "　") },function(){
            wx.navigateBack();
          })
          // that.sendComm(e.detail.value,function(){
          //   wx.navigateBack();
          // });
        } else { 
          wx.setStorage({
            key: 'nk-coment',
            data: { msgId: that.data.msgId, targetUserId: that.data.targetUserId, content: e.detail.value },
            success: function(){
              app.globalData.cacheUrl = "/pages/nk/comeditor/comeditor"
              wx.navigateTo({
                url: "/pages/login/login",
                success: function () {
                  setTimeout(function () {
                    isBtnClick = false;
                  }, 1000);
                }
              })
            }
          })
          
        }
      });
      
  },
  sendComm:function(value,callback){
    var that = this;
    wx.request({
      url: URL.sendNkcomment,
      data: { msgId: that.data.msgId, userId: app.globalData.userInfo.userId, targetUserId: that.data.targetUserId, content:value },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.success) {
          wx.showToast({ title: '评论成功！', icon: "none" });
          callback && callback();
        } else {
          wx.showToast({ title: '评论失败！', icon: "none" })
        }

      },
      error: function (res) {
        wx.showToast({ title: '评论失败！', icon: "none" })
      }
    });
  },
  onChangeVal: function (e) {
    this.setData({
      txtValue: e.detail.value
    })
  }
});