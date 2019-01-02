import URL from './utils/url.js';
import Utils from './utils/util.js';

//app.js
App({
  globalData: {
    userInfo: {},
    inviteInfo: {},
    code: '',
    cardUuid:'',
    isLogin: false,
    isAuthor: false, //是否已授权获取微信用户信息
    URL: URL,
    sysInfo: null,
    firstWrite: true,
    isBtnClick: false,
    msgObj: {
      "msgConfig": [
        {
          "type": "msg",
          "paperUrl": "https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-top.png,,https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-bottom.png,#F7F6F2"
        },
        {
          "type": "redMsg",
          "paperUrl": "https://file.niannian99.com/niannianyun/wx/topic/letter/bg-letter-top.png?v=1,,https://file.niannian99.com/niannianyun/wx/topic/letter/bg-letter-bottom.png,#ffffff"
        }
      ],
      "explainInfo": [
        {
          "content": "https://file.niannian99.com/niannianyun/wx/download/d1.png,https://file.niannian99.com/niannianyun/wx/download/d2.png,https://file.niannian99.com/niannianyun/wx/download/d3.png,https://file.niannian99.com/niannianyun/wx/download/d4.png"
        }
      ],
      "version": "v1.0"
    }
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this, logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //获取系统设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.sysInfo = res;
        if (res.model.indexOf('iPhone X') >= 0) {
          that.globalData.isIphoneX = true;
        }
      }
    })

    wx.request({
      url: URL.getConfig,
      method: 'GET',
      success: function (res) {
        if (res.data.success == true) {
          that.globalData.msgObj = res.data.data
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })

    // setTimeout(() => {
    //   that.login(function(){})
    // }, 3000)

  },
  login: function (callback) {
    var that = this
    if (!this.globalData.isLogin) {

      // 登录
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            //获取openid接口  
            url: URL.getUnionIdInfo,
            data: {
              jsCode: res.code,
            },
            method: 'GET',
            success: function (res1) {
              //console.log(res1)
              if (res1.data && res1.data.data && res1.data.data.session_key){
                that.globalData.sessionKey = res1.data.data.session_key;
              }
              if (res1.data && res1.data.data && res1.data.data.openid) {
                that.globalData.userInfo.openId = res1.data.data.openid;
              }
              that.getUserInfo(function (res2) {
                
                if (res1.data && res1.data.data && res1.data.data.unionid) {
                  that.globalData.userInfo.unionId = res1.data.data.unionid
                  that.isBind(res1.data.data.unionid, callback);

                } else {
                  wx.request({ //解密用户信息
                    url: URL.getDecryptUserInfo,
                    method: "POST",
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                      sessionKey: res1.data.data.session_key,
                      iv: res2.iv,
                      encryptedData: res2.encryptedData
                    },
                    success: function (res3) {
                      //console.log(res3)
                      if (res3.data.success == true) {
                        var userInfo = JSON.parse(res3.data.data);
                        that.globalData.wxUserInfo = userInfo;
                        that.globalData.userInfo = userInfo;
                        that.isBind(userInfo.unionId, callback)
                      }
                    }
                  })
                }
              });

            }
          });
        }
      });

    } else {
      callback && callback();
    }
  },
  isBind: function (unionId, callback) { //判断用户是否绑定念念
    var that = this
    wx.request({
      url: that.globalData.URL.getUserInfoView,
      data: {
        unionId: unionId,
        openid: that.globalData.userInfo.openId
      },
      method: 'GET',
      success: function (res) {
        if (res.data && res.data.data) {
          that.globalData.isLogin = true;
          that.globalData.userInfo = res.data.data;
        }
        callback && callback(res);
      }
    });
  },

  getUserInfo: function (callback) {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //that.globalData.userInfo = res.userInfo;
              that.globalData.userInfo = Object.assign(that.globalData.userInfo, res.userInfo);
              that.globalData.wxUserInfo = res.userInfo;
              that.globalData.isAuthor = true;
              callback && callback(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }

          })
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              that.getUserInfo(callback);
            },
            fail(res) {
              console.log(res)
              console.log('授权失败，走重新授权流程！');
              wx.showModal({
                title: '提示',
                content: "必须授权登录之后才能操作呢，是否重新授权登录？",
                showCancel: true,
                cancelText: "否",
                confirmText: "是",
                success: function (res) {
                  if (res.confirm) {
                    //console.log('用户点击确定')
                    that.goAuthorize(callback);
                  }
                }
              });

            }
          })
        }
      }
    });
  },
  goAuthorize: function (callback) {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          that.getUserInfo(callback);
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  //获取地图授权
  goMapAuthorize: function (callback) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: "必须授权获取位置信息才能操作，是否重新授权？",
      showCancel: true,
      cancelText: "否",
      confirmText: "是",
      success: function (res) {
        if (res.confirm) {
          if (wx.openSetting) {
            wx.openSetting({
              success: function (res) {
                if (res.authSetting['scope.userLocation']) {
                  callback && callback(res);
                }
              }
            })
          } else {
            wx.showModal({
              title: '授权提示',
              content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
            })
          }
        }
      }
    });
  },
  setInviteInfo: function (options) { //读取邀请者信息
    if (options.inviteUserId) {
      this.globalData.inviteInfo.inviteUserId = options.inviteUserId
    }
    if (options.inviteActiviName) {
      this.globalData.inviteInfo.inviteActiviName = options.inviteActiviName
    }
  },
  getSetting: function(callback){
    if (this.globalData.isAuthor){
      callback && callback();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            this.globalData.isAuthor = true;
          }
          callback && callback();
        },
        fail: res => {
          callback && callback();
        }
      })
    }
  },
  //跳转模式
  toNavigate: function (openType, url,callback) {
    if (openType == 'redirectTo') {
      wx.redirectTo({
        url: url,
        success: function () {
          callback && callback();
        }
      })
    } else {
      wx.navigateTo({
        url: url,
        success: function () {
          callback && callback();
        }
      })
    }
  },
  //获取手机号码注册
  phoneLogin:function(e,callback){
    var that = this;
    if (that.globalData.isLogin) {
      callback && callback()
    } else {
      var encrypteData = null,iv = null;
      if(e.detail){
        if (e.detail.encryptedData){
          encrypteData = e.detail.encryptedData;
        } else if (e.detail.detail.encryptedData){
          encrypteData = e.detail.detail.encryptedData;
        }
        if (e.detail.iv){
          iv = e.detail.iv;
        } else if (e.detail.detail.iv){
          iv = e.detail.detail.iv; 
        } 
      }
      if (e.detail && encrypteData && that.globalData.sessionKey) {
        var userInfo = that.globalData.userInfo, sysInfo = that.globalData.sysInfo;
        var param = {
          userSex: userInfo.gender,
          openid: userInfo.openId,
          unionid: userInfo.unionId,
          userImage: userInfo.avatarUrl,
          userNicename: userInfo.nickName,
          mobileType: /iOS/g.test(sysInfo.system) ? 1 : 0,
          encryptedData: encrypteData,
          iv: iv,
          sessionKey: that.globalData.sessionKey
        }
        if (that.globalData.inviteInfo.inviteUserId) {
          param = Object.assign(param, { 'inviteUserId': that.globalData.inviteInfo.inviteUserId });
        }
        if (that.globalData.inviteInfo.inviteActiviName) {
          param = Object.assign(param, { 'inviteActiviName': that.globalData.inviteInfo.inviteActiviName })
        }


        wx.request({
          //获取openid接口  
          url: URL.bindUserInfo,
          data: param,
          method: 'GET',
          success: function (res) {
            if (res.data && res.data.data) {
              that.globalData.userInfo = Object.assign(that.globalData.userInfo, res.data.data);
              that.globalData.isLogin = true;
              // that.setData({
              //   isLogin: true,
              //   nickName: res.data.data.userNicename,
              //   userImage: Utils.qnUrl(res.data.data.userImage)
              // });
              callback && callback()
            }
          },
          fail: function (error) {
            callback && callback()
          }
        });
      }else{
        console.log(e.detail.detail.errMsg);
        wx.showToast({
          title: '请授权后操作！',
          icon:'none',
          duration:3000
        })
      }
    } 
  }

})