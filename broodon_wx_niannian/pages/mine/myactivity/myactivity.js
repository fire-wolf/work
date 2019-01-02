import Utils from '../../../utils/util.js';


var app = getApp(),
  URL = app.globalData.URL; 
var curDate = new Date();
Page({
  data: {
    activityList:[],
    isBottom:false,
    isEnd:false,
    pageNo:1,
    userId:"",
    yunMediaRoot:URL.yunMediaRoot

  },
  onLoad: function() {
    this.setData({
      userId:app.globalData.userInfo.userId || ""
    })
    wx.setNavigationBarTitle({
      title: "我的活动"
    });
    
  },
  onShow:function(){
    this.setData({
      pageNo: 1,
      activityList: []
    })
    this.getActivityList();
  },
  getActivityList() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: URL.getActivityList,
      data: {
        userId: this.data.userId,
        pageNo:this.data.pageNo,
        pageSize:10
      },
      success: function(res) {
        // console.log(res);
        wx.hideLoading();
        if (res && res.data && res.data.data && res.data.data.list.length>0) {
          var list = that.data.activityList;
          if(list && list.length>0){
            list = list.concat(res.data.data.list);
          }else{
            list = res.data.data.list;
          }    
          that.setData({
            activityList:list
          })
        }
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  onClickSign: function(e) {
    var type = e.target.dataset.type || e.currentTarget.dataset.type
    if (type=="actDetail"){
      wx.navigateTo({
        url: '/pages/topic/famous/actdetail/actdetail?actId=' + e.currentTarget.dataset.id,
      });
    }else{
      wx.setStorage({
        key: 'actDetail',
        data: e.target.dataset.item,
        success:function(){
          wx.navigateTo({
            url: '/pages/topic/famous/actSignIn/actSignIn?type=' + type,
          });
        }
      }) 
    }
   
  },
  loadMore:function(){
    var that = this;
    this.setData({
      isBottom: true,
    })
    setTimeout(() => {
      if (!that.data.isEnd) {
        var pageNo = that.data.pageNo;
        that.setData({
          pageNo: ++pageNo
        })
        that.getActivityList();
      }
      that.setData({
        isBottom: false,
      })
    }, 800)
  },
})