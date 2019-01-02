import Utils from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: '',
    code: '',
    isBtnClick: false,
    isShowLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Utils.setNavigationBar("洗车卡", "#000000", "#F1F3F5");
    this.login = this.selectComponent('#login');
  },

  onShow: function () {
    this.getCardDetail();
  },

  getCardDetail: function(){
    wx.getStorage({
      key: 'card-item',
      success: (res) => {
        //console.log(res)
        if(res.data){
          this.setData({
            cardInfo: {
              goodsId: res.data.goodsId,
              goodsDesc: res.data.goodsDesc,
              goodsContent: res.data.goodsContent,
              goodsName: res.data.goodsName,
              shopPrice: res.data.shopPrice,
              discountPrice: res.data.discountPrice,
              price: parseFloat(res.data.shopPrice).toFixed(2),
              disPrice: parseFloat(res.data.discountPrice).toFixed(2),
              preferentialPrice: parseFloat(res.data.shopPrice - res.data.discountPrice).toFixed(2),
            }
          })
        }
      },
    })
    wx.getStorage({
      key: 'discount-code',
      success: (res) => {
        if (res.data) {
          this.setData({
            code: res.data
          })
        }else{
          this.setData({
            code: ''
          })
        }
      },
      fail: ()=>{
        this.setData({
          code: ''
        })
      }
    })
  },

  goInputCode: function(){
    wx.navigateTo({
      url: '/pages/card/code/code',
    })
  },

  onClickPay: function(){
    var that = this;
    app.login(() => {
      if (app.globalData.isLogin) {
        that.onPay();
      }else{
        that.setData({
          isShowLogin: true,
          isBtnClick: false
        })
        app.globalData.cacheFun = () => {};
      }
    })
  },

  onPay: function() {
    var that = this;
    if (this.data.isBtnClick) return false;
    this.setData({
      isBtnClick: true
    })

    var data = {
      goodsId: this.data.cardInfo.goodsId,
      openId: app.globalData.userInfo.openId,
      userId: app.globalData.userInfo.userId,
    };
    if (this.data.code){
      data = Object.assign(data, { discountCode: this.data.code})
    }
    wx.request({
      url: URL.submitOrder,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: (res) => {
        //console.log(res)
        if(res.data && res.data.data && res.data.success){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: (res1)=>{
              wx.request({
                url: URL.getMyLink,
                data: {
                  openId: app.globalData.userInfo.openId,
                  userId: app.globalData.userInfo.userId,
                },
                success: (respone)=>{
                  if (respone.data && res.data.data && respone.data.success){
                    app.globalData.myLink = respone.data.data;
                    wx.removeStorage({
                      key: 'discount-code',
                      success: (res) => {},
                    })
                    wx.navigateTo({  //switchTab
                      url: '/pages/my/my',
                      success: ()=>{
                        that.setData({
                          isBtnClick: false
                        })
                      }
                    })
                  }
                },
                fail: (respone)=>{
                  if (respone.data && respone.data.msg) {
                    wx.showToast({ title: respone.data.msg, icon: "none" })
                  }
                  that.setData({
                    isBtnClick: false
                  })
                }
              })
            },
            fail: (res2) => {   
              wx.showToast({ title: '支付失败', icon: "none" })
              that.setData({
                isBtnClick: false
              })
            }
          })
          this.setData({
            isBtnClick: false
          })
        }
      },
      fail: (res)=>{
        if (res.data && res.data.msg) {
          wx.showToast({ title: res.data.msg, icon: "none" })
        }
        that.setData({
          isBtnClick: false
        })
      }
    })
    
  },

  handleShowLogin: function (e) {
    //console.log(e)
    this.setData({
      isShowLogin: e.detail
    })
  },

  onUnload: function(){
    wx.removeStorage({
      key: 'discount-code',
      success: (res) => {
        
      },
    })
    wx.removeStorage({
      key: 'card-item',
      success: (res) => {

      },
    })
  }

})