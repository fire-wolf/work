var app = getApp(),
  URL = app.globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIdentify: false,
    name: '',
    idCard: '',
    realName: '',
    realIDnumber: '',
    yunMediaRoot:URL.yunMediaRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  inputName: function(e) {
    this.setData({
      name: e.detail.value,
    })
  },
  inputidCard: function(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  onUnload:function(){
    if (app.globalData.cacheUrl && app.globalData.cacheUrl!=""){
      wx.navigateBack({
        delta:2
      })
    }
  },
  onConfirm: function() {
    if (!this.data.name) {
      wx.showToast({
        title: '身证份姓名不为空',
        icon: 'none',
        duration: 2000
      })
    } else if (!this.data.idCard || this.data.idCard.length < 18) {
      wx.showToast({
        title: '请输入正确的身份证号码格式',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.putIDnumber();
    }
  },
  putIDnumber: function() {
    var that = this;
    wx.request({
      url: URL.putIDnumber,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userExtRealIdCard: this.data.idCard || '',
        userExtRealName: this.data.name || '',
        userId: app.globalData.userInfo.userId || '',
      },
      success: function(res) {
        //console.log(res);
        if (res && res.data) {
          if (res.data.success) {
            that.setData({
              isIdentify: true,
              realName: that.data.name,
              realIDnumber: that.data.idCard
            }) 
            
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })
  },
  //获取用户认证信息
  getIDnumber: function() {
    var that = this;
    wx.request({
      url: URL.getIDnumber,
      data: {
        userId: this.data.userId || '',
        devKey: 'default'
      },
      method: 'GET',
      success: function(res) {
        if (res && res.data && res.data.success) {
          that.setData({
            realName: res.data.userExtRealName,
            realIDnumber: res.data.userExtRealIdCard
          })
        }
      },
    })
  },
})