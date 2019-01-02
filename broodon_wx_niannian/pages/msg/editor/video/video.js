import utils from '../../../../utils/util.js';
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoData: {
      video: '',
      videoThumb: ''
    },
    videoHeight: '422rpx',
    videoTop: '14%',
    videoBottom: 'auto'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    if (options.curIndex) {
      var flag = parseFloat(options.width) < parseFloat(options.height) - 100;
      this.setData({
        videoData: {
          'index': options.curIndex,
          'video': options.video,
          'videoThumb': options.videoThumb,
          'width': options.width,
          'height': options.height,
          'isShow': 'true',
          'type': 'video'
        },
        videoHeight: app.globalData.sysInfo.screenWidth + 'px',
        // videoTop: flag ? '100rpx' : '27%',
        // videoBottom: flag ? '200rpx' : 'auto',
      });
      if(options.width < options.height - 100){

      }
    }
    // wx.getStorage({
    //   key: 'editor-video',
    //   success: (res) => {
    //     console.log(res)
    //     if (res.errMsg == 'getStorage:ok'){
    //        this.setData({
    //          video: res.data.video,
    //          videoThumb: res.data.videoThumb
    //        })
    //     }
    //   },
    // })
  },

  //更换视频
  changeFun: function(){
    var that = this;
    this.videoContext.pause();
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      compressed: false,
      success: function (res) {
        if (parseFloat(res.size) / 1024 / 1024 > 200) {
          wx.showToast({ icon: 'none', title: '请上传小于200M的视频哦！', duration: 3000 });
          return false;
        }
        wx.showLoading({
          title: '上传中...',
          mask: true
        });
        var videoData = that.data.videoData
        utils.uploadFun({
          fileName: 'niannianyun/wx/video/' + new Date().getTime() + res.tempFilePath.replace(/.*?(\.\w+)$/, "$1"),
          url: res.tempFilePath
        },
          function(respone){
            wx.downloadFile({
              url: respone.imageURL + '?vframe/png/offset/0',
              success: (respone1) => {
                if (!respone1.tempFilePath) respone1.tempFilePath = '';
                utils.uploadFun({
                  fileName: 'niannianyun/wx/video/' + new Date().getTime() + respone1.tempFilePath.replace(/.*?(\.\w+)$/, "$1"),
                  url: respone1.tempFilePath
                },
                  function (respone2) {
                    that.setData({
                      ['videoData.video']: respone.imageURL,
                      ['videoData.videoThumb']: respone.imageURL+'?vframe/png/offset/0',
                      ['videoData.width']: res.width,
                      ['videoData.height']: respone1.height || 300
                    })
                    wx.hideLoading();
                    wx.setStorage({
                      key: 'videoData',
                      data: that.data.videoData,
                      success: function () {
                        wx.navigateBack();
                      }
                    })
                  },
                  function (error) {
                    wx.hideLoading();
                    wx.showToast({ icon: 'none', title: '上传文件失败！' });
                  }
                )
              },
              fail: (respone) => {
                wx.hideLoading();
                wx.showToast({ icon: 'none', title: '上传文件失败！' });
              }
            })
          },
          function(error){
            wx.hideLoading();
            wx.showToast({ icon: 'none', title: '上传文件失败！' });
          }
        )
      },
      fail: function (error) {
        console.log(error.errMsg);
      }
    })
  },

  deleteFun: function(){

    var videoData = this.data.videoData;
    videoData.video = '';
    videoData.videoThumb = '';
    wx.setStorage({
      key: 'videoData',
      data: videoData,
      success: function () {
        wx.navigateBack();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo');
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})