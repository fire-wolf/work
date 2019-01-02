// 我的感悟详情
import Utils from '../../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnHidden: true,
    btnClick: false,
    windowHeight: 603,
    yunMediaRoot: URL.yunMediaRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 

    Utils.setNavigationBar("红色家书", "#ffffff", "#D84847");

    //如果是识别二维码或者分享链接进到家书详情再跳转到介绍页，则隐藏传习者按钮
    // if (/pages\/redmsg\/msgdetail/g.test(getCurrentPages()[0].route)){
    //   this.setData({
    //     btnHidden: true
    //   })
    // }else{
    //   this.setData({
    //     btnHidden: false
    //   })
    // }

    wx.getStorage({
      key: 'introduce-hidde-btn',
      success: function(res) {
        if(res.data){
          that.setData({
            btnHidden: true
          })  
        }else{
          that.setData({
            btnHidden: false
          })  
        }
      },
      fail: function() {
        that.setData({
          btnHidden: false
        })  
      }
    })
    //分享者信息
    app.setInviteInfo(options);
    
  },

  goIndex: function(){
    var that = this;
    this.setData({
      btnClick: true
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '/pages/topicBar/redmsg/index',
        success: function(){
          that.setData({
            btnClick: false
          })
        }
      })
    },500)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  onUnload: function() {
    wx.removeStorage({
      key: 'introduce-hidde-btn',
      success: function(res) {},
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '?inviteActiviName=redMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '?inviteActiviName=redMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: '传承红色基因，争做时代新人，邀你一起传习红色家书',
      path: '/pages/topic/redmsg/introduce/introduce' + param,
      imageUrl: URL.yunMediaRoot + "niannianyun/wx/topic/red/1.5/share-redpyq-bg3.png",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})