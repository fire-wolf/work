// pages/bej48/list/list.js
import Utils from '../../../utils/util.js'
var WxParse = require('../../../wxParse/wxParse.js');

var app = getApp(), URL = app.globalData.URL;

var isBtnClick = false; 

var vTime = null,backgroundAudioManager = null,  innerAudioContext = null;
 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yunMediaRoot: URL.yunMediaRoot,
    cardUuid:'',
    isOpen:true,
    isStatus:'',
    nkBannerImg:'',
    scrollHeight:'100%',
    bannerImgWidth:'',
    bannerImgHeight:'',
    msgList:[],
    isBtnClick:false,
    isCommList: 0,
    msgCurData:null,
    title: '',
    isVideoPlaying: false,
    isVoiceHidden: true,
    isPlaying: false,
    mainHeight: '100%',
    scrollViewHeight: '100%',
    voiceTotalTime: '00:00:00',
    voiceCurrentTime: '00:00:00',
    paperUrl: [],
    isHiddenPost: true,
    isAuthor: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var that = this,url, cardUuid;
    if (options.cardUuid){
      cardUuid = options.cardUuid; 
    }else if(options.q){
      url = decodeURIComponent(options.q), cardUuid = url.replace(/^http(.*?)\?cardUuid=(\w+)/i, "$2")
    }
    if (cardUuid){
      this.setData({
        cardUuid: cardUuid
      });
      app.globalData.cardUuid = cardUuid;
    } 
    this.getUserAuthor();
  },
  getUserAuthor: function () {
    var that = this;
    app.getSetting(function () {
      that.setData({
        isAuthor: app.globalData.isAuthor,
      })
      if (app.globalData.isAuthor) {
        app.login(function () { })
      }
    })
  },
  onUnload:function(){
    var that = this, msgCurData = that.data.msgCurData;
    if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
      backgroundAudioManager.destroy();
    }
  },
  onHide: function(){
    var that = this, msgCurData = that.data.msgCurData;
    if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
      backgroundAudioManager.destroy();
    }
  },
  onShow:function(){
    var that = this, msgCurData = that.data.msgCurData;
    if (backgroundAudioManager) {
      backgroundAudioManager.destroy();
      backgroundAudioManager = null
    }
    // if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
    //   setTimeout(function(){
    //     backgroundAudioManager.volume = 1;
    //     backgroundAudioManager.play();
    //     that.setData({
    //       isPlaying: true
    //     })
    //   },1000)
    // }
    wx.getStorage({
      key: 'nk-comment-success',
      success: function(res) {
        if(res.data){
          wx.showToast({ title: '评论成功！', icon: "none" });
          wx.removeStorage({
            key: 'nk-comment-success',
            success: function(res) {},
          })
        }
      },
    })
    
    that.getMsgData();
    
  },
  onReady: function () {
    // if (app.globalData.isAuthor){
    //   setTimeout(() => {
    //     app.login(function () { })
    //   }, 1500)
    // }
  },
  onJoin:function(){
    var that = this;
    if (isBtnClick){
      setTimeout(function () {
        isBtnClick = false
      }, 1000);
      return false;
    }
    isBtnClick = true
    app.login(function (data) { 
      app.globalData.cacheUrl = "/pages/nk/list/list";
      if (app.globalData.isLogin) { 
        app.globalData.hisUrl = "";
        wx.navigateTo({
          url: "/pages/nk/list/list",
          success: function () {
            // if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
            //   backgroundAudioManager.stop();
            // }
            setTimeout(function () { 
              isBtnClick = false
            }, 1000);
          }
        })
      } else { 
        app.globalData.hisUrl = "/pages/nk/index/index?cardUuid=" + that.data.cardUuid;
        wx.navigateTo({
          url: "/pages/login/login",
          success: function () {
            setTimeout(function () {
                isBtnClick = false
                
            }, 1000);
          }
        })
      }
    });
     
  },

  getMsgData:function(){
    var that = this, cardUuid = app.globalData.cardUuid ? app.globalData.cardUuid:that.data.cardUuid;
    console.log(cardUuid)
    if (!cardUuid) return false;
    
    wx.request({
      url: URL.getNkInfo,
      data: { cardUuid: cardUuid },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var msgCurData = null;
        if (res.data && res.data.data && res.data.data.status) {
          // if (res.data.data.status && res.data.data.status == 'show') {
          if (res.data.data.message) {
            msgCurData = that.changeData(res.data.data.message, 0);
            if (app.globalData.sysInfo.windowHeight > 673) {
              that.setData({
                mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 1170) / 2,
                scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 140) + 'px',
              })
            } else {
              that.setData({
                mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 1210) / 2,
                scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 70) + 'px',
              })
            }
          }

          //app.login(function () {
            that.setData({
              isStatus: res.data.data.status,
              isOpen: (res.data.data.status && res.data.data.status == 'show') ? true : false,
              isHiddenPost: (res.data.data.status && res.data.data.status == 'notUsed') ? false : true,
              msgCurData: msgCurData,
              paperUrl: msgCurData ? msgCurData.paperUrl : [],
              isPlaying: (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") ? true : false,
              isCommList: (res.data.data.messageReplyCount && res.data.data.messageReplyCount > 0) ? res.data.data.messageReplyCount : 0,
              nkBannerImg: (res.data.data.image && res.data.data.image != "") ? res.data.data.image : "https://file.niannian99.com/niannianyun/wx/nk/d_img0.png"
            });
         // })
          // msgCurData = res.data.data.message ? res.data.data.message : null; niannianyun/wx/nk/nk_envelope.png
          

          if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
            if (backgroundAudioManager){
              backgroundAudioManager.destroy();
            }
            backgroundAudioManager = wx.createInnerAudioContext();
            backgroundAudioManager.src = msgCurData.musicUrl.indexOf('http') > -1 ? msgCurData.musicUrl : URL.yunMediaRoot + msgCurData.musicUrl;
            backgroundAudioManager.loop = true;
            setTimeout(function () {
              backgroundAudioManager.play();
            }, 200)
          }
          if (msgCurData && msgCurData.voice && msgCurData.voice != "") {
            if (innerAudioContext) {
              innerAudioContext.destroy();
            }
            innerAudioContext = wx.createInnerAudioContext();
            innerAudioContext.src = /^http/i.test(msgCurData.voice) ? msgCurData.voice : URL.yunMediaRoot + msgCurData.voice
            innerAudioContext.play();
            innerAudioContext.stop();
            that.initAudio();
            that.countTime(Math.ceil(innerAudioContext.duration), 'total');
            var t2 = setInterval(() => {
              if (parseInt(innerAudioContext.duration) != 0) {
                clearInterval(t2)
                that.countTime(Math.ceil(innerAudioContext.duration), 'total');
                that.createHtml(msgCurData, 0);
              }
            }, 300)
          } else {
            that.createHtml(msgCurData, 0);
          }
        }
      },
      error: function (res) {
        console.log(res);
      }
    });
  },
  imageLoad:function(e){
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    this.setData({
      bannerImgWidth: originalWidth,
      bannerImgHeight: originalHeight
    })
  },
  changeData: function (data, index) {
    var that = this, _data = data;
    _data.paperUrl = (_data.paperUrl && _data.paperUrl != "") ? _data.paperUrl.split(',') : that.data.defaultPaper;
    
    if (typeof (_data.createTime) =='number'){
      _data.createTime = Utils.formatTime4(new Date(_data.createTime));
    }

    return _data;
  }, 
  createHtml: function (data, index) {
    var that = this, _data = data;
    if (_data && _data.content && _data.content != "") {
      _data.content = _data.content
        .replace(/   /g, "　")
        .replace(/  /g, "　")
        .replace(/\n?\[img\](.*?)\[\/img\]\n?/g, function (k, v) {
          if (/\,/gi.test(v)) {
            return '<img  src="' + v.split(',')[0] + '" /><div class="img-txt"><span class="line"></span><span class="txt">' + v.split(',')[1] + '</span><span class="line"></span></div>';
          } else {
            return '<img  src="' + v + '" />';
          }
        })
        .replace(/\n?\[audio\](.*?)\[\/audio\]\n?/g, '<audio src="$1" audioCurTime="' + that.data.voiceTotalTime + '" isVoicePlaying="false" ></audio>')
        .replace(/\n?\[video\](.*?)\[\/video\]\n?/g, function (k, v) { return '<video style="background-image: url(' + v.split(',')[1] + ');" src="' + v + '"></video>'; })
        .replace(/\[smile\](.*?)\[\/smile\]/g, "")
        .replace(/\[button\](.*?)\[\/button\]/g, "")
        .replace(/<img src=(.*?) \/>/gi, function (a, b) {
          return '<img src=' + (URL.fileDomain + b) + ' />';
        }).replace(/\n/g, "<br/>");

      WxParse.wxParse('content', 'html', _data.content, that);
    }
    
  },
  sendComm:function(e){
    var that = this, msgCurData = that.data.msgCurData;
    if (isBtnClick == true) {
      setTimeout(function () {
        isBtnClick = false;
      }, 1500)
      return false;
    }
    isBtnClick = true;
    var hisUrl = "/pages/nk/comment/comment?msgId=" + msgCurData.msgId + "&targetUserId=" + msgCurData.sendUserId;
    if (e.target.dataset.attr=='editor'){
      hisUrl = "/pages/nk/comeditor/comeditor?msgId=" + msgCurData.msgId + "&targetUserId=" + msgCurData.sendUserId;
    }
    app.globalData.cacheUrl = hisUrl;
    wx.navigateTo({
      url: hisUrl,
      success: function () {
        if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
          backgroundAudioManager.stop();

        }
        setTimeout(function () {
          isBtnClick = false;
        }, 1000);
      }
    })
    
  },
  playBackgroundAudio: function () {
    var that = this;
    clearInterval(vTime);
    if (innerAudioContext) innerAudioContext.pause();
    if (that.data.isPlaying == true) {
      backgroundAudioManager.stop();
    } else {
      setTimeout(function () {
        backgroundAudioManager.play();
        if (innerAudioContext) innerAudioContext.pause();
      }, 500)

    }

    this.setData({
      isPlaying: !this.data.isPlaying,
      isVoicePlaying: false
    })

  },
  initAudio: function () {
    var that = this;
    innerAudioContext.onPlay(function () {
      if (backgroundAudioManager) backgroundAudioManager.stop();
    });
    innerAudioContext.onStop(function () {
      if (that.data.isPlaying == true) {
        if (backgroundAudioManager) backgroundAudioManager.play();
      }
    })
    innerAudioContext.onPause(function () {
      if (that.data.isPlaying == true) {
        if (backgroundAudioManager) backgroundAudioManager.play();
      }
    })

    innerAudioContext.onEnded(function () {
      setTimeout(function () {
        that.setData({
          isVoicePlaying: false
        })
        clearInterval(vTime);
        if (that.data.isPlaying == true) {
          if (backgroundAudioManager) backgroundAudioManager.play();
        }
      }, 1000)
    })
  },
  playVideo: function () {
    var that = this;
    if (backgroundAudioManager) {
      backgroundAudioManager.stop();
    }

    wx.setStorage({
      key: 'videoInfo',
      data: {
        video: this.data.msgCurData.video,
        videoThumb: this.data.msgCurData.videoThumb,
      },
      success: function () {
        wx.navigateTo({
          url: '/pages/msg/video/video',
        })
      }
    })
  },
  playAudio: function () {

    var that = this;
    clearInterval(vTime);
    if (this.data.isVoicePlaying == true) {
      innerAudioContext.pause();
    } else {
      if (this.data.msgCurData.voice) {
        innerAudioContext.play();
        if (backgroundAudioManager) backgroundAudioManager.stop();
        that.setVoiceTime();
      }
    }

    this.setData({
      isVoiceHidden: false,
      isVoicePlaying: !this.data.isVoicePlaying
    })
  },
  onHiddenVoice: function () {
    var that = this;
    this.setData({
      isVoiceHidden: true,
      isVoicePlaying: false,
    })
    innerAudioContext.pause();
    if (that.data.isPlaying == true && backgroundAudioManager) {
      backgroundAudioManager.play();
    }
  },
  setVoiceTime: function () {
    clearInterval(vTime);
    var that = this;
    vTime = setInterval(function () {
      if (innerAudioContext.duration - innerAudioContext.currentTime < 0.5) {
        that.countTime(0);
      } else {
        that.countTime(Math.ceil(innerAudioContext.duration - innerAudioContext.currentTime));
      }
    }, 200)
  },

  countTime: function (time, total) {
    if (time < 0.5) {
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
  onClosePost: function(){
    var that = this;
    if (isBtnClick) return false;
    isBtnClick = true;
    app.login(function (data) {
      if (app.globalData.isLogin) {
        app.globalData.hisUrl = "";
        isBtnClick = false;
        that.setData({
          isHiddenPost: true
        })
      } else { 
        app.globalData.cacheUrl = "/pages/nk/index/index?cardUuid=" + that.data.cardUuid;
        app.globalData.hisUrl = "/pages/nk/index/notUsed";
        wx.navigateTo({
          url: "/pages/login/login",
          success: function () {
            setTimeout(function () {
              isBtnClick = false;
            }, 1000);
          }
        })
        
      }
    })
    
  }
})