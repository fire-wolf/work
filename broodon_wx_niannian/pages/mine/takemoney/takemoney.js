var tt = null;
var app = getApp(),
  URL = app.globalData.URL;
var canClick = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpen: false,
    confirm: "下一步",
    isSendCode: false,
    sendTip: "发送验证码",
    time: 60,
    success: false,
    money: null,
    balance: '0.00',
    curBalance:0,
    accountName: null,
    accountNumber: null,
    userTel: null,
    smsCode: null,
    isQuestion:false,
    yunMediaRoot: URL.yunMediaRoot,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      balance: options.balance ? parseFloat(options.balance).toFixed(2): '0.00',
      userTel: app.globalData.userInfo.userTel,
    })
  },
  keepPoint: function(e) {
    var value = e.detail.value;
    if (value >= this.data.balance) {
      this.setData({
        money: this.data.balance
      })
    } else {
      this.setData({
        money: value
      })
    }
  },
  getBalance:function(num){
    var balance = num, changeNum, numA = num * 0.006 ; 
    changeNum = (balance - numA)* 0.005;
    if (changeNum>=25){
      return parseFloat(balance - (25 + numA)).toFixed(2);
    } else if (changeNum<=1){
      return parseFloat(balance - (1 + numA)).toFixed(2);
    }else{
      return parseFloat(balance - (changeNum + numA)).toFixed(2);
    }
     
  },
  inputBlur:function(e){
    var that = this;
    if(e.detail.value!=''){
      this.setData({
        curBalance: that.getBalance(e.detail.value)
      })
    }else{
      this.setData({
        curBalance:0
      })
    }
  },
  takeAll: function() {
    var that = this;
    this.setData({
      money: this.data.balance,
      curBalance: that.getBalance(that.data.balance)
    })
  },
  inputName: function(e) {
    var value = e.detail.value;
    this.setData({
      accountName: value
    })
  },
  inputAccount: function(e) {
    var value = e.detail.value;
    this.setData({
      accountNumber: value
    })
  },
  inputCode: function(e) {
    var value = e.detail.value;
    this.setData({
      smsCode: value
    })
  },
  //遇到问题
  openStatement:function(){
    wx.navigateTo({
      url: './moneyinfo/moneyinfo',
    })
  },
  //关闭说明
  closeStatement:function(){
    this.setData({
      isQuestion:false
    })
  },
  //倒计时
  timeDown: function() {
    var that = this;
    tt = setInterval(() => {
      if (that.data.time <= 0) {
        that.setData({
          time: 60,
          isSendCode: false,
        })
        clearInterval(tt);
        return;
      }
      that.setData({
        time: that.data.time - 1
      })
    }, 1000)
  },
  //点击下一步
  onNextStep: function() {

    if (!this.data.money) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000,
      })
    } else if(this.data.money < 100){
      wx.showToast({
        title: '最低提现金额不能低于100元',
        icon: 'none',
        duration: 2000,
      })
    } else if (parseFloat(this.data.money) > parseFloat(this.data.balance)) {
      wx.showToast({
        title: '提现金额不能大于钱包余额',
        icon: 'none',
        duration: 2000,
      })
    }else if (!this.data.accountName) {
      wx.showToast({
        title: '请输入支付宝姓名',
        icon: 'none',
        duration: 2000,
      })
    } else if (!this.data.accountNumber) {
      wx.showToast({
        title: '请输入支付宝账号',
        icon: 'none',
        duration: 2000,
      })
    } else {
      if (this.data.confirm == "下一步") {
        this.setData({
          confirm: "确认提交",
          isOpen: true,
        })
      } else {
        if (!this.data.smsCode) {
          wx.showToast({
            title: '请输入短信验证码',
            icon: 'none',
            duration: 2000,
          })
        } else { 
          this.applyTixian((data) => {
            // console.log(data);
            if (data.success) {
              this.setData({
                isOpen: false,
                confirm: "下一步",
                isSendCode: false,
                sendTip: "发送验证码",
                time: 60,
                success: true,
                money: null,
                balance: '0.00',
                accountName: null,
                accountNumber: null,
                userTel: null,
                smsCode: null,
              })
            }else{
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          });
        }
      }
    }
  },
  onCancel: function() {
    clearInterval(tt);
    this.setData({
      confirm: "下一步",
      isOpen: false,
      isSendCode: false,
      time: 60
    })
  },
  onSendCode: function() {
    if (!canClick) {
      return false;
    }
    canClick = false;
    this.getMsgCode((data) => {
      canClick = true;
      console.log(data);
      if (!data.success) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    });
    this.setData({
      isSendCode: true,
    })
    this.timeDown();
  },
  //获取短信验证码
  getMsgCode: function(callback) {
    wx.request({
      url: URL.getMsgCode,
      data: {
        userTel: this.data.userTel,
        smsType: 'sms_user_tixian',
        secondSendSms: 1,
        userTelZone: '86',
      },
      success: function(res) {
        if (res && res.data) {
          callback && callback(res.data);
        }
      }
    })
  },
  //提现申请
  applyTixian: function(callback) {
    wx.request({
      url: URL.applyTixian,
      data: {
        accountName: this.data.accountName,
        accountNumber: this.data.accountNumber,
        money: this.data.money,
        smsCode: this.data.smsCode,
        userId: app.globalData.userInfo.userId
      },
      success: function(res) {
        if (res && res.data) {
          callback && callback(res.data)
        }
      },
    })
  },
  toMyPacket: function() {
    wx.navigateTo({
      url: '/pages/mine/mypacket/mypacket',
    })
  }
})