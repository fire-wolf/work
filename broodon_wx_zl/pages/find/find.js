 
import Utils from '../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
 

Page({
  data: {
    isBeginAjax:true, 
    hidden:true,
    isLoading:true,
    isBtnClick: false,
    isShowLogin: false,
    cardList: [],
    cardDetail: null,
    tabList: [
      {
        text: '卡券',
        isActive: true,
        openType: 'redirectTo',
        url: '/pages/find/find',
        iconPath: '../../images/tab-icon/icon-find1.png'
      },
      {
        text: '商家',
        isActive: false,
        openType: 'navigateTo',
        url: '/pages/seller/seller',
        iconPath: '../../images/tab-icon/icon-seller.png'
      },
      {
        text: '我的',
        isActive: false,
        openType: 'redirectTo',
        url: '/pages/my/my',
        iconPath: '../../images/tab-icon/icon-my.png'
      },
    ],
  },
  onShow: function () {
    //wx.hideTabBar();
  },
  onLoad: function (options) {
    Utils.setNavigationBar("卡券", "#000000", "#F1F3F5");
    
    this.footer = this.selectComponent('#appfooter');
    this.login = this.selectComponent('#login');
    this.getChangeHeight(); 
    this.getCardList();
  },
  onReady: function (){
    
  },
  getCardList: function() {

    wx.request({
      url: URL.getCardList,
      success: (res) => {
        //console.log(res)
        if(res && res.data && res.data.data && res.data.success){
          this.setData({
            cardList: res.data.data
          })
        }
      }
    })
  },
  onClickItem: function(e){
    var that = this;
    
    if (!e.target.dataset.item || this.data.isBtnClick) return false;
    //console.log(e.target.dataset.item)
    that.setData({
      cardDetail: e.target.dataset.item,
      isBtnClick: true
    })
    that.goDetail(e.target.dataset.item);
    
    // app.login(() => {
    //   if (app.globalData.isLogin) {
    //     that.goDetail(e.target.dataset.item);
    //   } else {
        // that.setData({
        //   isShowLogin: true,
        //   isBtnClick: false
        // })
        // app.globalData.cacheFun = that.goDetail;
    //   }
    // })
  },
  goDetail: function (cardDetail) {
    var that =this;
    var data = cardDetail ? cardDetail : this.data.cardDetail;
    if (this.data.cardDetail){
      wx.setStorage({
        key: 'card-item',
        data: this.data.cardDetail,
        success: () => {
          wx.navigateTo({
            url: '/pages/card/buy/buycard',
            success: ()=>{
              that.setData({
                isBtnClick: false
              })
            }
          })

        }
      })
    }
  },
  handleShowLogin: function(e){
    //console.log(e)
    this.setData({
      isShowLogin: e.detail
    })
  },
  getChangeHeight:function(){ 
    const that = this;
    wx.getSystemInfo({
      success: function (res) { 
        // 计算主体部分高度,单位为px
        if (app.globalData.isIphoneX){
          that.setData({
            // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
            secondHt: res.windowHeight - res.screenWidth / 750 * (98+68)
          })
        }else{
          that.setData({
            // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
            secondHt: res.windowHeight - res.screenWidth / 750 * 98
          })
        }
      
      }
    })
  },

  bindDownLoad: function () {
    var that = this;
  },
  scroll: function (event) { 
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  
  onShareAppMessage: function (res) {
    return {
      title: '卡券',
      path: '/pages/find/find',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})