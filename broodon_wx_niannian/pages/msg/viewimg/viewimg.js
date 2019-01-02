// pages/msg/viewimg/viewimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgImg: "",
    //msgImg: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2547028966,2154673895&fm=200&gp=0.jpg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: "msgImg",
      success: function (res) {
        that.setData({
          msgImg: res.data
        })
      }
    })
  },

  onChangeImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({
          msgImg: res.tempFilePaths[0]
        })
        wx.setStorage({
          key: "msgImg",
          data: res.tempFilePaths[0]
        })
      }
    })
  },

  onRemoveImg: function () {
    var that = this;
    wx.showModal({
      title: "确定删除此图片？",
      content: "不会删除系统相册中的图片",
      success: function(res){
        if (res.confirm == true){
          wx.setStorage({
            key: "msgImg",
            data: "",
            success: function () {
              that.setData({
                msgImg: ""
              })
              // wx.navigateBack({
              //   delta: 1
              // })
            }
          })
        }
      },

    })
  }

})