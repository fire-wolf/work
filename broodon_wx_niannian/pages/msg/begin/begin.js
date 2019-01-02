var app = getApp(), URL = app.globalData.URL,isBtnClick = false;

Page({
  data: {
    yunMediaRoot: URL.yunMediaRoot,
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
        isActive: true,
        openType: 'none',
        url: '/pages/msg/begin/begin',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-write.png'
      },
      {
        text: '我的',
        isActive: false,
        openType: 'redirectTo',
        url: '/pages/tabBar/mine/index',
        iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-my.png'
      }
    ],
    firstWrite: false,
    isLogin: app.globalData.isLogin
  },
  onLoad:function() {
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },
  onShow:function(){ 
    wx.getStorage({
      key: 'redPacketTips',
      success: function(res) {
        if (res.errMsg =='getStorage:ok'){
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 5000,
            success:function(){
              wx.removeStorage({
                key: 'redPacketTips',
                success: function(res) {},
              })
            }
          })
        }
      },
    })
  },
  toType:function(e){
    var that = this,url = "", type = e.target.dataset.type;
    var that = this;
    if (isBtnClick == true) return false;
    isBtnClick = true;
    if (app.globalData.isLogin) {
      this.goTypeBtn(type);
    } else {
      if (e.detail && e.detail.encryptedData && app.globalData.sessionKey) {
        var userInfo = app.globalData.userInfo, sysInfo = app.globalData.sysInfo;
        var param = {
          userSex: userInfo.gender,
          openid: userInfo.openId,
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
            if (res.data && res.data.data) {
              app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data.data);
              app.globalData.isLogin = true;
              that.setData({
                isLogin: true,
                nickName: res.data.data.userNicename,
                userImage: Utils.qnUrl(res.data.data.userImage)
              });
              isBtnClick = false; 
              that.goTypeBtn(type); 
              
            }
          },
          fail: function (error) {
            isBtnClick = false; 
          }
        });
      } else {
        wx.setStorage({
          key: 'msg-type',
          data: type,
          success: function () {
            app.globalData.hisUrl = "/pages/msg/begin/begin";
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
  getUserInfoFun: function (e) {
    var that = this, type = e.currentTarget.dataset.type;
    if (!e.detail.userInfo) {
      return false;
    }
    if(isBtnClick) return false;
    isBtnClick = true;
    if (app.globalData.userInfo && app.globalData.userInfo.openId) {
      that.goTypeBtn(type);
      setTimeout(function () {
        isBtnClick = false;
      }, 1000)
      return false;
    }
    app.login(function (data) {
      that.goTypeBtn(type);
      setTimeout(function () {
        isBtnClick = false;
      }, 1000)
    });
  },
  goTypeBtn:function(type){
    var that = this,url = "";
    if (type == "media") {
      url = "/pages/msg/editor/editor";
    } else if (type == "redpacket") {
      url = "/pages/msg/begin/redpacket/redpacket";
    } else if (type == "time") {
      url = "/pages/msg/begin/timeletter/timeletter";
    } else if (type == "map") {
      wx.chooseLocation({
        success: function (res) {
          isBtnClick = false;
          that.goEditor(type, res);
        },
        fail: function (res) {
          isBtnClick = false; 
          wx.getSetting({
            success(res) { 
              if (!res.authSetting['scope.userLocation']) {
                app.goMapAuthorize(function(_data){
                  wx.chooseLocation({
                    success: function (res) {
                      that.goEditor("map", res);
                    }
                  }) 
                });
              }
            }
          }); 
          
        }
      })
      return false;
    }
    if (url != "") {
      wx.navigateTo({
        url: url,
        success:function(){
          setTimeout(function () {
            isBtnClick = false;
          }, 1000)
        }
      })
    }
  },
  goEditor:function(type,res){
    if(type=='map'){
      //console.log(res);
      if (res.latitude && res.longitude){
        if (res.address == ""){
          wx.showToast({
            title: '请选中定位地区地址！',
            icon:'none',
            duration:3000
          }); 
        }else{
          wx.navigateTo({
            url: "/pages/msg/editor/editor?map=" + JSON.stringify(res),
            success: function () {
              setTimeout(function () {
                isBtnClick = false;
              }, 1000);
            }
          });
        }
      }
    }
  }
    
})

