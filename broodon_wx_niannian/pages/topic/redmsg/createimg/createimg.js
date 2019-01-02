import Utils from '../../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    userImg: '',
    msgId: '',
    letter: {
      title: '',
      content: '',
      author: '',
      date: '',
      coverUrl: '',
      detailUrl: ''
    },
    idx: 0,
    myRank: '',
    imgCount: 0,
    canDraw: false,
    scale: 0.5,
    imgDownList: [],
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Utils.setNavigationBar("红色家书", "#ffffff", "#D84847");

    var that = this;
    if (!app.globalData.wxUserInfo) {
      app.getUserInfo(function () {
        that.setCurrentData()
      });
    } else {
      that.setCurrentData()
    }

    //分享者信息
    app.setInviteInfo(options);
  },
  onReady: function(){

  },
  setCurrentData: function () {
    var that = this;
    wx.getStorage({
      key: 'redMsgDetail',
      success: function (res) { 
        that.setContentData(res);
      },
      fail:function(res){
        res.data = {
          letter:"",
          msgId:"",
          myRank:""
        }
        that.setContentData(res);
      },
      complete:function(res){
        //console.log(res);
      }
    })

  },
  setContentData: function (res){
    var that = this;
    var userImg = app.globalData.userInfo.image ? app.globalData.userInfo.image : (app.globalData.wxUserInfo ? app.globalData.wxUserInfo.avatarUrl : '')
    that.setData({
      msgId: res.data.msgId,
      letter: res.data.letter,
      myRank: res.data.myRank,
      nickName: app.globalData.userInfo.nickName,
      userImg: userImg,
      msgConfig: Utils.msgConfig('redMsg', app.globalData.msgObj.msgConfig),
      imgDownList: [
        { "url": userImg, "index": 0, "downFilePath": "" },
        { "url": URL.yunMediaRoot + "niannianyun/wx/topic/red/1.5/icon-red-postmark.png", "index": 1, "downFilePath": "" },
        { "url": URL.yunMediaRoot + "niannianyun/wx/topic/red/1.5/share-redpyq-bg3.png", "index": 2, "downFilePath": "" },
        { "url": "", "index": 3, "downFilePath": "" },
        { "url": URL.yunMediaRoot + "niannianyun/wx/topic/red/1.5/red-logo.png", "index": 4, "downFilePath": "" },
      ]
    })

    if (!res.data.myRank) {
      that.getRank()
    }

    var that = this, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=redMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=redMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }

    wx.request({  //获取小程序码
      url: URL.getwxaCode,
      data: {
        path: 'pages/topic/redmsg/msgdetail/msgdetail?id=' + res.data.msgId + param,
      },
      success: function (respone3) {
        that.setData({
          wxacodePath: respone3.data.data.wxacodePath
        })
        that.data.imgDownList[3].url = respone3.data.data.wxacodePath
        that.downLoadImg(that.data.imgDownList[3], function (count) {
          that.beginDrawFun(count);
        });
      }
    });

    for (var i = 0; i < that.data.imgDownList.length; i++) {
      if (i == 3) continue;
      that.downLoadImg(that.data.imgDownList[i], function (count) {
        that.beginDrawFun(count);
      });
    }
  },
  getRank: function () {
    var that = this;
    if (app.globalData.isLogin) {
      wx.request({
        url: URL.getMyRank,
        data: { userId: app.globalData.userInfo.userId },
        success: function (res) {
          if (res.data.data) {
            that.setData({
              myRank: res.data.data ? res.data.data.rank : '',
            })
            that.onShareAppMessage()
          }
        }
      })
      wx.showShareMenu()
    } else {
      wx.hideShareMenu()
    }
  },

  downLoadImg: function (imgObj, callback) {
    var that = this;
    wx.downloadFile({
      url: imgObj.url,
      success: function (res) {
        imgObj.downFilePath = res.tempFilePath;
        that.data.imgCount++;
        callback && callback(that.data.imgCount);
      },
      fail: function(res){
        console.log(res)
      }
    });
  },

  beginDrawFun: function (count) {
    var that = this
    if (count < this.data.imgDownList.length) {
      return false;
    }
    this.setData({
      canDraw: true
    })
    //this.onSave();
  },

  onSave: function () {
    if (this.data.canDraw == true){
      //this.drawFun(this.data.imgDownList[0].downFilePath, "../../../images/insignia2.png", "../../../images/share-redpyq-bg.png", this.data.imgDownList[3].downFilePath);
      
      this.drawFun(this.data.imgDownList[0].downFilePath, this.data.imgDownList[1].downFilePath, this.data.imgDownList[2].downFilePath, this.data.imgDownList[3].downFilePath, this.data.imgDownList[4].downFilePath);
    }
  },

  drawFun: function (userImg, postmark, bgImgUrl, qrCodeUrl, logo){
    var that = this;
    var s = this.data.scale;
    var ctx = wx.createCanvasContext('myCanvasRedMsg2');
    ctx.save()
    const grd = ctx.createLinearGradient(0, 0, 0, 1128)
    grd.addColorStop(0, '#DA4848')
    grd.addColorStop(1, '#B43232')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, s * 750, s * 1128)
    ctx.restore()
    ctx.save()
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(s * 20, s * 28, s * 710, s * 1083)
    ctx.restore()

    ctx.save()
    ctx.drawImage(userImg, s * 40, s * 62, s * 120, s * 120)

    ctx.setFillStyle('#330909')
    ctx.font = 'normal bold ' + (s * 40) + 'px SimSun'
    ctx.setFontSize(s * 40)
    ctx.fillText(that.data.nickName, s * 180, s * 100)
    ctx.fillText(that.data.nickName, s * 180, s * 100)
    ctx.font = 'normal normal ' + (s * 28) + 'px SimSun'
    ctx.setFontSize(s * 28)
    ctx.fillText('红色家书第 ' + that.data.myRank + ' 位传习者', s * 180, s * 146)
    ctx.setFillStyle('#8F4F4F')
    ctx.setFontSize(s * 16)
    ctx.fillText('为您推荐' + that.data.letter.author + '家书《 ' + that.data.letter.title + ' 》', s * 180, s * 175)
    ctx.restore()

    ctx.save()
    ctx.drawImage(postmark, s * 516, s * 46, s * 193, s * 112)
    ctx.drawImage(bgImgUrl, s * 40, s * 202, s * 670, s * 860)
    ctx.restore()

    ctx.save()
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(s * 540, s * 856, s * 150, s * 150)
    ctx.drawImage(qrCodeUrl, s * 550, s * 858, s * 130, s * 130)
    ctx.setFillStyle('#6F031A')
    ctx.fillRect(s * 540, s * 987, s * 150, s * 54)
    ctx.setFillStyle('#FFDFB5')
    ctx.setFontSize(s * 16)
    ctx.fillText('邀请好友参与', s * 564, s * 1008)
    ctx.fillText('承续革命情怀', s * 564, s * 1028)
    ctx.restore()

    ctx.save()
    ctx.drawImage(logo, s * 304, s * 1073, s * 24, s * 24)
    ctx.setFontSize(s * 18)
    ctx.setFillStyle('#D9BFC4')
    ctx.fillText('寄真情 用念念', s * 338, s * 1092)
    ctx.restore()


    // ctx.save()
    // ctx.rect(0, 0, s * 750, s * 1210)
    // ctx.setFillStyle('#E51514')
    // ctx.fill()
    // ctx.drawImage(bgImgUrl, 0, s * -60, s * 750, s * 1334)
    // ctx.restore()

    // ctx.save()
    // ctx.drawImage(postmark, s * 231.5, s * 0, s * 290, s * 234)
    // ctx.restore()

    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(s * 377, s * 141, s * 64, 0, 2 * Math.PI)
    // ctx.setFillStyle('#dda83d')
    // ctx.fill()
    // ctx.clip()
    // ctx.drawImage(userImg, s * 313, s * 77, s * 128, s * 128)
    // ctx.restore()

    // ctx.save()
    // ctx.setFillStyle('#FFFCCA')
    // ctx.setTextAlign('center') 

    // ctx.setFontSize(s * 32)
    // ctx.fillText('红色家书第 ' + that.data.myRank + ' 位传习者', s * 375, s * 355)
    // ctx.setFontSize(s * 20)
    // ctx.fillText('为您推荐' + that.data.letter.author + '家书《 ' + that.data.letter.title + ' 》', s * 375, s * 400)

    // ctx.setFontSize(s * 22)
    // ctx.fillText('长按小程序码', s * 375, s * 1000)
    // ctx.fillText('查阅更多先烈家书', s * 375, s * 1030)

    // ctx.font = 'normal bold ' + (s * 40) + 'px SimSun'
    // ctx.setFontSize(s * 40)
    // ctx.fillText(that.data.nickName, s * 375, s * 300)

    // ctx.restore()

    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(s * 375, s * 868, s * 94, 0, 2 * Math.PI)
    // ctx.setFillStyle('#ffffff')
    // ctx.fill()
    // ctx.clip()
    // ctx.drawImage(qrCodeUrl, s * 285, s * 778, s * 180, s * 180)
    // ctx.restore()

    ctx.draw(false, function () {
      Utils.writePhotosAlbum(that.savePhoto, that.saveFail)
    })
  },

  savePhoto: function () { //保存图片到相册
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    var that = this
    var scale = this.data.scale;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvasRedMsg2',
      x: 0,
      y: 0,
      width: scale * 750,
      height: scale * 1128,
      destWidth: 750,
      destHeight: 1128,
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
            // wx.showToast({
            //   title: '已保存到相册',
            //   icon: 'success',
            //   duration: 2000
            // })
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
    that.setData({
      sharePyqHidden: true,
      canvasHidden: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=redMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=redMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: that.data.nickName + ' 红色家书第' + that.data.myRank + '位传习者，为您推荐' + that.data.letter.author + '的家书',
      path: 'pages/topic/redmsg/msgdetail/msgdetail?id=' + that.data.msgId + param,
      imageUrl: URL.yunMediaRoot + "niannianyun/wx/topic/red/1.5/share-redpyq-bg3.png",
      complete: function (res) {
        
      }
    }
  },

  onUnload: function () {
    if (/\/pages\/redmsg\/createimg/g.test(app.globalData.hisUrl)) {
      app.globalData.hisUrl = ""
      wx.navigateBack({
        delta: 1
      })
    }
  },
})