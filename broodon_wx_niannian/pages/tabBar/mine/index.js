
import Utils from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
var first = null,scend = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIdentify:false,
    mainHt: '100%',
    nickName: '',
    userImage: '',
    unionId: '',
    userId: '',
    page: 1,
    letterList: [],
    systemMsg: {
      createTime: '',
      title: '',
      content: '',
      author: '',
      typeName: '官方',
      msgImg: ''
    },
    commonCount: 0,
    activityCount: 0,
    startX: 0,
    firstWrite: true,
    tabList: [
      {
        text: '探索',
        isActive: false,
        openType: 'redirectTo',
        url: '/pages/find/find',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-find.png'
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
        isActive: true,
        openType: 'redirectTo',
        url: '/pages/my/my',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-my1.png'
      },
    ],
    yunMediaRoot: URL.yunMediaRoot,
    isLogin:app.globalData.isLogin
  },

  /**
   * 生命周期函数--监听页面加载 userId:1349638
   */
  onLoad: function (options) {
    this.footer = this.selectComponent('#appfooter');
    this.getChangeHeight();
    // if (app.globalData.isLogin == true){
    //   this.setData({
    //     nickName: app.globalData.userInfo.nickName,
    //     userImage: app.globalData.userInfo.image,
    //     userId: app.globalData.userInfo.userId,
    //     unionId: app.globalData.userInfo.unionId
    //   })

    //   //this.getUnReadCount(); //获取未读数

    // }else{
    //   wx.redirectTo({
    //     url: "/pages/login/login",
    //     success: function () {
          
    //     }
    //   })
    // }
    this.setData({
      isLogin: app.globalData.isLogin,
      nickName: app.globalData.userInfo.nickName,
      userImage: app.globalData.userInfo.image || app.globalData.userInfo.avatarUrl,
      userId: app.globalData.userInfo.userId || '',
      unionId: app.globalData.userInfo.unionId || ''
    }) 
    setTimeout(()=>{
      this.setData({
        firstWrite: false
      })
      app.globalData.firstWrite = false
    },5000)

    wx.setNavigationBarTitle({
      title: "我的"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  onShow: function () {
    this.setData({
      firstWrite: app.globalData.firstWrite,
    })
    if(app.globalData.isLogin){
      this.getIDnumber();
    }
  },
  //获取用户认证信息
  getIDnumber:function(){
    var that = this;
    wx.request({
      url: URL.getIDnumber,
      data: {
        userId: this.data.userId || '',
        devKey: 'default'
      },
      method: 'GET',
      success: function(res) {
        if (res && res.data && res.data.success && res.data.userExtRealIdCard){
          that.setData({
            isIdentify: true
          })
        }
      },
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function (e) {
    //this.getList();
  },

  getList: function () {
    var that = this;
    wx.request({
      url: URL.getMyMsgList, 
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        page: that.data.page,
        pageSize: 10,
        userId: that.data.userId
      },
      success: function (res) {
        if (res.data && res.data.data && res.data.data.length>0){
          var list = that.data.letterList
          res.data.data.map(function(item, index){

            if(item.msgId){
              list.push({
                author: item.author,
                content: item.content,
                msgId: item.msgId,
                title: item.title,
                type: item.type,
                typeName: item.typeName,
                createTime: Utils.formatTime2(new Date(item.createTime)),
                left: 0,
              })
            }else{
              that.setData({
                systemMsg: {
                  author: item.author,
                  content: item.content,
                  msgId: '',
                  title: item.title,
                  typeName: item.typeName,
                  createTime: Utils.formatTime2(new Date(item.createTime)),
                  msgImg: item.image ? item.image.split(",")[0] : item.content.split(",")[0]
                }
              })
            }
          })
          that.setData({
            page: that.data.page + 1,
            letterList: list,
          })
        } 
      },
      fail: function (res) {
        that.setData({
          isBeginAjax: true
        });
      }
    })
  },

  getUnReadCount: function(){
    var that = this;
    wx.request({
      url: URL.getMyMsgUnReadCount,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        userId: that.data.userId
      },
      success: function (res) {
        //console.log(res)
        if(res.data.success == true){
          that.setData({
            commonCount: res.data.data.common,
            activityCount: res.data.data.activity
          })
        }
      },
      fail: function(msg){
        console.log(msg)
      }
    })
  },

  goList: function (e) {
    var that = this;
    if (isBtnClick == true) return false;
    isBtnClick = true;
    if (app.globalData.isLogin){
      this.toList(e.currentTarget.dataset.type);
    }else{ 
      if (e.detail && e.detail.encryptedData && app.globalData.sessionKey){
        var userInfo = app.globalData.userInfo, sysInfo = app.globalData.sysInfo;
        var param = {  
          userSex: userInfo.gender,
          openid:userInfo.openId,
          unionid: userInfo.unionId,
          userImage: userInfo.avatarUrl,
          userNicename: userInfo.nickName,
          mobileType: /iOS/g.test(sysInfo.system) ? 1 : 0,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: app.globalData.sessionKey
        }
        if (app.globalData.inviteInfo.inviteUserId) {
          param = Object.assign(param, { 'inviteUserId': app.globalData.inviteInfo.inviteUserId });
        }
        if (app.globalData.inviteInfo.inviteActiviName) {
          param = Object.assign(param, { 'inviteActiviName': app.globalData.inviteInfo.inviteActiviName })
        }


        wx.request({
          //获取openid接口  
          url: URL.bindUserInfo,
          data: param,
          method: 'GET',
          success: function (res) {
            if(res.data && res.data.data){
              app.globalData.userInfo = Object.assign(app.globalData.userInfo,res.data.data);
              app.globalData.isLogin = true;
              that.setData({
                isLogin:true,
                nickName: res.data.data.userNicename,
                userImage: Utils.qnUrl(res.data.data.userImage)
              });
              that.toList(e.currentTarget.dataset.type);
            } 
          },
          fail:function(error){

          }
        });
      }else{
        var type = e.currentTarget.dataset.type;
        wx.setStorage({
          key: 'msg-type',
          data: e.currentTarget.dataset.type,
          success: function () {
            app.globalData.hisUrl = "/pages/mine/list/list";
            if (type == "mypacket") {
              app.globalData.cacheUrl = '/pages/mine/mypacket/mypacket';
            } else if (type == "identify") {
              app.globalData.cacheUrl = '/pages/mine/identify/identify';
            } else if (type == "myactivity") {
              app.globalData.cacheUrl = '/pages/mine/myactivity/myactivity';
            } else if (type == "statistics") {
              app.globalData.cacheUrl = '/pages/mine/statistics/statistics'
            } else {
              app.globalData.cacheUrl = '/pages/mine/list/list';
            }

              wx.navigateTo({
                url: "/pages/login/login",
                success: function () {
                  setTimeout(function () {
                    isBtnClick = false;
                  }, 1000);
                }
              })
          }
        });
      }
      setTimeout(function () {
        isBtnClick = false;
      }, 1000)
    } 
    
  },
  toList:function(type){
    var url = null;
    if(type=="mypacket"){
      url = '/pages/mine/mypacket/mypacket';
    }else if(type == "identify"){
      url = '/pages/mine/identify/identify';
    }else if(type == "myactivity"){
      url = '/pages/mine/myactivity/myactivity';
    } else if (type == "statistics") {
      url = '/pages/mine/statistics/statistics'
    }else{
      url = '/pages/mine/list/list';
    }
    wx.setStorage({
      key: 'msg-type',
      data: type,
      success: function () {
        wx.navigateTo({
          url: url,
          success: function () {
            setTimeout(function () {
              isBtnClick = false;
            }, 1000)
          }
        })
      }
    })
  },
  goDetail: function(e){
    if (isBtnClick == true) return false;
    isBtnClick = true;
    if (e.currentTarget.dataset.id == "systemMsg"){
      wx.navigateTo({
        url: "/pages/msg/msgdetail/msgdetail?msgId=systemMsg",
        success: function () {
          setTimeout(function () {
            isBtnClick = false;
          }, 1000)
        }
      })
    }
  },

  getChangeHeight: function () {
    var that = this;
    that.setData({
      mainHt: (app.globalData.sysInfo.windowHeight - app.globalData.sysInfo.windowHeight / 750 * 98 / 2 - 10) + 'px'
    })
  },
  //登录后控制显示
  onLogin: function (e) {
    this.setData({
      isLogin: e.detail
    }) 
  },
})