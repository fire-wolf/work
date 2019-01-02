
import Utils from '../../../../utils/util.js'
import qiniuUploader from '../../../../utils/qiniuUploader.js'
var app = getApp(), URL = app.globalData.URL;
var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onEnded(function () {
  innerAudioContext.play();
});

// 初始化七牛相关参数
function initQiniu(obj) {
  var options = {
    region: 'ECN', // 华北区
    uptokenURL: 'https://app.niannian99.com/qiniu/getToken?fileName=' + obj.fileName,
    fileName: obj.fileName,
    // uptoken: 'xxxx',
    domain: 'https://file.niannian99.com/'
  };
  qiniuUploader.init(options);
}


Page({
  data: {
    userId: '',
    msgId: '',
    nickName: '',
    userImage: '',
    unionId: '',
    title: '',
    content: '',
    author: '',
    upLoadImg: '',
    paperId: '',
    msgConfig: {
      paperTop: '',
      paperMidle: '',
      paperBottom: '',
      backgroundColor: '#F7F6F2'
    },
    screenWidth: 375,
    mainHeight: '838rpx',
    scrollViewHeight: '100%',
    isLoading: false,
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX
  },

  onLoad: function (options) {
    var that = this;
    Utils.setNavigationBar("红色家书", "#ffffff", "#D84847");
    wx.hideShareMenu();

    if (app.globalData.sysInfo.windowHeight > 673) {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 800) / 2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 130) + 'px',
      })
    } else {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 815) / 2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 60) + 'px',
      })
    }
    if (app.globalData.isLogin == true) {
      that.setData({
        userImage: app.globalData.userInfo.image,
        userId: app.globalData.userInfo.userId,
        unionId: app.globalData.userInfo.unionId,
        screenWidth: app.globalData.sysInfo.screenWidth
      })
    } else {
      that.setData({
        screenWidth: app.globalData.sysInfo.screenWidth
      })
    }

    if (!app.globalData.wxUserInfo) {
      app.getUserInfo(function () {
        that.setCurrentData()
      });
    } else {
      that.setCurrentData()
    }

    wx.setNavigationBarTitle({
      title: '预览'
    })

  },

  setCurrentData: function () {
    var that = this;
    wx.getStorage({
      key: "edit-redmsg",
      success: function (respone) {
        if (respone.data.msgImg && /https:\/\/file.niannian99.com/g.test(respone.data.msgImg) == false) {
          initQiniu({ fileName: 'niannianyun/wx/' + new Date().getTime() + respone.data.msgImg.replace(/.*?(\.\w+)$/, "$1") });
          // 交给七牛上传
          qiniuUploader.upload(respone.data.msgImg, (res) => {
            that.dealData(respone.data, res.imageURL);
          }, (error) => {
            that.setCurrentData();
            console.log(error);
          });
        } else {
          that.dealData(respone.data, "");
        }

      }
    })

  },

  dealData: function (respone, upLoadImg) {
    var that = this;
    that.setData({
      nickName: app.globalData.wxUserInfo.nickName,
      letter: {
        title: respone.title,
        content: respone.content.replace(/  /g, "　"),
        author: respone.author,
        upLoadImg: (upLoadImg && upLoadImg != "") ? upLoadImg : respone.msgImg,
      },
      musicId: respone.musicId,
    })
  },


  replyMsg: function (callBack) {
    var that = this; 
    if (this.data.isLoading) return false;
    var param = {
      'paperId': this.data.paperId,
      'musicId': this.data.musicId ? this.data.musicId : '',
      'signature': this.data.letter.author,
      'content': this.data.letter.content,
      'image': this.data.letter.upLoadImg,
      'salutation': this.data.letter.title,
      'userId': this.data.userId,
      'receiveUserId': 2169242,          //2244552,
      'isQrCode': 0
    };
    that.setData({
      isLoading: true
    })
    wx.request({
      url: URL.replyMsg,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: param,
      success: function (res) {
        console.log(res);
        if (res.data && res.data.success) {

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.setData({
          isLoading: false
        })
      },
      fail: function (res) {
        that.setData({
          isLoading: false
        })
      }
    })
  },
});


