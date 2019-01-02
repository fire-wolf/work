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
    companyId: '',
    actId: '',
    actDetail: null,
    isLogin: true,
    isIphoneX: app.globalData.isIphoneX,
    yunMediaRoot: URL.yunMediaRoot, 
    userTel:'',
    userName:'', 
    enrollInfo:[],
    btnSubName:'报名',
    isUpdate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'actDetail',
      success: function(res) {
        var enrollInfo = [], enrollField = [];
        if (options.type && options.type!=""){
          if (res.data.enrollInfo && res.data.enrollInfo!=""){
            enrollInfo = JSON.parse(res.data.enrollInfo);
          }
          that.setData({
            actDetail: res.data,
            isUpdate:true,
            userTel: res.data.phone,
            userName: res.data.name,
            userId: app.globalData.userInfo.userId || '',
            openId: app.globalData.userInfo.openid || '',
            enrollInfo: enrollInfo,
            btnSubName:"修改"
          })
        }else{
          if (res.data.enrollField && res.data.enrollField != "") {
            enrollField = res.data.enrollField.split(';');
            enrollField.forEach(function (o, i) {
              enrollInfo.push({
                key: 'file_' + i,
                name: o,
                value: ''
              });
            })
          }
          that.setData({
            actDetail: res.data,
            userTel: app.globalData.userInfo.userTel || '',
            userName: app.globalData.userInfo.nickName || '',
            userId: app.globalData.userInfo.userId || '',
            openId: app.globalData.userInfo.openid || '',
            enrollInfo: enrollInfo
          });  
        }
        
        
        
        
      },
    })
    wx.setNavigationBarTitle({
      title: "活动详情"
    })
  },
  onUnload:function(){
    wx.removeStorage({
      key: 'actDetail',
      success: function(res) {},
    })
  },
  onInputBlur: function (e) {
    var type = e.target.dataset.type;
    
      if(type=='name'){
        this.setData({
          userName: e.detail.value
        })
      }else if(type=='tel'){
        this.setData({
          userTel:e.detail.value
        })
      } else if (type=='filed'){ 
        var index = e.target.id.split('_')[1];
        this.setData({
          ['enrollInfo['+index+'].value']:e.detail.value
        })
      }
  },
  //图片放大效果
  onMaxImg: function (e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src, imgArry = [];
    imgArry.push(nowImgUrl);
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: imgArry // 需要预览的图片http链接列表
    })
  },
  //提交报名信息
  signSubmit:function(e){
    var enrollInfo = this.data.enrollInfo,that = this;
    if (enrollInfo && enrollInfo.length>0){
      var bool = false;
      enrollInfo.forEach(function(o,i){
        if(o.value==''){
          wx.showToast({
            title: '请输入'+o.name+'!',
            icon: 'none',
            duration: 3000,
            mask: true
          });
          bool = true;
          return false;
        }
      })
      if(bool) return false;
    }
    
    if (this.data.userName == "") {
      wx.showToast({
        title: '请输入姓名！',
        icon: 'none',
        duration: 3000,
        mask: true
      });
      return false;
    }

    if (this.data.userTel == "") {
      wx.showToast({
        title: '请输入联系电话！',
        icon: 'none',
        duration: 3000,
        mask: true
      });
      return false;
    }
    
     

    if (!e.detail.formId){
      wx.showToast({
        title: '表单Id不存在，请重新提交',
        icon:'none',
        duration:3000,
        mask:true
      })
      return false;
    } 
    wx.request({
      url: URL.actSignUp,
      data: {
        activitiesId: this.data.actDetail.activitiesId,
        mobile: this.data.userTel,
        userId:this.data.userId,
        name:this.data.userName,
        formId:e.detail.formId,
        openId: this.data.openId,
        enrollInfo: JSON.stringify(enrollInfo)
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.showToast({
          title: that.data.isUpdate?'报名更改成功':'报名成功',
          icon: 'none',
          duration: 3000,
          mask: true,
          success: (res) => {
            setTimeout(() => {
              wx.navigateBack({})
            }, 3000)
          }
        })
         
      },
      fail:function(error){
        wx.showToast({
          title: error.errMsg,
          icon:'none',
          duration:3000
        })
      }
    });
  }



})