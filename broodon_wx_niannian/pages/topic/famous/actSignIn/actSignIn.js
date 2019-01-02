var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var Utils = require('../../../../utils/util.js')
var app = getApp(), URL = app.globalData.URL;
var tt,tt2,tt3;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '', 
    actId: '',
    actDetail: null,
    distanceType:0,//0为未到地址签到时间，1到地址签到时间，2未到地址签出时间，3到地址签出时间，4签到完且签出
    curTime:new Date().getTime(),
    signInTime:new Date().getTime(),
    signOutTime: new Date().getTime(),
    checkInAddress:'',
    checkOutAddress:'',
    yunMediaRoot: URL.yunMediaRoot,
    isShowWin:false,
    winObj:{},
    signDistance:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this; 
    wx.getStorage({
      key: 'actDetail',
      success: function (res) {
        that.setData({
          actDetail: res.data,
          userTel: app.globalData.userInfo.userTel || '',
          userName: app.globalData.userInfo.nickName || '',
          userId: app.globalData.userInfo.userId || '',
          checkInAddress: res.data.checkInAddress || '',
          checkOutAddress: res.data.checkOutAddress || '',
          signInTime: res.data.checkInTime || '',
          signOutTime: res.data.checkOutTime || '',
          distanceType: res.data.businessStatus == 15 || res.data.businessStatus == 13 ? 4 : (res.data.checkInTime && res.data.checkInTime>0?2:0),
          distanceTime: (res.data.checkInTime && res.data.checkOutTime && res.data.checkOutTime - res.data.checkInTime > 0) ? that.minToStr(res.data.checkOutTime - res.data.checkInTime):'',
          distanceTimeHeight: app.globalData.sysInfo.windowHeight-483,
          signDistance: res.data.signDistance && res.data.signDistance > 0 ? Math.ceil(res.data.signDistance/1000):1
        }); 
        if (res.data.businessStatus == 12 || res.data.businessStatus==14){
          if (res.data.businessStatus == 12){
            that.signInAddr(1);
            tt2 = setInterval(function(){
              that.signInAddr(1);
            },5000);
          } else if (res.data.businessStatus==14){
            that.setData({
              distanceType:2
            })
            that.signInAddr(3);
            tt2 = setInterval(function () {
              that.signInAddr(3);
            }, 5000);
          }
          that.beginTime();
        } 
      },
    })
    if (options && options.type =='signout'){
      wx.setNavigationBarTitle({
        title: "签出"
      });
    } else if (options && options.type =='signin'){
      wx.setNavigationBarTitle({
        title: "签到"
      });
    }
   
  },
  onUnload:function(){
    clearInterval(tt);
    clearInterval(tt2);
    clearTimeout(tt3);
  },
  //开始计时
  beginTime:function(){
    var that = this;
    tt = setInterval(function () {
      that.setData({
        curTime: new Date().getTime()
      });
    }, 1000)
  },
  //判断是否到达签到位置
  signInAddr:function(num){
    var that = this;
    wx.getLocation({
      success: function (res) {
        var distance = Utils.getDistance(res.latitude, res.longitude, that.data.actDetail.latitude, that.data.actDetail.langitude);
        // console.log('distance:'+distance);
        if (parseFloat(distance) <= that.data.signDistance) {
          if (tt2)  clearInterval(tt2);
          that.setData({
            distanceType: num
          })
        }
      },
      fail: function (error) {
        console.log(error);
        if (error.errMsg =='getLocation:fail 1'){
          wx.showToast({
            title: '请开启微信定位功能!',
            icon:'none',
            duration:3000
          })
        }
         
      }
    })
  },
  //去签到|签出
  goSign:function(e){
    var that = this,type = e.target.dataset.type;
    
    var qqmapsdk = new QQMapWX({
      key: 'HXQBZ-PXFC6-E7TSB-MSRLQ-5GOP5-77BZ4' // 必填
    }); 
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        if (tt) clearInterval(tt);
        if (tt2) clearInterval(tt2);
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude           
          }, 
          success: function (addressRes) {
            if(addressRes.status==0){
              var address = addressRes.result.formatted_addresses.recommend;
              if(type=="signIn"){ 
                that.sendSign({ type: type,url: URL.goActSignIn,address:address},function(data){
                  if(data.data.success){  
                        that.setData({
                          isShowWin: true,
                          winObj: {
                            iconImg: that.data.yunMediaRoot + 'niannianyun/wx/act/icon_signIn.png',
                            title: '签到成功',
                            desc: new Date().getTime(),
                            type: type
                          },
                          checkInAddress: address,
                          signInTime: that.data.curTime,
                        });
                        tt3 = setTimeout(function(){
                          that.closeWin();
                        },5000) 
                  } else {
                    wx.showToast({
                      title: data.data.msg,
                      icon: 'none',
                      duration: 3000,
                      mask: true
                    });
                  }
                    
                })
                 
                
              }else if(type=='signOut'){
                that.sendSign({ type:type,url: URL.goActSignOut, address: address }, function (data) {
                  if(data.data.success){
                    that.setData({
                      isShowWin: true,
                      winObj: {
                        iconImg: that.data.yunMediaRoot + 'niannianyun/wx/act/icon_signOut.png',
                        title: '签出成功',
                        desc: new Date().getTime(),
                        type: type
                      },
                      checkOutAddress: address,
                      signOutTime:that.data.curTime,
                      distanceTime: that.data.signInTime && that.data.signInTime>0?that.minToStr(that.data.curTime-that.data.signInTime):''
                    });

                    tt3 = setTimeout(function () {
                      that.closeWin();
                    }, 5000) 
                  }else{
                    wx.showToast({
                      title: data.data.msg,
                      icon: 'none',
                      duration: 3000,
                      mask: true
                    });
                  }
                    
                });
              } 
            }
          },
          fail:function(error){
            wx.showToast({
              title: error.message,
              icon:'none',
              duration:2000
            })
          }
        })
      },
      fail:function(error){
        wx.showToast({
          title: error.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }) 

  },
  closeWin:function(){
    var that = this,item = that.data.winObj;
    if(tt3) clearTimeout(tt3);
    if(item.type=='signIn'){
      that.setData({
        distanceType: 2
      })
      that.signInAddr(3);
      tt2 = setInterval(function () {
        that.signInAddr(3);
      }, 5000);
      that.beginTime();
    } else if (item.type=='signOut'){
      that.setData({
        distanceType: 4
      })
    }
    that.setData({
      isShowWin: false,
      winObj: {}
    });
  },
  //签到|签出请求处理
  sendSign:function(options,callback){
    var that = this;
      wx.request({
          url: options.url,
          data:{
            activitiesId: that.data.actDetail.activitiesId,
            userId:that.data.userId,
            address:options.address
          },
          success:function(res){ 
            callback && callback(res);
          },fail:function(error){
            wx.showToast({
              title: error.msg || (type =='signIn'?'签到失败':'签出失败'),
              icon: 'none',
              duration: 3000,
              mask: true
            });
          }

        })
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
  
  //查看地图位置
  checkAddr:function(){
    var that = this;
    wx.openLocation({
      latitude: that.data.actDetail.latitude,
      longitude: that.data.actDetail.langitude,
      address:that.data.actDetail.address
    })
  },
  minToStr: function (num) {
    var str = '';
    num = Math.floor(num/1000);
    if (num > 0) {
      if (num >= 60*60) {
        str += Math.floor(num /60/ 60) + '小时'
        num = num - Math.floor(num / 60 / 60) * 60 * 60;
      }

      if (num > 60) {
        str += Math.ceil(num / 60) + '分钟';
        num = num - Math.floor(num / 60) * 60;
      }else{
        str += '1分钟';
      }

      // if(num>0){
      //   str += Math.floor(num) + '秒';
      // }

    }
    return str;
  }
})