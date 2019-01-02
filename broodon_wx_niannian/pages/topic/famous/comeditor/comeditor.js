import Util from '../../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtValue: null,
    mainHeight: '',
    targetUserId: null,
    sendData: {}
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
    that.setData({
      mainHeight: app.globalData.sysInfo.screenHeight - 60
    }); 
  },

  onComment: function (e) {
    var that = this;
      if (e.detail.value == "") {
        wx.showToast({ title: '请输入要评论的内容！', icon: "none" });
        return false;
      }
      this.sendComm(function () {
        wx.navigateBack();
      });
  },
  sendComm:function(callback){
    var that = this;
    new Promise((resolve, reject)=>{
      wx.getStorage({
        key: 'famous-comment-data',
        success: (res) => {
          this.setData({
            sendData: Object.assign(res.data, {
              //userId: app.globalData.userInfo.userId, //1784281
              userId: 1784281, 
              commentContent: this.data.txtValue.replace(/  /g, "　"),
            })
          })
          resolve(res);
        },
        fail:(res)=>{
          reject(res)
        }
      })
    }).then((res)=>{
      wx.request({
        url: URL.createTopicComment,
        data: this.data.sendData,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          if (res && res.data && res.data.success) {
            wx.showToast({ title: '评论成功！', icon: "none" });
            callback && callback();
          } else {
            wx.showToast({ title: '评论失败！', icon: "none" })
          }
        },
        fail: (msg) => {
          wx.showToast({ title: '评论失败！', icon: "none" })
        }
      })
    })
    
  },
  onChangeVal: function (e) {
    this.setData({
      txtValue: e.detail.value
    })
  },
  // sendMsg: function(){
  //   var param = {
  //     'paperId': 10056,
  //     'musicId': '',
  //     'signature': "发信人",
  //     'content': "内容内容内容内容内容内容内容内容内容内容",
  //     'image': '',
  //     'salutation': "称呼",
  //     'userId': 1784281,
  //     'unionId': "oFawR1ohf3IcJ6Dwoj1bAXVPnl3A",
  //     //'receiveUserId': this.data.targetUserId,
  //     'isQrCode': 0,
  //     receiveUserId: 57
  //   };

  //   wx.request({
  //     url: URL.sendFamousMsg,
  //     method: 'POST',
  //     header: { "Content-Type": "application/x-www-form-urlencoded" },
  //     data: param,
  //     success: function (res) {
  //       console.log(res)
  //     },
  //     fail: function (res) {
  //       console.log(res)
  //     }
  //   })
  // }
});