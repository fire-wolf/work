 
var app = getApp(), URL = app.globalData.URL;
 
Page({
  data: {
    isBeginAjax:true, 
    indicatorDots: false,
    vertical: true,
    circular:true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    hidden:true,
    bannerList:[],
    articleList:[],
    pageNo:1, 
    pageSize: 3,
    loadingTxt:"一书一知己，一信一世界",
    textList: ['一书一知己，一信一世界', '尺素如残雪，结为双鲤鱼', '江水三千里，家书十五行', '乡书何处达，归雁洛阳边'],
    isLoading:true, 
    firstWrite: false,
    tabList: [
      {
        text: '探索',
        isActive: true,
        openType: 'redirectTo',
        url: '/pages/find/find',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-find1.png'
      },
      {
        text: '写信',
        isActive: false,
        openType: 'redirectTo',
        url: '/pages/msg/begin/begin',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-write.png'
      },
      {
        text: '我的',
        isActive: false,
        openType: 'redirectTo',
        url: '/pages/tabBar/mine/index',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-my.png'
      },
    ],
    findPushImage: '',
    findPushShow: false,
    findPushUrl: '',
    isLogin:false,
  },
  traceEvent(e) {
    // console.log(e)
  },

  onShow: function () {
    this.setData({
      firstWrite: app.globalData.firstWrite,
      isLogin:app.globalData.isLogin
    })

    //清除本地缓存
    wx.removeStorage({
      key: 'writeBack',
      success: function (res) { },
    })
    wx.removeStorage({
      key: 'famousLetter',
      success: function (res) { },
    })
  },
  onLoad: function (options) {
    app.globalData.cardUuid = ''; //清除念卡id
    this.footer = this.selectComponent('#appfooter');
    this.getList(1);
    this.getList(2);
    this.getChangeHeight(); 
    
    setTimeout(() => {
      this.setData({
        firstWrite: false
      })
      app.globalData.firstWrite = false
    }, 5000)
    
    //分享者信息
    app.setInviteInfo(options);
  },
  onReady: function (){
    var that = this;
    // setTimeout(() => {
    //   app.login(function () {
    //     that.getFindPush();
    //   })
    // }, 500)

    //this.getUserAuthor(); //解决wx.authorize({ scope: "scope.userInfo" }) 后续不会出现授权弹窗的问题
  }, 

  getUserAuthor: function(){
    var that = this;
    app.getSetting(function(){
      that.setData({
        isAuthor: app.globalData.isAuthor,
      })
      if (app.globalData.isAuthor) {
        setTimeout(() => {
          app.login(function () {
            that.getFindPush();
          })
        }, 500)
      } 
    })
  },
  getUserInfoFun:function(e){
    var that = this, url = e.currentTarget.dataset.url, openType = "navigator";
    // if (!e.detail.userInfo){
    //   return false;
    // }

    // if (app.globalData.userInfo && app.globalData.userInfo.openId) {
    //   app.toNavigate(openType,url);
    //   return false;
    // }
    // app.login(function (data) {
    //   app.toNavigate(openType, url);
    // });

    if(that.data.isLogin){
      app.toNavigate(openType, url);
    }else{
      app.phoneLogin(e, function () {
        app.toNavigate(openType, url);
      })
    }
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
  getList: function (num,callback) {
    var that = this;
    var pageSize = (num > 1) ? that.data.pageSize : 10;
    var url = (num > 1) ? URL.getHotArticleList:URL.getBannerList;
    if ((num>1 && !that.data.isBeginAjax) || !that.data.isLoading) return false;
    if (num > 1) that.setData({ isBeginAjax:false});
    wx.request({
      url: url,
      data: { page: that.data.pageNo, pageSize: pageSize},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        if(res.data.success == true){
          if (res.data.data.length == 0 && num > 1) {
            that.setData({
              loadingTxt: '到底了，没有数据了...',
              isLoading: false,
              isBeginAjax: true
            });
            return false;
          }
          if (num > 1) {
            that.data.pageNo = that.data.pageNo + 1;
            var arry = [];
            // for(var i =0;i<res.data.data.length;i++){ pageSize
            //  res.data.data[i].content = app.htmlReplace(res.data.data[i].content);
            // }
            if (that.data.articleList.length > 0) {
              that.data.articleList[that.data.articleList.length - 1].class = "";
              that.data.articleList = that.data.articleList.concat(res.data.data);
            } else {
              that.data.articleList = res.data.data;
            }
            that.data.articleList[that.data.articleList.length - 1].class = "last-item-box";
            that.setData({
              pageSize: 10,
              articleList: that.data.articleList,
              loadingTxt: that.data.textList[parseInt(Math.random() * 4)],
              hidden: false,
              isBeginAjax: true
            });
          } else {
            that.setData({
              bannerList: res.data.data
            })
          }
          callback && callback(); 
        }
      },
      error: function (res) {
        console.log(res);
        that.setData({
          hidden:false,
          isBeginAjax:true
        });
        callback && callback();
      }
    })
  },
  bindDownLoad: function () {
    var that = this;
    //that.setData({hidden:false});
    this.getList(2);
  },
  scroll: function (event) { 
    // this.setData({
    //   scrollTop: event.detail.scrollTop
    // });
  },
  refresh: function (event) {
    // var that = this;
    // console.log(event); 
    // this.setData({
    //   pageNo:1,
    //   articleList: [],
    //   scrollTop: 0,
    //   isLoading:true,
    //   hidden:true,
    //   hdLoading:false
    // });
    // this.getList(2,function(){
    //   that.setData({ hdLoading: true, hidden:false});
    // });
  }, 
  openView:function(e){
    var that = this,arryId = e.currentTarget.id.split('_');
    if (app.globalData.isBtnClick) {
      setTimeout(function () { app.globalData.isBtnClick = false; }, 200);
      return false;
    }
    app.globalData.isBtnClick = true;
    if(arryId[0]=='article'){ 
      wx.navigateTo({
        url: "./view/view?id=" + arryId[1],
        success: function () {
          setTimeout(function () {
            app.globalData.isBtnClick = false;
          }, 200);
        }
      })
      
    } else if (arryId[0] == 'banner'){
      var curBannerData = that.data.bannerList[arryId[1]], curId = (curBannerData.type == 1 || curBannerData.type == 2) ? curBannerData.content:curBannerData.bannerId;
      that.getViewData(curId, function (res) {
        if (res.data && res.data.data){
          if (/\[topic\]/g.test(res.data.data.content)){ 
            app.globalData.topicInfo = JSON.parse(res.data.data.content.replace(/\[\/topic|topic\]/g, ""));
            wx.navigateTo({
              url: "/pages/topic/redmsg/introduce/introduce",
              success: function () {
                setTimeout(function () {
                  app.globalData.isBtnClick = false;
                }, 200);
              }
            });
          }else{
            wx.navigateTo({
              url: "./view/view?id=" + res.data.data.articleId,
              success: function () {
                setTimeout(function () {
                  app.globalData.isBtnClick = false;
                }, 200);
              }
            });
          }
         
        }
         
      })
    }    
   
  },
  getViewData:function(id,callback){
    wx.request({
      //获取文章详情接口
      url: URL.getArticleView,
      data: {
        articleId: id,
      },
      method: 'GET',
      success: function (res) {
        callback && callback(res); 
      } 
    })
  },
  getFindPush: function () {
    var that = this;
    if (app.globalData.userInfo.userId) {
      wx.request({
        url: URL.getFindPush,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          userId: app.globalData.userInfo.userId
        },
        success: function (res) {
          if (res.data.success && res.data && res.data.data) {
            that.setData({
              findPushImage: res.data.data.content,
              findPushShow: res.data.data.isShow,
              findPushUrl: res.data.data.url,
            })
          }
        },
        fail: function (msg) {
          console.log(msg)
        }
      })
    } else {

    }
  },
  onCloseFindPush: function () {
    this.setData({
      findPushShow: false
    })
  },
  goPush: function () {
    var that = this;
    if (that.data.findPushUrl){
      wx.navigateTo({
        url: '/' + that.data.findPushUrl,
      })
    }
    // if (/^http/.test(that.data.findPushUrl)){
    //   wx.setStorage({
    //     key: 'webview',
    //     data: that.data.findPushUrl,
    //     success: function () {
    //       wx.navigateTo({
    //         url: '/pages/msg/webview/webview',
    //       })
    //     }
    //   })
    // }
  },
  onShareAppMessage: function (res) {
    var param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '?inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '?inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: '念念',
      path: '/pages/find/find' + param,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})