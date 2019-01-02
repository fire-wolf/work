var utils = require('../../../utils/util.js');
var app = getApp(), URL = app.globalData.URL;
Page({
  data:{
    times:0,
    timeLong:0,
    mTimes:0,
    mTimeLong:0,
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(), 
    days_style:[],
    days:[],//当前月份活动天
    curActDetail:null,
    userId:""
  },
  onLoad:function(){ 
    this.setData({
      userId: app.globalData.userInfo.userId || ""
    })
    this.getCountAllTime();
    this.getCountMonth();
    

    wx.setNavigationBarTitle({
      title: "统计数据"
    });
  },
  minToStr:function(num){
    var str = '';
    if(num>0){
      if(num>=60){
        str += Math.floor(num / 60) + '小时'
        num = num - Math.floor(num / 60)*60;
      }
      if(num>0){
        str += num + '分钟';
      }
      
    }
    return str;
  },
  getCountMonth: function (month,year){
    var that = this, date = new Date(year || this.data.year, month || this.data.month, 0);
    wx.request({
      url: URL.getActCountMonth,
      data: {
        userId: that.data.userId,
        year: date.getFullYear(),
        month: date.getMonth()+1,
      },
      success: function (res) { 
        if (res.data.success) {
          if (res.data.data.list && res.data.data.list.length > 0){
            var days = [],actList = [];
            res.data.data.list.forEach(function (item) {
              var day = new Date(item.checkInTime).getDate();
              days.push(day);
              item['day'] = day;
              actList.push(item);
            });
            days.sort();
            days = utils.unionArry(days); 
            // console.log(actList);
            that.setData({
              days:days, 
              actList: actList
            })
            that.setDataStyle(month, year,days);
          }else{
            that.setDataStyle(month, year);
            that.setData({ 
              actList: []
            })
          }
          that.setData({
            mTimeLong: that.minToStr(res.data.data.timeLong),
            mTime: res.data.data.times
          })
        }else{
          that.setDataStyle(month, year);
        }
        
      },
      fail:function(){
        that.setDataStyle(month, year);
      }
    })
  },
  getCountAllTime:function(){
    var that = this;
    wx.request({
      url: URL.getActCountAllTime,
      data:{
        userId:that.data.userId
      },
      success:function(res){
        // console.log(res);
        if(res.data.success){
          that.setData({
            times:res.data.data.times,
            timeLong: that.minToStr(res.data.data.timeLong)
          });
        }
      }
    })
  },
  //设置显示日历样式
  setDataStyle: function (month,year,days){
    var days_style = new Array,curDate = new Date(),curDays = 0,curMonth = curDate.getMonth()+1,curYear = curDate.getFullYear();
    curDays = new Date(year || curYear,month || curMonth,0).getDate();//当前月天数

    for (let i = 1; i <= curDays; i++) {
      // if(year && year>curYear){
      //   days_style.push({
      //     month: 'current', day: i, color: '#57C37D'
      //   });
      // } else if (month && month > curMonth){
      //   days_style.push({
      //     month: 'current', day: i, color: '#57C37D'
      //   });
      // }else if(i>curDate.getDate() && ((!month && !year) || month==curMonth)){
      //   days_style.push({
      //     month: 'current', day: i, color: '#57C37D'
      //   });
      // }
      if (days && days.length>0){
        for(let j=0;j<=days.length;j++){
            if(i==days[j]){
              if(j==0){
                days_style.push({
                  month: 'current', day: i, color: '#fff',background:'linear-gradient(90deg,rgba(122,221,94,1),rgba(79,202,124,1))'
                });
              }else{
                days_style.push({
                  month: 'current', day: i, color: '#57C37D'
                });
              }
              
            }
        }
      }
       
    }
    this.setData({
      days_style,
      day:days_style[0] || ""
    });
  },
  //日历日期点击
  dayClick:function(e){
    var that = this, days = this.data.days, index = days.indexOf(e.detail.day);
    if (index>=0 && e.detail.day!=this.data.day.day){
       var days_style = this.data.days_style;
       for(var i=0;i<days_style.length;i++){
         days_style[i] = { month: 'current', day: days_style[i].day, color: '#57C37D', background: 'none' };
       }
      days_style[index] = { month: 'current', day: days_style[index].day, color: '#fff', background: 'linear-gradient(90deg,rgba(122,221,94,1),rgba(79,202,124,1))'};
      this.setData({
        days_style,
        day: days_style[index]
      })
      

    }
    
  },
  //日历日期改变
  dateChange:function(e){
    this.getCountMonth(e.detail.currentMonth, e.detail.currentYear);
  }
})