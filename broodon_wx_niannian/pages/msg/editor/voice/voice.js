var app = getApp();
import Util from '../../../../utils/util.js';
var varName = null;
var ctx = wx.createCanvasContext('canvasArcCir');
var recorderManager = wx.getRecorderManager();
var innerAudioContext = wx.createInnerAudioContext();
var tt = null;
var toBack = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    mainHeight: '',
    images: 'https://file.niannian99.com/niannianyun/wx/editor/audio_begin.png',
    isPlay: false, //是否播放
    playStatus: false, //true为正在播放,false为停止
    voiceImg: 'https://file.niannian99.com/niannianyun/wx/editor/audio_paush.png',
    clock: '',
    time: 0,
    tip: true,
    voiceData: {},
    status: '',
    screenWidth: app.globalData.sysInfo.screenWidth,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    innerAudioContext.destroy();
    innerAudioContext = wx.createInnerAudioContext();
    this.voiceListen();
    if (options.curIndex) {
      this.setData({
        'voiceData': {
          'index': options.curIndex,
          'type': 'voice',
          'tempFilePath': options.tempFilePath,
          'curTime': options.curTime,
          'curClock': options.curClock,
          'isShow': true,
          'voice': options.voice,
          'status': options.status
        },
        'status': options.status
      })
      if (options.tempFilePath || options.voice) {
        this.setData({
          isPlay: true,
          voiceImg: 'https://file.niannian99.com/niannianyun/wx/editor/audio_play.png',
          time: options.curTime,
          clock: options.curClock,
        })
      }
    } else {
      this.setData({
        'status': options.status
      })
    }
  },

  voiceListen: function() {
    recorderManager.onStop((res) => {
      var voices = this.data.voiceData;
      voices['tempFilePath'] = res.tempFilePath;
      voices['curTime'] = this.data.time;
      voices['curClock'] = this.data.clock;
      this.setData({
        voiceData: voices
      })
      console.log('停止录音', res.tempFilePath);
    })
  },

  change: function(e) {
    var isPlay = true;
    var playStatus = !this.data.playStatus;
    if (!this.data.voiceData.tempFilePath && !this.data.voiceData.voice) {
      clearTimeout(tt);
      if (playStatus) {
        this.startVoice();
        var voiceImg = 'https://file.niannian99.com/niannianyun/wx/editor/audio_paush.png';
      } else {
        this.stopVoice();
        var voiceImg = 'https://file.niannian99.com/niannianyun/wx/editor/audio_play.png';
      }
      this.setData({
        isPlay: true,
        playStatus: playStatus,
        voiceImg: voiceImg
      })
    }
    if (this.data.voiceData.tempFilePath || this.data.voiceData.voice) {
      clearTimeout(tt);
      if (playStatus) {
        var voiceImg = 'https://file.niannian99.com/niannianyun/wx/editor/audio_paush.png';
        this.timeDown(this);
        this.playVoice();
      } else {
        var voiceImg = 'https://file.niannian99.com/niannianyun/wx/editor/audio_play.png';
        innerAudioContext.pause();
      }
      this.setData({
        playStatus: playStatus,
        voiceImg: voiceImg
      })
    }

  },
  timeAdd: function(that) {
    that.setData({
      clock: this.dateformat(this.data.time),
    })
    console.log(that.data.time)
    if (that.data.time >= 300000) {
      that.stopVoice();
      that.setData({
        voiceImg: 'https://file.niannian99.com/niannianyun/wx/editor/audio_play.png',
        playStatus: false
      })
      return;
    }
    tt = setTimeout(function() {
      that.data.time += 1000;
      that.timeAdd(that);
    }, 1000) //毫秒的步长受限于系统的时间频率，于是我们精确到0.01s即10ms
  },

  timeDown: function(that) {
    var that = this;
    that.setData({
      clock: this.dateformat(that.data.time),
    })
    if (that.data.time <= 0) {
      innerAudioContext.stop();
      this.setData({
        playStatus: false,
        voiceImg: 'https://file.niannian99.com/niannianyun/wx/editor/audio_play.png',
        time: this.data.voiceData.curTime,
        clock: this.data.voiceData.curClock
      })
      return;
    }
    tt = setTimeout(function() {
      that.data.time -= 1000;
      that.timeDown(that);
    }, 1000)
  },

  dateformat: function(millisecond) {
    //总秒数
    var second = Math.round(millisecond / 1000);
    //秒
    var sec = Math.round(second % 60);
    sec = sec > 9 ? sec : '0' + sec;
    //分
    var min = Math.floor(second / 60);
    //时
    var hour = Math.floor(min / 60);
    return hour + "" + min + ":" + sec;
  },

  drawCircle: function() {
    var that = this;

    function drawArc(s, e) {
      var ratio = that.data.screenWidth / 375;
      var x = 53 * ratio;
      var y = 53 * ratio;
      var r = 51.5 * ratio;
      //ctx.setFillStyle("#7DD862");
      ctx.clearRect(0, 0, 106, 106);
      ctx.draw();
      ctx.setLineWidth(3);
      ctx.setStrokeStyle('#7DD862');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, r, s, e, false);
      ctx.stroke();
      ctx.draw();
    }
    var step = 1,
      startAngle = 1.5 * Math.PI,
      endAngle = 0;
    var animation_interval = 1000,
      n = 300;
    var animation = function() {
      if (step <= n) {
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
      } else {
        clearInterval(varName);
      }
    };
    varName = setInterval(animation, animation_interval);
  },

  //开始录音
  startVoice: function() {
    const options = {
      duration: 300000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    this.drawCircle();
    this.timeAdd(this);
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
  },

  //停止录音
  stopVoice: function() {
    clearInterval(varName);
    ctx.clearRect(0, 0, 106, 106);
    recorderManager.stop();
  },

  //播放录音
  playVoice: function() {
    innerAudioContext.autoplay = true;
    if (this.data.voiceData.tempFilePath) {
      innerAudioContext.src = this.data.voiceData.tempFilePath;
    } else {
      innerAudioContext.src = this.data.voiceData.voice;
    }
    innerAudioContext.play();
  },

  tips: function() {
    this.setData({
      tip: false
    })
    wx.setStorage({
      key: 'voiceTips',
      data: {
        tip: false
      },
    })
  },

  voiceInit: function() {
    var voices = this.data.voiceData;
    innerAudioContext.stop();
    voices['tempFilePath'] = null;
    voices['curClock'] = '';
    voices['curTime'] = 0;
    voices['voice'] = null;
    this.setData({
      isPlay: false,
      playStatus: false,
      voiceImg: 'https://file.niannian99.com/niannianyun/wx/editor/audio_paush.png',
      clock: '',
      time: 0,
      voiceData: voices,
    })
    clearTimeout(tt);
    clearInterval(varName);
    ctx.clearRect(0, 0, 106, 106);
  },

  restart: function() {
    if (this.data.voiceData.tempFilePath || this.data.voiceData.voice) {
      this.voiceInit();
    }
  },

  finish: function() {
    if (this.data.voiceData.tempFilePath || this.data.voiceData.voice) {
      if(toBack){
        return false;
      }
      toBack = true;
      this.goBack();
    }
  },

  goBack: function() {
    var fileName = 'niannianyun/wx/voice/' + new Date().getTime() + this.data.voiceData.tempFilePath.replace(/.*?(\.\w+)$/, "$1");
    if (this.data.voiceData.voice == null) {
      Util.uploadFun({
        fileName: fileName,
        url: this.data.voiceData.tempFilePath
      }, (res) => {
        var voices = this.data.voiceData;
        voices['voice'] = res.imageURL;
        voices['status'] = this.data.status;
        this.setData({
          voiceData: voices
        });
        this.onStorage();
      }, (res) => {
        console.log(res);
      });
    } else {
      this.onStorage();
    }
  },
  onStorage: function() {
    wx.setStorage({
      key: 'voiceData',
      data: this.data.voiceData,
      success: () => {
        innerAudioContext.pause();
        clearTimeout(tt);
        this.setData({
          playStatus: false
        })
        wx.navigateBack();
        toBack=false;
      }
    })
  },

  onShow: function(){
    var that = this;
    wx.getStorage({
      key: 'voiceTips',
      success: function(res) {
        console.log(res);
        that.setData({
          tip: res.data.tip
        })
      },
    })
  },

  onUnload: function() {
    this.voiceInit();
    innerAudioContext.destroy();
  },

  onHide: function() {
    clearTimeout(tt);
    if (varName) {
      this.stopVoice();
    } else if (this.data.voiceData.tempFilePath || this.data.voiceData.voice) {
      innerAudioContext.pause();
    }
    this.setData({
      voiceImg: 'https://file.niannian99.com/niannianyun/wx/editor/audio_play.png',
      playStatus: false,
    });
  }
})