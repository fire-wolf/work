// 我的家书详情
import Utils from '../../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    userImg: '',
    msgId: '',
    letter: {
      title: '',
      content: '',
      author: '',
      date: '',
      coverUrl: '',
      detailUrl: ''
    },
    scrollTop:23,
    idx: 0,
    myRank: '',
    msgConfig: {
      paperTop: URL.yunMediaRoot + 'niannianyun/wx/topic/letter/bg-letter-top.png?v=1',
      paperMidle: URL.yunMediaRoot + '/niannianyun/wx/topic/letter/bg-letter-middle.png',
      paperBottom: URL.yunMediaRoot + 'niannianyun/wx/topic/letter/bg-letter-bottom.png',
      backgroundColor: '#ffffff'
    },
    btnHidden: true,
    scrollViewHeight: '100%',
    windowHeight: 603,
    shareHidden: true,
    screenWidth: 375,
    isAuthor: true,
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    Utils.setNavigationBar("红色家书", "#ffffff", "#D84847");

    if (app.globalData.isLogin) {
      that.setCurrentData(options);
    }else{
      wx.hideShareMenu();
    }
    
    this.setData({
      msgId: options.id
    });

    //分享者信息
    app.setInviteInfo(options);

    this.getUserAuthor();
   
    wx.request({
      //获取文章详情接口
      url: URL.getArticleView,
      data: {
        articleId: 25284,
      },
      method: 'GET',
      success: function (res) {
        if(res.data && res.data.success && res.data.data){
          var list = JSON.parse(res.data.data.content.replace(/\[\/topic|topic\]/g, ""))
          if (list && list[0] && list[0].length > 0) {
            var item = list[0].filter(function (obj) {
              return obj.id == options.id;
            });
            item[0].content = item[0].content.replace(/  /g, "　　");
            item[0].info = item[0].info.replace(/  /g, "　　");
            that.setData({ letter: item[0] });
          }
        }
      }
    })

    that.getRank();

  },
  getUserAuthor: function () {
    var that = this;
    app.getSetting(function () {
      that.setData({
        isAuthor: app.globalData.isAuthor,
      })
    })
  },
  setCurrentData: function (options) {
    var that = this;

    that.setData({
      nickName: app.globalData.userInfo.nickName ? app.globalData.userInfo.nickName : app.globalData.wxUserInfo.nickName,
      userImg: app.globalData.userInfo.image ? app.globalData.userInfo.image : (app.globalData.wxUserInfo ? app.globalData.wxUserInfo.avatarUrl : ''),
      msgId: options.id,
      msgConfig: Utils.msgConfig('redMsg', app.globalData.msgObj.msgConfig),
      scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 63) + 'px',
    })

    that.onShareAppMessage()
  },

  getRank: function() {
    var that = this;
    if (app.globalData.isLogin) {
      wx.request({
        url: URL.getMyRank,
        data: { userId: app.globalData.userInfo.userId },
        success: function (res) {
          if (res.data.data) {
            that.setData({
              myRank: res.data.data ? res.data.data.rank : '',
            })
            that.onShareAppMessage()
          }
        }
      })
      wx.showShareMenu()
    } else {
      wx.hideShareMenu()
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onReady: function () {
    
  },

  onShowBtn: function() {
    this.setData({
      btnHidden: !this.data.btnHidden
    })
  },

  onHideBtn: function() {
    this.setData({
      btnHidden: true
    })
  },

  //点击留下感悟 跳转到编辑页面
  goToEdit: function() {
    var that = this

    if (isBtnClick == true) return false;
    isBtnClick == true

    if (app.globalData.isLogin) {
      app.globalData.hisUrl = '';
      that.go("/pages/topic/redmsg/editor/editor")
    } else {
      app.login(function (data) {
        if (app.globalData.isLogin) {
          that.go("/pages/topic/redmsg/editor/editor")
        } else {
          app.globalData.hisUrl = "/pages/topic/redmsg/msgdetail/msgdetail?id=" + that.data.msgId;
          app.globalData.cacheUrl = "/pages/topic/redmsg/editor/editor"; 
          that.go("/pages/login/login")
        }
      })
    }
  },

  goIntroduce: function(){
    var that = this;
    wx.setStorage({
      key: 'introduce-hidde-btn',
      data: true,
      success: function() {
        that.go('/pages/topic/redmsg/introduce/introduce');
      }
    })
    
  },

  goIndex: function(){
    var that = this;
    app.globalData.hisUrl = '';
    app.login(function (data) {
      if (app.globalData.isLogin) {
        var flag = false;
        var routes = getCurrentPages();
        routes.map(function(item){
          if (/pages\/redmsg\/index/.test(item.route)){
            flag = true
          }
        })
        if (flag){
          wx.navigateBack({
            delta: 1
          })
        }else{
          that.go('/pages/topicBar/redmsg/index');
        }
        
      } else {
        app.globalData.hisUrl = '/pages/topic/redmsg/msgdetail/msgdetail?msgId=' + that.data.msgId;
        app.globalData.cacheUrl = '/pages/topicBar/redmsg/index';
        that.go('/pages/login/login');
      }
    })
  },

  //成为传习者 去生成图片
  goCreateImage: function(){ 
    var that = this;
    app.globalData.hisUrl = '';
    app.login(function (data) {
        wx.setStorage({
          key: 'redMsgDetail',
          data: {
            msgId: that.data.msgId,
            letter: that.data.letter,
            myRank: that.data.myRank
          },
          success: function () {
            if (app.globalData.isLogin) {
              app.globalData.hisUrl = '';
              that.go('/pages/topic/redmsg/createimg/createimg')
            }else {
              app.globalData.hisUrl = "/pages/topic/redmsg/createimg/createimg";
              app.globalData.cacheUrl = "/pages/topic/redmsg/createimg/createimg";
              that.go("/pages/login/login")
            }
          }
        })
    })
  },
  
  go: function (_url) {
    if (isBtnClick) return false;
    isBtnClick = true;
    wx.navigateTo({
      url: _url,
      success: function () {
        setTimeout(function(){
          isBtnClick = false;
        },2000)
      }
    })
  },

  onUnload: function () {
    if (/\/pages\/topic\/redmsg\/msgdetail/g.test(app.globalData.hisUrl) ||
      /\/pages\/redmsg\/index/g.test(app.globalData.hisUrl) 
     ) {
      app.globalData.hisUrl = ""
      wx.navigateBack({
        delta: 1
      })
    }
    
  },

  //转发
  onShareAppMessage: function () {
    var that = this, shareInfo = {}, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=redMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=redMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: that.data.nickName + ' 红色家书第' + that.data.myRank + '位传习者，为您推荐' + that.data.letter.author+'的家书',
      path: '/pages/topic/redmsg/msgdetail/msgdetail?id=' + that.data.msgId + param,
      imageUrl: URL.yunMediaRoot + "niannianyun/wx/topic/red/1.5/share-redpyq-bg3.png",
      complete: function (res) {

      }
    }
  },

  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = [];//获取data-list
    imgList.push(src);
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  scroll: function (event) { 
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  }
})