// pages/famous/famousDetail/famousDetail.js\
var WxParse = require('../../../../wxParse/wxParse.js');

var app = getApp(), URL = app.globalData.URL;
var timeOut = null, isBtnClick = false;;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '', 
    actId:'',
    actDetail:null,
    recordList:[], 
    isIphoneX: app.globalData.isIphoneX,
    yunMediaRoot: URL.yunMediaRoot,
    isAct:true,
    navType:'',
    pageNo:1,
    isLoading:true,
    loadingTxt: "加载更多...",
    isAuthor: true,
    isLogin:null,
    userId:'',
    pageActNo:1,
    recordHeight: app.globalData.sysInfo.windowHeight - 248,
    imgMax:false
  },
  onLoad:function(options){
     
    if(options.actId){ 
      this.setData({
        actId:options.actId
      })
    } else if (options.q) {
      var url = decodeURIComponent(options.q), id = url.replace(/^http(.*?)\?id=(\w+)/i, "$2");
      this.setData({
        actId: id
      })
    }
    wx.setNavigationBarTitle({
      title: "活动详情"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var that = this; 
    if(that.data.imgMax){
      that.setData({
        imgMax:false
      })
      return false;
    }
    this.getUserAuthor(that.init);
   
    
  },
  //登录后控制显示
  onLogin: function (e) {
    this.setData({
      isLogin: e.detail
    })
    this.init();
  },
  init:function(){ 
    var that = this;
    if (app.globalData.isLogin) {
      that.setData({
        isLogin: app.globalData.isLogin,
        userId: app.globalData.userInfo.userId
      })
      if (!that.data.isAct) {
        that.setData({
          pageNo: 1,
          recordList: []
        })
        if (that.data.actId && that.data.userId) that.getActRecordList();
      } else if (that.data.actId && that.data.userId) {
        that.getActDetail();
      } else  {
        wx.getStorage({
          key: 'actParam',
          success: function (res) {
            that.setData({
              actId: res.data.actId,
              userId: res.data.userId,
              isLogin: app.globalData.isLogin
            });
            that.getActDetail();
          }
        })
      }
    }else if(that.data.isAuthor){
      that.setData({
        isLogin:false
      })
    } 
  },
  getUserAuthor:function(callback1){
    var that = this;
    if(typeof (callback1)=='object'){
      callback1 = that.init;
    } 
    app.getSetting(function () {
      that.setData({
        isAuthor: app.globalData.isAuthor,
      })
      if (app.globalData.isAuthor) {
        app.login(callback1);
      } else {
        callback1 && callback1();
      }
    })
  },
  //获取活动详细信息
  getActDetail:function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: URL.getActDetail,
      data:{
        userId:that.data.userId,
        activitiesId:that.data.actId
      },
      success:function(res){
        //console.log(res.data.data);
        wx.hideLoading();
        if(res.data.success && res.data.data){
          that.setData({
            actDetail:res.data.data
          });
          res.data.data.activitiesDetail = res.data.data.activitiesDetail.replace(/&nbsp;/g, '<span class="sline"></span>');
          WxParse.wxParse('content', 'html', res.data.data.activitiesDetail, that, 0);
        }else{
          wx.showModal({
            title: '提示消息',
            content: res.data.msg,
            showCancel:false,
            success:function(){
              if(res.data.data==0){
                wx.redirectTo({
                  url: '/pages/msg/begin/begin'
                })
              }else{
                wx.redirectTo({
                  url: '../detail/detail?companyId='+res.data.data,
                })
              }
              
            }
          })
        }
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  //获取活动记录列表
  getActRecordList:function(callback){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: URL.actRecordList,
      data:{
        activitiesId:this.data.actId,
        pageNo: this.data.pageNo,
        pageSize:10,
        userId:this.data.userId
      },
      success:function(res){
        wx.hideLoading();
        if (res.errMsg == "request:ok" && res.data.data && res.data.data.list.length > 0) {
          var recordList = res.data.data.list;
          if (that.data.recordList.length>0 && that.data.pageNo>1){
            recordList = that.data.recordList.concat(res.data.data.list);
          }else{
            recordList = res.data.data.list;
          }

          that.setData({
            recordList: recordList,
            navType: 'record'
          })
          setTimeout(function () {
            that.changeViewHeight();
          }, 3000);
        }
      },
      fail:function(res){
        wx.hideLoading();
        callback && callback();
      }
    })
  },
  //滑动到最后
  bindscrolltolower: function (e) { 
    if(!this.data.isAct){
      var pageNo = this.data.pageNo+1;
      this.setData({
        pageNo:pageNo
      });
      this.getActRecordList(); 
    }
  },
  //打开查看地理位置
  openLocaAddr:function(){
    var that = this;
    if (that.data.actDetail.langitude>0 && that.data.actDetail.latitude>0){
      wx.openLocation({
        latitude: that.data.actDetail.latitude,
        longitude: that.data.actDetail.langitude,
        address: that.data.actDetail.address
      })
    }
  },
  //改变导航栏状态
  onChangeNav:function(e){
    var that = this;
    this.setData({
      isAct: e.currentTarget.dataset.type=='detail'?true:false,
      pageNo:1
    })
    if(e.currentTarget.dataset.type=='record'){
      this.getActRecordList();
    }
  },
  //查看全部功能效果
  checkAll:function(e){
    this.setData({
      ['recordList[' + e.target.dataset.index + '].updateDate']: 2
    });
  },
  changeViewHeight:function(){
    var that = this;
    var query = wx.createSelectorQuery();
    query.selectAll('.jRecordCont').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        console.log(rect);
        if (rect.height >= 132) {
          that.setData({
            ['recordList[' + rect.dataset.index + '].updateDate']:1
          });
        }
      })
    }).exec()
  },
  //去操作活动记录
  addRecord:function(){
    var that = this;
    wx.setStorage({
      key: 'actParam',
      data: {
        actId: that.data.actId,
        userId: that.data.userId,
      },
      success:function(){
        wx.navigateTo({
          url: '../record/record',
        })
      }
    })
    
  },
  //图片放大效果
  onMaxImg:function(e){ 
    var that = this;
    var nowImgUrl = e.target.dataset.src,imgArry = []; 
    if (e.target.dataset.list && e.target.dataset.list.length>0){
      imgArry = e.target.dataset.list;
    }else{
      imgArry.push(nowImgUrl);
    }
    
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: imgArry // 需要预览的图片http链接列表
      });
      that.setData({
        imgMax:true
      })
  },
  //去报名
  onSignUp:function(e){
    var type = e.target.dataset.type; 
    wx.setStorage({
      key: 'actDetail',
      data: this.data.actDetail,
      success: function () {
        if (type == 'signup') {
          wx.navigateTo({
            url: '../actSignUp/actSignUp',
          })
        }else if(type=='signDetail'){
          wx.navigateTo({
            url: '../actSignUp/actSignUp?type=update',
          })
        } else if (type == 'signin' || type == 'signout' || type == 'detail'){
          wx.navigateTo({
            url: '../actSignIn/actSignIn?type=' + type,
          }); 
        }
       
      }
    })
    
  },
   onShareAppMessage: function () {
    return {
      title: this.data.actDetail ? this.data.actDetail.activitiesTitle:'',
      path: '/pages/topic/famous/actdetail/actdetail?actId=' + this.data.actId,
      imageUrl: this.data.actDetail ? this.data.actDetail.activitiesImg:'',
      complete: function (res) { }
    }
  }

 
})