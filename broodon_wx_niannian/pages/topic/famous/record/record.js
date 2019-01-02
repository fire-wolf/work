// pages/famous/famousDetail/famousDetail.js\ 
var utils = require('../../../../utils/util.js');

var app = getApp(), URL = app.globalData.URL; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    actId: '',
    isIphoneX: app.globalData.isIphoneX,
    yunMediaRoot: URL.yunMediaRoot,
    txtVal:'',
    arryImg: [],
    imgMaxCount:9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    wx.getStorage({
      key: 'actParam',
      success: function (res) {
        that.setData({
          actId: res.data.actId,
          userId: res.data.userId,
          isLogin: app.globalData.isLogin,
          openId:app.globalData.userInfo.openid||''
        });
      }
    })
    wx.setNavigationBarTitle({
      title: "发布活动记录"
    });
  },
  //文本内容输入
  onTxtBlur:function(e){  
      this.setData({
        txtVal: e.detail.value
      })
  },
  uploadFileFun: function (filePath, successFun, errorFun) {
    utils.uploadFun({
      fileName: 'niannianyun/wx/images/' + new Date().getTime() + filePath.replace(/.*?(\.\w+)$/, "$1"),
      url: filePath
    },
      (respone) => {
        successFun && successFun(respone);

      },
      (error) => {
        errorFun && errorFun(error);
      }
    )  
    
  },
  //选择并上传图片
  onSelectImg:function(){
    var that = this;
    wx.chooseImage({
      count: that.data.imgMaxCount,
      success: function (res) {
        var arryImg = that.data.arryImg;
        //imgData['images'] = res.tempFilePaths[0];
        wx.showLoading({
          title: '上传中',
        })
        var imgUploaderFun = function (num) {
          if (num == res.tempFilePaths.length) {
             wx.showLoading({
              title: '上传成功'
            })
            setTimeout(function(){
              wx.hideLoading();
            },2000);            
            return false;
          }
          that.uploadFileFun(res.tempFilePaths[num], function (data) {
            arryImg.push(data.imageURL);
            if (that.data.imgMaxCount<0){
              wx.showLoading({
                title: '只能上传9张记录图！'
              })
              setTimeout(function () {
                wx.hideLoading();
              }, 2000);   
              return false;
            }
            that.setData({
              arryImg: arryImg,
              imgMaxCount: that.data.imgMaxCount - 1
            })
            num++;
            imgUploaderFun(num);
          }, function (error) {
            num++;
            imgUploaderFun(num);
          });
        },
          num = 0;
        imgUploaderFun(0);
        
      }
    })
  },
  //删除已上传的图片
  removeImg:function(e){
    var index = e.target.dataset.index,arryImg = this.data.arryImg;
     arryImg.splice(index,1);
    this.setData({
      arryImg:arryImg,
      imgMaxCount: this.data.imgMaxCount-1

    })
  },
   //发布内容提交
  onSubmit:function(e){
    var txtVal = this.data.txtVal;
    txtVal = txtVal.replace(/^\s+|\s+$/,"")
    if(this.data.txtVal=="" || txtVal==""){
      wx.showToast({
        title: '请输入要记录的内容！',
        icon: 'none',
        duration: 3000,
        mask: true
      });
      this.setData({
        txtVal:''
      })
      return false;
    }
    if (!e.detail.formId) {
      wx.showToast({
        title: '表单Id不存在，请重新提交',
        icon: 'none',
        duration: 3000,
        mask: true
      })
      return false;
    }

      wx.request({
        url: URL.addActRecord,
        data: {
          activitiesId: this.data.actId,
          userId: this.data.userId,
          text: this.data.txtVal,
          images: (this.data.arryImg && this.data.arryImg.length>0)?this.data.arryImg.join(","):"",
          openId: this.data.openId,
          formId:e.detail.formId
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          wx.showToast({
            title: '发布成功',
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
        fail: function (error) {
          wx.showToast({
            title: error.errMsg,
            icon: 'none',
            duration: 3000
          })
        }
      })
  }
    



})