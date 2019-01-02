import utils from '../../../../utils/util.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null, 
    imgData: null
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    if (options.curIndex) {
      this.setData({
        'imgData': {
          'index': options.curIndex,
          'images':options.images,
          'isShow': 'true',
          'type': 'images'
        }
      });
    }
  },
  imgLoad:function(e){
    var width = e.detail.width, height = e.detail.height;
    if (width >= app.globalData.sysInfo.windowWidth) {
      height = height * (app.globalData.sysInfo.windowWidth / width);
      width = app.globalData.sysInfo.windowWidth;
    }
    this.setData({['imgData.width']:width,['imgData.height']:height});
  },
  change: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var imgData = that.data.imgData;
        //imgData['images'] = res.tempFilePaths[0];
        utils.uploadFun({ 
            fileName: 'niannianyun/wx/images/' + new Date().getTime() + res.tempFilePaths[0].replace(/.*?(\.\w+)$/, "$1"),
            url: res.tempFilePaths[0]
           },
          (respone)=>{
            //console.log(res)
            //utils.deleteFile(imgData['images'],(res1)=>{})
            imgData['images'] = respone.imageURL;
            wx.setStorage({
              key: 'imgData',
              data: imgData,
              success: function () {
                wx.navigateBack();
              }
            })
          }
        )
      }
    })
  },
  delete: function (e) {
    var imgData = this.data.imgData;
    imgData['images'] = '';
    wx.setStorage({
      key: 'imgData',
      data: imgData,
      success: function () {
        wx.navigateBack();
      }
    })
  }
});