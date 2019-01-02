
import Utils from '../../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
Page({
  data: {
    errorText: '请输入正文',  // 请输入称呼或标题
    errorHidden: true,
    userId: '',
    title: '',
    content: '',
    author: '',
    msgImg: '',
    musicId: '',
    paperId: 10057,
    msgConfig: {
      paperTop: '',
      paperMidle: '',
      paperBottom: '',
      backgroundColor: '#F7F6F2'
    },
    isLoading: false,
    isTextFocus: false,
    isIphoneX: app.globalData.isIphoneX, 
    yunMediaRoot: URL.yunMediaRoot
  },
  onLoad: function () {
    Utils.setNavigationBar("红色家书", "#ffffff", "#D84847");
    
    if (app.globalData.isLogin) {
      this.setData({
        author: app.globalData.userInfo.nickName,
        userId: app.globalData.userInfo.userId
      })
    }

    this.setData({
      msgConfig: Utils.msgConfig('redMsg', app.globalData.msgObj.msgConfig)
    })

  },
  bindSalutationInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindAuthorInput: function (e) {
    this.setData({
      author: e.detail.value
    })
  },
  bindTextAreaInput: function (e) {
    this.setData({
      content: e.detail.value,
      errorHidden: true
    })
  },
  handleTextFocus: function (e) {
    this.setData({
      isTextFocus: true,
    })
  },
  bindFous: function (e) {
    this.setData({
      errorHidden: true,
    })
  },
  bindConfirm: function (e) {  //点击 完成 去预览
    const that = this;
    if (this.data.title == '') {
      this.setData({
        errorHidden: false,
        errorText: '请输入称呼或标题'
      })
    }else if (this.data.content == ''){
      this.setData({
        errorHidden: false,
        errorText: '请输入正文'
      })
    }else{
      wx.setStorage({
        key: "edit-redmsg",
        data: this.data,
        success: function () {
          that.replyMsg();
          // wx.navigateTo({
          //   url: '/pages/redmsg/preview/preview' 
          // })
        }
      })
    }
    
  },
  replyMsg: function () {
    var that = this;
    if (isBtnClick) return false;
    var param = {
      'paperId': this.data.paperId,
      'musicId': this.data.musicId,
      'signature': this.data.author,
      'content': this.data.content,
      'image': this.data.msgImg,
      'salutation': this.data.title,
      'userId': this.data.userId,
      'receiveUserId': 2169242,
      'isQrCode': 0
    };
    //console.log(param); return false;
    isBtnClick = true;
    wx.request({
      url: URL.replyMsg,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: param,
      success: function (res) {
        console.log(res);
        if (res.data && res.data.success) {
          wx.setStorage({
            key: 'msg-type',
            data: 'activity',
            success: function () {
              wx.navigateTo({
                url: "/pages/msg/list/list",
                success: function () {
                  setTimeout(function () {
                    isBtnClick = false;
                  }, 1000)
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          isBtnClick = false;
        }
      },
      fail: function (res) {
        isBtnClick = false;
      }
    })
  },
  onUnload: function () {

    if (/\/pages\/redmsgdetail\/redmsgdetail/g.test(app.globalData.hisUrl)) {
      wx.navigateBack({
        delta: 1
      })
    }
  },

})