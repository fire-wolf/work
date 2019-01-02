import Utils from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgId: "",
    nickName: "",
    canSave: false,
    yunMediaRoot: URL.yunMediaRoot,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: "图片生成中",
      mask: true
    });

    //分享者信息
    app.setInviteInfo(options);

    var that = this, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }

    wx.getStorage({
      key: 'preview-create-img',
      success: function(data) {
        wx.request({  //获取小程序码
          url: URL.getwxaCode,
          data: {
            path: 'pages/msg/msgdetail/msgdetail?msgId=' + data.data.msgId + param,
          },
          success: function (res) {
            if (res.data.success == true) {
              wx.downloadFile({
                url: URL.yunMediaRoot + 'niannianyun/wx/topic/letter/bg-pengyouquan.png',
                success: function (res1) {
                  wx.downloadFile({
                    url: res.data.data.wxacodePath,
                    success: function (res2) {
                      that.setData({
                        msgId: data.data.msgId,
                        nickName: data.data.nickName,
                        wxacodePath: res.data.data.wxacodePath
                      })
                      wx.hideLoading();
                      that.onShareAppMessage();
                      that.drawFun(res1.tempFilePath, res2.tempFilePath);
                    }
                  })
                },
                fail: function () {

                }
              })
            }
          }
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  beginSave: function(){
    var that = this;
    wx.showLoading({
      title: '图片保存中'
    })
    if (this.data.canSave == true){ //保证已可以保存图片
      Utils.writePhotosAlbum(that.savePhoto, that.saveFail)
    }else{
      setTimeout(function(){
        that.beginSave()
      },100)
    }
  },

  drawFun: function (bgImgSrc, qrCodeSrc) {
    const that = this;
    const scale = 2;
    const ctx = wx.createCanvasContext('myCanvas-msg');

    ctx.save()
    ctx.rect(0, 0, scale * 550, scale * 675)
    ctx.setFillStyle('#000000')
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.drawImage(bgImgSrc, 0, 0, scale * 550, scale * 675)
    ctx.drawImage(URL.yunMediaRoot + 'niannianyun/wx/topic/letter/bg-pengyouquan.png', 0, 0, scale * 550, scale * 675)
    ctx.restore()
    ctx.save()
    ctx.setFillStyle('#3B3635')
    ctx.setFontSize(scale * 34)
    ctx.setTextAlign('center')
    ctx.fillText(that.data.nickName, scale * 275, scale * 68)
    ctx.restore()
    ctx.save()
    ctx.drawImage(qrCodeSrc, scale * 189, scale * 172, scale * 174, scale * 174)
    ctx.restore()

    ctx.draw(false, function () {
      that.setData({
        canSave: true
      })
    })
  },

  savePhoto: function () { //保存图片到相册
    var that = this
    var scale = 2;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas-msg',
      x: 0,
      y: 0,
      width: scale * 550,
      height: scale * 675,
      destWidth: 550,
      destHeight: 675,
      quality: 1,
      success: function (info) {
        wx.saveImageToPhotosAlbum({
          filePath: info.tempFilePath,
          success: function (res) {
            wx.hideLoading()
            wx.previewImage({
              current: info.tempFilePath, // 当前显示图片的http链接
              urls: [info.tempFilePath] // 需要预览的图片http链接列表
            })
          },
          fail: function (msg) {
            that.saveFail()
          }
        })
      },
      fail: function (msg) {
        that.saveFail()
      }
    })

  },

  saveFail: function () { //保存图片失败
    var that = this
    wx.hideLoading()
    wx.showToast({
      title: '保存失败',
      icon: 'none',
      duration: 2000
    })
  },

  onHide: function(){
    wx.hideLoading();
  },

  onUnload: function(){
    wx.hideLoading();
  },

  onShareAppMessage: function () {
    var that = this, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: that.data.nickName + ' 用心为您写了一封信',
      path: '/pages/msg/msgdetail/msgdetail?msgId=' + that.data.msgId + param,
      imageUrl: URL.yunMediaRoot + 'niannianyun/wx/letter/share-letter.png',
      complete: function (res) {
        // wx.reLaunch({
        //   url: "/pages/my/my",
        //   success: function () {

        //   }
        // })
      }
    }
  }
})