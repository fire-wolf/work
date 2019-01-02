var WxParse = require('../../wxParse/wxParse.js');
import Utils from '../../utils/util.js';
var app = getApp(), URL = app.globalData.URL;
var vTime = null;
var isBtnClick = false;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    msgData: {
      type: Object,
      value: {}
    },

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    title: '',
    isVideoPlaying: false,
    isVoiceHidden: true,
    isPlaying: false,
    scrollViewHeight: '100%',
    yunMediaRoot: URL.yunMediaRoot,
    voiceTotalTime:'00:00:00',
    voiceCurrentTime: '00:00:00',
    paperUrl: [],
    msgInfo: null,
    backgroundAudioManager:null,
    innerAudioContext:null
  },

  ready: function() {
    this.init()
    
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */


  methods: {
    /*
     * 公有方法
     */

    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    init: function(){
      var that = this,msgData = this.properties.msgData;
      console.log(msgData)
      if(msgData){
        
          that.setData({
            msgInfo: this.properties.msgData,
            paperUrl: msgData.paperUrl.split(',')
          })
          if (msgData.voice) {
            this.setData({
              innerAudioContext: msgData.innerAudioContext ? msgData.innerAudioContext: wx.createInnerAudioContext(),
              ['innerAudioContext.src']: /^http/i.test(msgData.voice) ? msgData.voice : URL.yunMediaRoot + msgData.voice
            }) 
            that.data.innerAudioContext.play();
            that.data.innerAudioContext.stop();
            that.initAudio();
            that.countTime(Math.ceil(that.data.innerAudioContext.duration), 'total');
            var t2 = setInterval(() => {
              if (parseInt(that.data.innerAudioContext.duration) != 0) {
                clearInterval(t2)
                that.countTime(Math.ceil(that.data.innerAudioContext.duration), 'total');
                that.createHtml();
              }
            }, 300)
          } else {
            that.createHtml();
            
          }

          if (msgData.musicUrl) {
            this.setData({
              backgroundAudioManager: msgData.backgroundAudioManager ? msgData.backgroundAudioManager:wx.createInnerAudioContext(),
              ['backgroundAudioManager.src']: /^http/i.test(msgData.musicUrl) ? msgData.musicUrl : URL.yunMediaRoot + msgData.musicUrl
            })
             
            that.playBackgroundAudio();
            
          }
          
          
      }
    },
    onShow: function(){
      console.log(1111111)
    },
    
    createHtml: function(){
      var that = this;
      if (this.data.msgInfo){
        var data1 = this.data.msgInfo.content
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
        WxParse.wxParse('content', 'html', data1, this, 0);
      }
    },
    playBackgroundAudio: function () {
      var that = this;
      clearInterval(vTime);
      if (that.data.innerAudioContext) that.data.innerAudioContext.pause();
      if (that.data.isPlaying == true) {
        that.data.backgroundAudioManager.stop();
      } else {
        setTimeout(function () {
          that.data.backgroundAudioManager.play();
          if (that.data.innerAudioContext) that.data.innerAudioContext.pause();
        }, 500)

      }

      this.setData({
        isPlaying: !this.data.isPlaying,
        isVoicePlaying: false
      })

    },
    initAudio: function(){
      var that = this;
      that.data.innerAudioContext.onPlay(function () {
        if (that.data.backgroundAudioManager) that.data.backgroundAudioManager.stop();
      });
      that.data.innerAudioContext.onStop(function () {
        if (that.data.isPlaying == true) {
          if (that.data.backgroundAudioManager) that.data.backgroundAudioManager.play();
        }
      })
      that.data.innerAudioContext.onPause(function () {
        if (that.data.isPlaying == true) {
          if (that.data.backgroundAudioManager) that.data.backgroundAudioManager.play();
        }
      })

      that.data.innerAudioContext.onEnded(function () {
        setTimeout(function () {
          that.setData({
            isVoicePlaying: false
          })
          clearInterval(vTime);
          if (that.data.isPlaying == true) {
            if (that.data.backgroundAudioManager) that.data.backgroundAudioManager.play();
          }
        }, 1000)
      })
    },
    playVideo: function () {
      var that = this;
      if (that.data.backgroundAudioManager){
        that.data.backgroundAudioManager.stop();
      }
      
      wx.setStorage({
        key: 'videoInfo',
        data: {
          video: this.data.msgInfo.video,
          videoThumb: this.data.msgInfo.videoThumb,
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
        that.data.innerAudioContext.pause();
      } else {
        if (this.data.msgInfo.voice) {
          that.data.innerAudioContext.play();
          if (that.data.backgroundAudioManager) that.data.backgroundAudioManager.stop();
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
      that.data.innerAudioContext.pause();
      if (that.data.isPlaying == true && that.data.backgroundAudioManager) {
        that.data.backgroundAudioManager.play();
      }
    },
    setVoiceTime: function () {
      clearInterval(vTime);
      var that = this;
      vTime = setInterval(function () {
        if (that.data.innerAudioContext.duration - that.data.innerAudioContext.currentTime < 0.5) {
          that.countTime(0);
        } else {
          that.countTime(Math.ceil(that.data.innerAudioContext.duration - that.data.innerAudioContext.currentTime));
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
  }
})