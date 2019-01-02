
import Utils from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    interval: 3000,
    duration: 500,
    myRank: '',
    currentIndex: 0,
    preIndex: 1000,
    boxHidden: true,
    msgList:[
      {
        coverUrl: '',
        content: '',
        detailUrl: '',
        author: ''
      }
    ],
    yunMediaRoot: URL.yunMediaRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    Utils.setNavigationBar("红色家书", "#ffffff", "#D84847");
    // wx.request({
    //   url: URL.getMyRank,
    //   data: { userId: app.globalData.userInfo.userId },
    //   success: function (res) {
    //     if(res.data.data){
    //       that.setData({
    //         myRank: res.data.data ? res.data.data.rank : '',
    //         boxHidden: res.data.data.showTip == 0 ? false : true
    //       })
    //     }
    //   }
    // })

    if (!app.globalData.topicInfo){
      wx.request({
        //获取文章详情接口
        url: URL.getArticleView,
        data: {
          articleId: 25284,
        },
        method: 'GET',
        success: function (res) {
          if (res.data && res.data.success && res.data.data){
            var list = JSON.parse(res.data.data.content.replace(/\[\/topic|topic\]/g, ""))
            that.setData({ msgList: list[0] });
            app.globalData.topicInfo = list;
          }
        }
      })
    }else{
      that.setData({
        msgList: app.globalData.topicInfo[0]
      })
    }

    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  changeSwiper: function (e) {
    console.log(this.data.currentIndex)
    console.log(e.detail.current)
    this.setData({
      preIndex: this.data.currentIndex,
      currentIndex: e.detail.current
    })
  },

  goDetail: function (e) {
    
    if (isBtnClick == true) return false;
    isBtnClick = true;
    
    app.login(function(){
      if (app.globalData.isLogin) {
        app.globalData.hisUrl = "";
        wx.navigateTo({
          url: "/pages/topic/redmsg/msgdetail/msgdetail?id=" + e.currentTarget.id,
          success: function () {
            setTimeout(function () {
              isBtnClick = false;
            }, 2000)
          }
        })
      } else {
        app.globalData.cacheUrl = "/pages/topic/redmsg/msgdetail/msgdetail?id=" + e.currentTarget.id;
        app.globalData.hisUrl = "/pages/topic/redmsg/index/index";
        wx.navigateTo({
          url: "/pages/login/login",
          success: function () {
            setTimeout(function () {
              isBtnClick = false;
            }, 2000)
          }
        })
      }
    });
    
  },

  touchMove: function(e){
    //console.log(e)
  },

  onHiddenBox: function () {
    this.setData({
      boxHidden: true
    })
  },

  onHide: function (e) {
    //console.log(getCurrentPages())
  },

  onUnload: function () {     
    if (/\/pages\/topic\/redmsg\/msgdetail\/msgdetail/g.test(app.globalData.hisUrl)){
      wx.navigateBack({
        delta: 0
      })
    }
  }

})