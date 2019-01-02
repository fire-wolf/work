var dateTimePicker = require('../../../../utils/dateTimePicker.js');
var Util = require('../../../../utils/util.js');
// 获取完整的年月日 时分秒，以及默认显示的数组
var obj = dateTimePicker.dateTimePicker(2018, 2050);
var dateTimeArray = obj.dateTimeArray;
var dateTime = obj.dateTime;
var date = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curDate: null,
    years: dateTimeArray[0],
    months: dateTimeArray[1],
    days: dateTimeArray[2],
    hours: dateTimeArray[3],
    minutes: dateTimeArray[4],
    curValue: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "发送时间"
    });
   
  },
  onShow: function () { 
    var that = this; 
    date = new Date()
    this.setData({
      curDate: Util.formatTime4(date),
      dateTime: date.getTime(),
      curValue: [date.getFullYear() - 2018, date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes()],
    });

    wx.getStorage({
      key: 'msgTime',
      success: function (res) {
        if (res.data.msgTime) {
          var date = new Date(res.data.msgTime.time);
          that.setData({
            curDate: Util.formatTime4(date),
            dateTime: date.getTime(),
            curValue: [date.getFullYear() - 2018, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()],
          });
        }
        wx.removeStorage({ key: 'msgTime' })
      }
    })
  },
  bindChange: function(e) {
    const val = e.detail.value;
    var changeDate = new Date();
    changeDate.setFullYear(this.data.years[val[0]]);
    changeDate.setMonth(this.data.months[val[1]]-1);
    changeDate.setDate(this.data.days[val[2]]);
    changeDate.setHours(this.data.hours[val[3]]);
    changeDate.setMinutes(this.data.minutes[val[4]]);
    //console.log(changeDate);
    this.setData({
      curDate: Util.formatTime4(changeDate),
      dateTime: changeDate.getTime()
    });
  },
  cancel: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  confirm: function() {
    var dateTime = {
      time: this.data.dateTime,
      timeStr: this.data.curDate.replace(/年|月/g,"-").replace(/日/g,"")
    },dd = new Date().getTime();
    if (dd > this.data.dateTime){
      wx.showToast({
        title: '设定的定时时间不能小于当前时间，请重试！',
        icon:'none',
        duration:3000
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/msg/editor/editor?time=' + JSON.stringify(dateTime)
    })
  }
})