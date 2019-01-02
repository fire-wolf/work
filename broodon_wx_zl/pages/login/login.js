var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
// 倒计时60s
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}
//判断是否是手机号码 
function IsTel(s) {
  if (s != null) {
    var length = s.length;
    if (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(s)) {
      return true;
    } else {
      return false;
    }
  }
}    
    

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userTelZone:"86",
    userTel: '',
    smsCode: '',
    infoMess:'', 
    last_time: '',
    is_show: true,
    isSubmit:true,
    telFirstVal:true,
    isLogin:false
  },
  onLoad:function(){
    var that = this;
    if (app.globalData.isLogin){
      wx.navigateBack({
        url: app.globalData.hisUrl
      });
    }

  },
  onUnload:function(){
    countdown = 0;
  },
  
  //验证手机号码及验证码
  validateData:function(){
    var isTel = IsTel(this.data.userTel);
    if (this.data.userTel.length == 0) {
      this.setData({
        infoMess: '手机号不能为空！',
        isSubmit: true
      })
    } else if (!isTel) {
      this.setData({
        infoMess: '请输入正确的手机号！',
        isSubmit: true
      })
    } else if (this.data.telFirstVal){
      this.setData({
        infoMess: '',
        isSubmit: true
      })
      return false;
    } else if (this.data.smsCode.length == 0) {
      this.setData({
        infoMess: '验证码不能为空！',
        isSubmit: true
      })
    } else {
      this.setData({
        infoMess: '',
        isSubmit: false
      })
    }
  },
  // 监听手机号输入
  listenerPhoneInput: function (e) {
    this.data.userTel = e.detail.value;
  },
  phoneOnblur: function(){
    this.validateData();
  }, 
  // 监听验证码输入
  listenersmsCodeInput: function (e) {
    this.data.smsCode = e.detail.value;
    this.setData({ telFirstVal:false});
    if (this.data.smsCode.length != 0){
      this.validateData();
    }
  },
  smsCodeOnblur: function () {
    this.validateData();
  },
  // 监听登录按钮
  listenerLogin: function (e) {
    
    var that = this, userInfo = app.globalData.userInfo, sysInfo = app.globalData.sysInfo;

    if (!this.data.isSubmit){
      if (isBtnClick) return false;
      isBtnClick = true;
      var param = {
        userTel: this.data.userTel,
        smsCode: this.data.smsCode,
        userSex: userInfo.gender,
        unionId: userInfo.unionId,
        image: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mobileType: /iOS/g.test(sysInfo.system) ? 1 : 0
      }
      if (app.globalData.inviteInfo.inviteUserId) {
        param = Object.assign(param, { 'inviteUserId': app.globalData.inviteInfo.inviteUserId });
      } 
      if (app.globalData.inviteInfo.inviteActiviName) {
        param = Object.assign(param, { 'inviteActiviName': app.globalData.inviteInfo.inviteActiviName })
      }

      if (app.globalData.cardUuid && app.globalData.cardUuid!=""){
        param = Object.assign(param, { 'cardUuid': app.globalData.cardUuid })
      }

      //登录
      wx.request({
        url: URL.login,
        method:'POST',
        data: param,
        header: {
          "Content-Type": "application/x-www-form-urlencoded" 
        },
        success: function (res) {
          if (res.data.success) {
            console.log("ok");
            app.globalData.isLogin = true;
            app.globalData.userInfo.userId = res.data.data.userId;
            app.globalData.userInfo.image = res.data.data.image;
            app.globalData.userInfo.nickName = res.data.data.nickName;
            if (/pages\/my\/my/g.test(app.globalData.cacheUrl)) {
              wx.redirectTo({
                url: app.globalData.cacheUrl,
                success: function () {
                  setTimeout(function () { isBtnClick = false; }, 1000);
                }
              })
            }else{
              wx.navigateTo({
                url: app.globalData.cacheUrl,
                success: function () {
                  setTimeout(function () { isBtnClick = false; }, 1000);
                }
              });
            }
            
          }else{
            that.setData({
              infoMess: res.data.msg,
              isSubmit: true
            })
            isBtnClick = false;
          }
        },
        fail: function (res) {
          that.setData({
            infoMess: '验证码不正确！',
            isSubmit: true
          });
          isBtnClick = false;
        }
      })
    }
  },
  // 获取验证码
  getSmsCode: function(){
      var that = this;
      var isTel = IsTel(this.data.userTel)
      if (this.data.userTel.length == 0) {
        this.setData({
          infoMess: '手机号不能为空！'
        })
      } else if (!isTel) {
        this.setData({
          infoMess: '请输入正确的手机号！'
        })
      } else {
        this.setData({
          infoMess: ''
        });
        countdown = 60;
        //发送验证码
        wx.request({
          url: URL.getSmsCode,
          data: { userTel: this.data.userTel, userTelZone: '86' },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            if (res.statusCode == 200) {
              // 将获取验证码按钮隐藏60s，60s后再次显示
              that.setData({
                is_show: (!that.data.is_show)  //false
              })
              settime(that);
            }
          },
          fail: function () {
            
          }
        })   
      }
  }

})