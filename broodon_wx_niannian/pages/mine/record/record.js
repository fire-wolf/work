var date = new Date(),
  years = [],
  months = [];
for (var i = 2016; i <= date.getFullYear(); i++) {
  years.push(i);
}
for (var i = 1; i <= 12; i++) {
  months.push(i);
}
var app = getApp(),
  URL = app.globalData.URL;
var isRequest = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yunMediaRoot: URL.yunMediaRoot,
    years: years,
    months: months,
    curValue: [],
    isOpenSelector: false,
    recordType: "", //trade交易记录，withdraw提现记录
    records: [],
    timeList: [],
    url: '',
    page: 1,
    loadingByTime: '',
    income:'0.00',
    pay:'0.00',
    isEnd: false, //数据是否到底
    isBottom: false, //是否触底
    curDate: '', //实时时间
    isRecord: true, //是否有明细记录
    isChangeValue: false, //选择器是否改变值
    curTime: '', //选择器当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      curValue: [date.getFullYear(), date.getMonth()],
      curDate: date.getFullYear() + "年" + (date.getMonth()+1) + "月",
      recordType: options.type || "",
      url: options.type == "trade" ? URL.getTradeRecord : URL.getWithdrawRecord,
      curTime: date.getFullYear() + '' + (date.getMonth() + 1),
    })
    this.getRecords('', 'up');
    if (options && options.type =='withdraw'){
      wx.setNavigationBarTitle({
        title: '提现',
      })
    } else if (options && options.type =='trade'){
      wx.setNavigationBarTitle({
        title: '交易记录',
      })
    }
    
  },
  //获取记录
  getRecords: function(time, recordType, callback) {
    var that = this;
    if (!isRequest) {
      return false;
    }
    isRequest = false;
    wx.request({
      url: that.data.url,
      data: {
        'page': that.data.page,
        'time': time || '',
        'type': recordType || 'up',
        'userId': app.globalData.userInfo.userId || 847,
      },
      success: function(res) {
        isRequest = true;
        if (res && res.data && res.data.data) {
          var result = res.data.data;
          var end = that.data.loadingByTime == result.nextTime ? true : false;
          if (time && time != "") {
            time = time.replace(/(\d{4})(\d{2})/g, "$1年$2月");
          } else {
            time = '本月';
          }   
          that.setData({
            isEnd: end, 
            income: result.income || '0.00',
            pay: result.pay || '0.00',
            time: time
          })
          if (result.resultList && result.resultList.length > 0 && that.data.loadingByTime != result.nextTime) {
            var recordList = result.resultList;             
            that.setData({
              page: that.data.page + 1, 
              records: recordList,
              loadingByTime: result.nextTime
            })
          }else{
            that.setData({
              records: null
            });
          }
          callback && callback(res.data.data);
        }
      }
    })
  },
  //下拉刷新监听
  onPullDownRefresh: function() {
    var that = this;
    this.setData({
      page: 1,
      records: [],
      timeList: [],
      loadingByTime: ''
    })
    this.getRecords('', 'down', () => {
      wx.stopPullDownRefresh();
    });
  },
  //上拉加载更多
  loadMore: function(e) {
    var that = this;
    this.setData({
      isBottom: true,
    })
    setTimeout(() => {
      if (!that.data.isEnd) {
        that.getRecords();
      }
      that.setData({
        isBottom: false,
      })
    }, 800)
  },
  //日历滑动监听
  onCalendar: function(e) {
    var value = e.detail.value
    console.log(value);
    this.setData({
      curValue: value,
      isChangeValue: true
    })
  },
  //打开日历
  openSelector: function() {
    wx.stopPullDownRefresh();
    this.setData({
      isOpenSelector: true,
    })
  },
  onCancel: function() {
    this.setData({
      curValue: [date.getFullYear(), date.getMonth()],
      isOpenSelector: false,
    })
  },
  onConfirm: function() {
    var value = this.data.curValue;
    if (this.data.isChangeValue) {
      if ((value[0] + 16 + '').length < 4) {
        value[0] = '20' + (value[0] + 16);
      }
      if (value[1] < 9) {
        value[1] = '0' + (value[1] + 1);
      } else {
        value[1] = value[1] + 1;
      }
      var time = value[0] + '' + value[1];
      this.setData({
        curTime: time
      })
    }
    console.log(this.data.curTime);
    this.setData({
      isChangeValue: false,
      isOpenSelector: false,
      page: 1,
      records: [],
      timeList: [],
      loadingByTime: ''
    })
    this.getRecords(this.data.curTime, 'up');
  }
})