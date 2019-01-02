// pages/famous/offense/offense.js
var app = getApp(), URL = app.globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '1784281',
    sourceId: '',
    reasonsList:[],
    chooseName: '',
    chooseValue: '',
    isQita: false,
    remark: '',
    isSubmit: false, //是否已经提交举报
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sourceId: options.sourceId,
      userId: app.globalData.userInfo.userId
    })
    this.getReasonList()
  },

  getReasonList: function(){
    wx.request({
      url: URL.getReportReason,
      success: (res)=>{
        if(res.data && res.data.success && res.data.data){
          this.setData({
            reasonsList: res.data.data
          })
        }
      },
      fail: (msg)=>{

      }
    })
  },

  onChoose:function(e){
    var index = e.currentTarget.dataset.index;
    var reasonsList = this.data.reasonsList;
    var isChoose = this.data.reasonsList[index].isChoose;
    reasonsList[index].isChoose = !isChoose;
    var chooseValue = [], chooseName = [];
    reasonsList.map((item,index)=>{
      if(item.isChoose){
        chooseValue.push(item.value);
        chooseName.push(item.name);
      }
    })
    this.setData({
      reasonsList: reasonsList,
      isQita: this.IsInArray(chooseValue, 'qi_ta'),
      chooseValue: chooseValue.toString(),
      chooseName: chooseName.toString()
    })
  },

  IsInArray: function(arr, val){ 
  　　var testStr= ',' + arr.join(",") + ","; 
  　　return testStr.indexOf("," + val + ",") != -1; 
  },

  onInputRemark: function(e){
    this.setData({
      remark: e.detail.value
    })
  },

  onSubmit: function(){
    if (this.data.isSubmit){
      wx.showToast({
        title: '已举报成功，请勿重新举报',
        icon: 'none',
        duration: 3000
      })
    }else if (this.data.chooseValue == ''){
      wx.showToast({
        title: '请选择举报原因',
        icon: 'none'
      })
    } else if (this.data.isQita && !this.data.remark) {
      wx.showToast({
        title: '请填写举报内容',
        icon: 'none'
      })
    }
    else{
      var data = {
        userId: this.data.userId,
        sourceId: this.data.sourceId,
        value: this.data.chooseValue,
        name: this.data.chooseName,
        content: this.data.isQita ? this.data.remark : '',
      }
      wx.request({
        url: URL.subMitReport,
        data: data,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res)=>{
          if(res.data && res.data.success){
            this.setData({
              isSubmit: true
            })
            wx.showToast({
              title: '举报成功',
              icon: 'none',
              duration: 3000,
              mask: true,
              success: (res)=>{
                this.setData({
                  remark: ''
                })
                setTimeout(()=>{
                  wx.navigateBack({})
                },3000)
              }
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        fail:(res)=>{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
  }
})