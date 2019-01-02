import Utils from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    errorHidden: true,
    errorText: '请输入优惠码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Utils.setNavigationBar("集团优惠码", "#000000", "#F1F3F5");

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  onInputCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  onFocusCode: function(){
    this.setData({
      errorHidden: true,
    })
  },

  onSave: function() {
    var code = this.data.code;
    if(code == ''){
      wx.removeStorage({
        key: 'discount-code',
        success: () => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
      // this.setData({
      //   errorHidden: false,
      //   errorText: '请输入优惠码'
      // })
      return false;
    }else{
      wx.request({
        url: URL.checkDiscountCode,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          discountCode: code
        },
        success: (res) => {
          //console.log(res)
          if(res.data && res.data.success){
            wx.setStorage({
              key: 'discount-code',
              data: code,
              success: ()=>{
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.data && res.data.msg){
            this.setData({
              errorHidden: false,
              errorText: res.data.msg
            })
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }
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