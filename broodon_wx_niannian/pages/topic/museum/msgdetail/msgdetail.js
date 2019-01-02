var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp(), URL = app.globalData.URL;
var innerAudioContext = null, vTime = null,tt = null;

Page({
  data: {
    userId: '', //2562788
    isAuthor: true,
    isLogin: true,
    msgId: 153,
    msgDetail: {
      mMsgId: '',
      isLike: 0,
      labelNameArry: [],
      mMsgBg: '',
      msgAbstract: '',
      msgSource: '',
      msgAbstract: '',
      msgUrl: '',
      title: '',
      totalReply: '',
      video: '',
      voice: '',
    },
    isVoicePlaying: false,
    voiceCurrentTime: '00:00:00',
    voiceTotalTime: '00:00:00',
    voiceDuration: 0,
    video: '', //http://og0bztn1p.bkt.clouddn.com/niannianyun/niannianyun/banner/2018/7/20/13/39/22/1521196380_2.MP4
    videoThumb: '',
    isBtnClick: false,
    yunMediaRoot: URL.fileDomain
  },

  getUserAuthor: function () {
    var that = this;
    app.getSetting(function () {
      if (app.globalData.isAuthor){
        app.login(function(){
          that.setData({
            isAuthor: app.globalData.isAuthor,
            userId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : '',
          })
          that.getData();
        })
      }else{
        that.setData({
          isAuthor: app.globalData.isAuthor,
        })
        that.getData();
      }
    })
  },

  //登录后控制显示
  onLogin: function (e) {
    this.setData({
      isLogin: e.detail,
      userId: app.globalData.userInfo.userId
    })
  },

  getData: function(){
    
    wx.request({
      url: URL.getMuseumView,
      data: {
        msgId: this.data.msgId,
        userId: this.data.userId,
      },
      success: (res)=>{
        if (res && res.data && res.data.success && res.data.data){
          var data = res.data.data;
          this.setData({
            msgDetail: data
          })
          var msgOriginal = data.content ? data.content.replace(/  /g, "　") : '';
          var msgBg = data.mMsgBg ? data.mMsgBg.replace(/  /g, "　") : '';
          var contentTranslate = data.contentTranslate ? data.contentTranslate.replace(/  /g, "　") : '';
          WxParse.wxParse('msgOriginal', 'html', msgOriginal, this, 0);
          WxParse.wxParse('msgOriginal', 'html', msgOriginal, this, 0);
          WxParse.wxParse('msgBg', 'html', msgBg, this, 0);

          if (data.voice){
            this.createAudio(data);
          }
          if (data.video){
            this.createVideo(data);
          }
        }
        wx.hideLoading();
      },
      fail: (res)=>{
        wx.hideLoading(); 
      }
    })
  },

  onMsgLike: function(){
    clearTimeout(tt);
    var that = this;
    if (app.globalData.isLogin){
      if (this.data.isBtnClick){
        return false;
      }
      this.setData({
        isBtnClick: true
      })
      
      wx.request({
        url: URL.museumMsgLike,
        data: {
          userId: that.data.userId,
          msgId: that.data.msgId
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data && res.data.success) {
            var num = 0;
            if (res.data.msg == '点赞成功') {
              num = 1;
            }
            that.setData({
              isBtnClick: false,
              "msgDetail.isLike": num
            })
          }
        },
        fail: function (res) {
          console.log(res);
          that.setData({
            isBtnClick: false,
          })
        },
      })
    }else{
      this.setData({
        isLogin: false
      })
    }
    
  },

  playVideo: function(){
    clearInterval(vTime);
    innerAudioContext.pause();
    this.setData({
      isVoicePlaying: false
    })
    wx.setStorage({
      key: 'videoInfo',
      data: {
        video: this.data.video,
        videoThumb: this.data.videoThumb,
      },
      success: function () {
        wx.navigateTo({
          url: '/pages/msg/video/video',
        })
      }
    })
  },
  
  createVideo: function(data){
    wx.downloadFile({
      url: this.data.video + '?vframe/jpg/offset/2',
      success: (respone) => {
        this.setData({
          video: data.video,
          videoThumb: respone.tempFilePath
        })
      }
    })
  },

  createAudio: function(data){
    var that = this;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = data.voice;
    innerAudioContext.volume = 0;
    innerAudioContext.play();
    //https://file.niannian99.com/niannianyun/wx/voice/1537240877432.mp3
    var t2 = setInterval(() => {
      console.log(innerAudioContext.duration)
      if (parseInt(innerAudioContext.duration) != 0) {
        clearInterval(t2)
        innerAudioContext.stop();
        innerAudioContext.volume = 1;
        that.setData({
          voiceDuration: innerAudioContext.duration
        })
        that.countTime(Math.round(innerAudioContext.duration), 'total');
      }
    }, 300)

    innerAudioContext.onEnded(function(){
      innerAudioContext.seek({
        position: innerAudioContext.duration
      })

      setTimeout(function () {
        that.setData({
          isVoicePlaying: false,
          voiceCurrentTime: that.data.voiceTotalTime,
        })
        clearInterval(vTime);
      }, 1000)
    })
  },

  playAudio: function () {
    var that = this;
    clearInterval(vTime);
    if (this.data.isVoicePlaying == true) {
      innerAudioContext.pause();
    } else {
      if (this.data.msgDetail.voice) {
        setTimeout(function(){
          that.setVoiceTime();
        },450)
        innerAudioContext.play();
      }
    }

    this.setData({
      isVoicePlaying: !this.data.isVoicePlaying
    })
  },

  setVoiceTime: function () {
    var that = this;
    clearInterval(vTime);
    vTime = setInterval(function () {
      if (that.data.voiceDuration - innerAudioContext.currentTime < 0.2) {
        that.countTime(0);
      } else {
        that.countTime(Math.round(that.data.voiceDuration - innerAudioContext.currentTime));
      }
    }, 100)
  },

  countTime: function (time, total) {
    if (time < 0.2) {
      time = 0;
    }
    var hour = 0, min = 0, sec = 0;
    hour = Math.floor(time / 60 / 60);
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);
    hour = hour > 9 ? hour : '0' + hour;
    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;
    this.setData({
      voiceCurrentTime: hour + ':' + min + ':' + sec,
      voiceTotalTime: total ? hour + ':' + min + ':' + sec : this.data.voiceTotalTime
    })
  },

  bindscroll: function(){
    //console.log(11)
  },

  onReachBottom: function(){
    
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })
    if(options.msgId){
      this.setData({
        msgId: options.msgId
      })
    }
    this.getUserAuthor();
    
  },

})