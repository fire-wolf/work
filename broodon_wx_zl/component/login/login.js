var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false, tt = null;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    list: {
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: []
    },
    isShowClose: {
      type: Boolean,
      value: true
    }

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    phone: '',
    phoneFocus: false,
    smsCode: '',
    smsCodeFocus: false,
    errorText: '',
    errorHidden: true,
    countdown: 60,
    isCountTime: false,
    isBtnClick: false,
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */


  methods: {
    /*
     * 公有方法
     */

    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    go: function (e) {
      var that = this, info = e.currentTarget.dataset.info, tt = null;
    },
    onFocusPhone: function() {
      this.setData({
        errorHidden: true,
        phoneFocus: true
      })
    },
    onFocusCode: function () {
      this.setData({
        smsCodeFocus: true,
        errorHidden: true,
      })
    },

    onInputPhone: function(e){
      this.setData({
        phone: e.detail.value,
        phoneFocus: true
      })
    },
    onBlurPhone: function (e) {
      this.setData({
        phoneFocus: false
      })
    },
    onBlurCode: function (e) {
      this.setData({
        smsCodeFocus: false
      })
    },
    onInputCode: function (e) {
      this.setData({
        smsCode: e.detail.value,
        smsCodeFocus: true
      })
    },
    onGotUserInfo: function (e) {
      var that = this, userInfo = e.detail.userInfo;
      if (this.data.isBtnClick) return false;
      this.setData({ isBtnClick: true});
      console.log(userInfo)
      //app.globalData.cacheFun(); return false;
      if (e.detail.errMsg == 'getUserInfo:ok' && userInfo){
        app.globalData.userInfo = Object.assign(app.globalData.userInfo, userInfo)
        if (that.data.phone == ''){
          that.setData({
            errorText: '请输入手机号',
            errorHidden: false,
          })
          return false;
        }else if (/^1([3,4,5,7,8,9]{1})+\d{9}$/.test(that.data.phone) == false){
          that.setData({
            errorText: '请输入正确的手机号',
            errorHidden: false,
          })
          return false;
        }else if (that.data.smsCode == '') {
          that.setData({
            errorText: '请输入验证码',
            errorHidden: false,
          })
          return false;
        }else{
          that.setData({
            errorHidden: true,
          })
          this.checkUserMobile(() => {
            wx.request({
              url: URL.smsLogin,
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                mobile: that.data.phone,
                smsCode: that.data.smsCode,
                openId: app.globalData.userInfo.openId,
                country: userInfo.country,
                city: userInfo.city,
                nickName: userInfo.nickName,
                province: userInfo.province,
                sex: userInfo.gender,
                userImage: userInfo.avatarUrl,
              },
              success: (res) => {
                //console.log(res)
                if (res.data && res.data.success) {
                  that.setData({ isBtnClick: false });
                  that.triggerEvent("handleShowLogin", false); 
                  app.globalData.cacheFun && app.globalData.cacheFun();
                } else if (res.data && res.data.msg) {
                  that.setData({
                    errorText: res.data.msg,
                    errorHidden: false,
                    isBtnClick: false
                  })
                }
              },
              fail: (res) => {
                console.log(res);
                that.setData({ isBtnClick: false });
              }
            })
          })
        }
      }
      // console.log(e.detail.errMsg)
      // console.log(e.detail.userInfo)
      // console.log(e.detail.rawData)
    },
    checkUserMobile: function(callBack){
      var that = this;
      wx.request({
        url: URL.checkUserMobile,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          mobile: that.data.phone
        },
        success: (res) => {
          //console.log(res)
          if (res.data && res.data.success) {
            callBack && callBack();
          } else if (res.data && res.data.msg) {
            that.setData({
              errorText: res.data.msg,
              errorHidden: false,
            })
          
          }
        },
        fail: (res) => {
          console.log(res)
        }
      })
    },
    sengSmsCode: function(){
      
      var that = this;
      if (this.data.isCountTime) return false;
      if (/^1([3,4,5,7,8,9]{1})+\d{9}$/.test(that.data.phone) == false) {
        that.setData({
          errorText: '请输入正确的手机号',
          errorHidden: false,
        })
        return false;
      }
      wx.request({
        url: URL.getSmsCode,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data:{
          mobile: this.data.phone
        },
        success: (res)=>{
          //console.log(res);
          if(res.data && res.data.success){
            that.setData({
              errorHidden: true
            })
            that.settime();
          } else if (res.data && res.data.msg){
            that.setData({
              errorText: res.data.msg,
              errorHidden: false,
            })
          }
        },
        fail: (res) => {
          if (res.data && res.data.msg) {
            wx.showToast({ title: res.data.msg, icon: "none" })
          }
        }
      })
    },
    settime: function(){
      var that = this;
      clearInterval(tt);
      tt = setInterval(function(){
        if (that.data.countdown == 0) {
          that.setData({
            countdown: 60,
            isCountTime: false
          })
          clearInterval(tt);
          return;
        } else {
          that.setData({
            isCountTime: true,
            countdown: that.data.countdown - 1,
          })
        }
      },1000)
    },
    onClose: function(){
      this.triggerEvent("handleShowLogin", false); return false;
    },
  }
})