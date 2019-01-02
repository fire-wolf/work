// 我的感悟详情
import Utils from '../../../utils/util.js'
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
var backgroundAudioManager = wx.createInnerAudioContext();
var innerAudioContext = wx.createInnerAudioContext();
var vTime = null;

backgroundAudioManager.onEnded(function () {
  //backgroundAudioManager.play();
});
innerAudioContext.onPlay(function () {
  backgroundAudioManager.pause();
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    msgId: '',
    nickName: '',
    isSendUser: false,
    appParameter: '123456',
    letter: {
      title: '',
      content: '',
      author: '',
      image: '',
      createTime: '',
    },
    musicUrl: '', //背景音乐
    paperUrl: '',
    defaultPaper: ['https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-top.png', '', 'https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-bottom.png'],
    contImages: [],
    msgConfig: {
      paperTop: 'https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-top.png',
      paperMidle: '',
      paperBottom: 'https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-bottom.png',
      backgroundColor: '#F7F6F2'
    },
    voice: '', //语音
    voiceCurrentTime:'00:00:00',
    video: '',
    videoThumb: '',
    isMusic: false,
    isPlaying: false,
    isVoicePlaying: false,
    windowHeight: 603,
    mainHeight: '100%',
    scrollViewHeight: '100%',
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (app.globalData.sysInfo.windowHeight > 673) {
      that.setData({
        msgId: options.msgId,
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 1170) / 2,
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 140) + 'px',
      })
    } else {
      that.setData({
        msgId: options.msgId,
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 1210) / 2,
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 70) + 'px',
      })
    }

    this.getMessage();

    app.login(function(){
      if (!app.globalData.wxUserInfo) {
        app.getUserInfo(function () {
          that.setUserInfo();
        });
      } else {
        that.setUserInfo();
      }
      if (app.globalData.isLogin){
        //保存信函到我收到的信箱
        that.saveMessage(); 
      }
    });
    
  },

  setUserInfo: function() {
    var that = this;
    that.setData({
      userId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : '',
      nickName: app.globalData.wxUserInfo.nickName
    })
    that.onShareAppMessage()
  },

  getMessage: function(){
    var that = this, _data = {};
    if (app.globalData.userInfo && app.globalData.userInfo.userId){
      _data = {
        msgId: that.data.msgId, //5612765,5612799
        userId: app.globalData.userInfo.userId
      }
    }else{
      _data = {
        msgId: that.data.msgId,
      }
    }
    wx.request({
      url: URL.getMsgInfo,
      data: _data,
      success: function (res) {
        if (res.data && res.data.success == true && res.data.data){
          that.createHtml(res.data.data)
        }
      },
      fail: function (res) {

      }
    })
  },

  createHtml: function (res) {
    var that = this;
    var data1 = res.content ? res.content : '';
    if (res.content && res.conntent != "") {
      data1 = data1
        .replace(/\[img\](.*?)\[\/img\]/g, '<img  src="$1"></img>')
        .replace(/\n/g, "<span class='sBr' style='display:block;height:30rpx;'></span>")
        .replace(/\[audio\](.*?)\[\/audio\]/g, "")
        .replace(/\[video\](.*?)\[\/video\]/g, "")
        .replace(/\[smile\](.*?)\[\/smile\]/g, "")
        .replace(/\[button\](.*?)\[\/button\]/g, "")
        .replace(/<img src=(.*?) \/>/gi, function (a, b) {
          return '<img src=' + (URL.fileDomain + b) + ' />';
        });
      WxParse.wxParse('content', 'html', data1, that, 0);
    }

    that.setData({ 
      msgConfig: Utils.msgConfig(res.type ? res.type : 'msg', app.globalData.msgObj.msgConfig),
      isSendUser: that.data.userId == res.sendUserId,
      letter: {
        author: res.author,
        content: data1,
        title: res.title,
        image: res.image ? res.image.split(',')[0] : '',
        createTime: Utils.formatTime4(new Date(res.createTime)),
      },
      musicUrl: res.musicUrl ? (res.musicUrl.indexOf('http') > -1 ? res.musicUrl : URL.yunMediaRoot + res.musicUrl) : '',
      paperUrl: res.paperUrl ? res.paperUrl.split(',') : that.data.defaultPaper,
      isMusic: res.musicUrl ? true : false,
      voice: res.voice,
      video: res.video,
      videoThumb: res.videoThumb
    });
    if (res.musicUrl) {
      backgroundAudioManager.src = res.musicUrl.indexOf('http') > -1 ? res.musicUrl : URL.yunMediaRoot + res.musicUrl;
      backgroundAudioManager.loop = true;
      that.playBackgroundAudio();
    }

    if (res.voice) { 
      innerAudioContext.src = res.voice.indexOf('http') > -1 ? res.voice : URL.yunMediaRoot + res.voice;
      setTimeout(()=>{
        that.countTime(innerAudioContext.duration);
      },1000)
      
    }
  },

  saveMessage: function(){

  },

  playAudio: function () {
    console.log(innerAudioContext.duration)
    var that = this;
    clearInterval(vTime)
    if (this.data.isVoicePlaying == true) {
      that.audioPause();
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
      innerAudioContext.onEnded(function () {
        innerAudioContext.stop();
        setTimeout(function(){
          that.setData({
            isVoicePlaying: false
          })
          clearInterval(vTime);
          if (that.data.isPlaying == true) {
            backgroundAudioManager.play();
          }
        },1000)
      })
      if(this.data.voice){
        that.setVoiceTime();
      }
    }

    this.setData({
      isVoicePlaying: !this.data.isVoicePlaying
    })
  },

  audioPause: function(){
    var that = this;
    innerAudioContext.onPause(function () {
      if(that.data.isPlaying == true){
        backgroundAudioManager.play();
      }
    })
  },

  playBackgroundAudio: function () {
    var that = this;
    clearInterval(vTime);
    innerAudioContext.pause();

    if (this.data.isPlaying == true) {
      backgroundAudioManager.stop();
    } else {
      backgroundAudioManager.play();
      innerAudioContext.pause();
    }
    this.setData({
      isPlaying: !this.data.isPlaying,
      isVoicePlaying: false
    })

  },

  setVoiceTime: function(){
    clearInterval(vTime);
    var that = this;
    that.countTime(Math.ceil(innerAudioContext.currentTime));
    vTime = setInterval(function () {
      that.setVoiceTime();
    }, 1000)
  },

  countTime: function(time){
    var hour = 0, min = 0, sec = 0;
    hour = Math.floor(time / 60 / 60);
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);
    hour = hour > 9 ? hour : '0' + hour;
    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;
    this.setData({
      voiceCurrentTime: hour + ':' + min + ':' + sec
    })
  },

  onPlayVideo: function(){ //播放视频
    wx.setStorage({
      key: 'videoInfo',
      data: {
        video: this.data.video,
        videoThumb: this.data.videoThumb
      },
      success: function(){
        wx.navigateTo({
          url: '/pages/msg/video/video',
        })
      }
    })
  },

  goEdit: function () {
    var that = this;
    //if (this.data.isSendUser == true) return false;
    if (isBtnClick == true) return false;
    isBtnClick = true;

    app.login(function () {
      if (app.globalData.isLogin) {
        app.globalData.hisUrl = "";
        wx.setStorage({
          key: 'writeBack',
          data: {
            handleType: 1,
            url: "/pages/msg/appdetail/appdetail?msgId=" + that.data.msgId
          },
        })
        wx.navigateTo({
          url: "/pages/msg/index/index",
          success: function () { 
            isBtnClick = false;
          },
          fail: function () {
            isBtnClick = false;
          }
        })
      } else {
        app.globalData.cacheUrl = "/pages/msg/index/index";
        app.globalData.hisUrl = "/pages/msg/appdetail/appdetail?msgId=" + that.data.msgId;
        wx.navigateTo({
          url: '/pages/login/login',
          success: function () {
            isBtnClick = false;
         },
          fail: function () {
            isBtnClick = false;
          }
        })
      }
    })
  },

  launchAppError: function(e){
    console.log(e.detail.errMsg) //
    wx.showToast({
      title: '唤起App失败',
      icon: 'none'
    })
  },

  onHide: function () {
    innerAudioContext.stop();
  },

  onUnload: function(){
    innerAudioContext.stop();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var shareInfo = {}
    if (this.data.msgId == 'systemMsg'){
      shareInfo = {
        title: '念念',
        path: '/pages/find/find',
        imageUrl: '',
        complete: function (res) {

        }
      }
    }else{
      shareInfo = {
        title: this.data.nickName + ' 用心为您写了一封信',
        path: '/pages/msg/msgdetail/msgdetail?msgId=' + this.data.msgId,
        imageUrl: URL.yunMediaRoot + 'niannianyun/wx/letter/share-letter.png',
        complete: function (res) {

        }
      }
    }

    return shareInfo;
  }
})