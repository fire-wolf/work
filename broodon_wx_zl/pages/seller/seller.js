
import Utils from '../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载 userId:1349638
   */
  onLoad: function (options) {
   
    Utils.setNavigationBar("商家", "#000000", "#F1F3F5");
    
    this.setData({
      url: app.globalData.sellerLink
    })
    //wx.showTabBar();
    //this.initData();
  },

  onShow: function () {
    
  },

  initData: function(){
    var that = this;
    wx.request({
      url: URL.getSellerLink,
      success: (res) => {
        if (res.data && res.data.data && res.data.success) {
          that.setData({
            url: res.data.data
          })
        }
      }
    })
  },

})