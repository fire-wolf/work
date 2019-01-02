import URL from './common/url.js'

//app.js
App({
  globalData: {
    userInfo: {},
    isLogin: false,
    cacheUrl: '',
    cacheFun: ()=>{},
    myLink: '',
    sellerLink: '',
    URL: URL,
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    //获取系统设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.sysInfo = res;
        if (res.model.indexOf('iPhone X') >= 0) {
          that.globalData.isIphoneX = true;
        }
      }
    })

  },
  login: function (callback) {
    var that = this
    if (!this.globalData.isLogin) {
      // wx.openSetting({
      //   success: (res) => {

      //   }
      // })
      // wx.authorize({
      //   scope: 'scope.userInfo',
      //   success(res) {
      //     console.log(res)
      //   },
      //   fail(res) {
      //     console.log(res)
      //   }
      // })

      wx.login({
        success: function (res) {
          //console.log(res)
          wx.request({
            url: URL.getOpenId,
            data: {
              jsCode: res.code,
            },
            success: (res1) => {
              //console.log(res1)
              if (res1.data && res1.data.success){
                var _data = JSON.parse(res1.data.msg);
                that.globalData.userInfo.openId = _data.openid;
                wx.request({
                  url: URL.getUserInfo,
                  data: {
                    openId: _data.openid
                  },
                  success: (res2) => {
                    //console.log(res2)
                    if (res2.data && res2.data.data && res2.data.success) {
                      that.globalData.isLogin = true;
                      that.globalData.userInfo = Object.assign(that.globalData.userInfo, res2.data.data)
                    }else{
                      that.globalData.isLogin = false;
                    }
                    callback && callback();
                  }
                })
              }
            }
          })
        },
        fail: function(res){
          console.log(res)
          wx.showToast({ title: res.errMsg, icon: "none" });
        }
      });

    } else {
      callback && callback();
    }
  },

})