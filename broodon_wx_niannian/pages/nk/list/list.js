// pages/bej48/list/list.js
import Utils from '../../../utils/util.js'
var WxParse = require('../../../wxParse/wxParse.js');

var app = getApp(), URL = app.globalData.URL;
var backgroundAudioManager = wx.createInnerAudioContext();
var innerAudioContext = wx.createInnerAudioContext();
var vTime = null;
var isBtnClick = false;

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
    yunMediaRoot: URL.yunMediaRoot,
    cardUuid: '',
    isOpen: false,
    isStatus: '',
    current: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    isPlaying: false,
    msgList:[],
    defaultPaper: ['https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-top.png', '', 'https://file.niannian99.com/niannianyun/wx/topic/letter/bg-write-bottom.png'],
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX,
    isPlaying: true,
    isMusic: false,
    paperUrl: {
      "paperThumb": "", "paperColore": "#F0EBE4", "paperId": 147, "paperName": "", "paperImage": ["", "", ""]
    },  
    isCommList:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
      wx.request({
        url: URL.getNkListInfo,
        data: { cardUuid: app.globalData.cardUuid, userId: app.globalData.userInfo.userId },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data && res.data.data && res.data.data.status) {
            if (res.data.data.status == "mySelf" || res.data.data.status == "show"){
                var msgList = res.data.data.nkTemplate && res.data.data.nkTemplate.length > 0 ? res.data.data.nkTemplate : [];
                if (res.data.data.status == "show"){
                  msgList = [];
                  msgList.push(res.data.data.message);
                }
                if(msgList.length>0){ 
                  for (var i = 0; i < msgList.length; i++) {
                    msgList[i]['subContent'] = msgList[i].content.replace(/\[img\](.*?)\[\/img\]/g, "").replace(/\[audio\](.*?)\[\/audio\]/g, "");
                    msgList[i] = that.changeData(msgList[i],i);
                  }
                }
                if (msgList[0] && msgList[0].musicUrl && msgList[0].musicUrl != "") {
                  msgList[0].isPlaying = true;
                  backgroundAudioManager.src = msgList[0].musicUrl.indexOf('http') > -1 ? msgList[0].musicUrl : URL.yunMediaRoot + msgList[0].musicUrl;
                  backgroundAudioManager.loop = true; 
                }

                if (msgList[0] && msgList[0].voice && msgList[0].voice!=""){
                  innerAudioContext.src = msgList[0].voice;
                }

                that.setData({
                  msgList: msgList,
                  isStatus: res.data.data.status,
                  tipMsg: (res.data.data.status && res.data.data.status == 'notSelf') ? res.data.data.tipMsg:'',
                  isCommList: res.data.data.messageReplyCount?res.data.data.messageReplyCount:0
                });
                if (msgList[0] && msgList[0].musicUrl && msgList[0].musicUrl != "") {
                  setTimeout(function(){
                    backgroundAudioManager.play();
                  },500);
                }
                
              }else{
                that.setData({
                  isStatus: res.data.data.status,
                  tipMsg: (res.data.data.status && res.data.data.status == 'notSelf') ? res.data.data.tipMsg : ''
                });
              }

          }
        },
        error: function (res) {
          console.log(res);
        }
      }); 
    
  },
  onUnload:function(){
    if (backgroundAudioManager){
      backgroundAudioManager.stop();
    }
    if (/\/pages\/nk\/index\/index/g.test(app.globalData.hisUrl)) {
      wx.navigateBack({
        delta: 2
      })
    }
  },
  onShow:function(){
    var that = this, msgCurData = that.data.msgList[that.data.current];
    if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
      setTimeout(function () {
        backgroundAudioManager.play();
        that.setData({
          ['msgList[' + that.data.current+'].isPlaying']: true
        })
      }, 1000)

    }
  },
  onJoin: function () {
    var that = this, msgCurData = that.data.msgList[that.data.current];
    if (isBtnClick == true) return false;
    isBtnClick = true;
    if (that.data.current==that.data.msgList.length){ 
      wx.navigateTo({
        url: "/pages/msg/index/index",
        success: function () {
          isBtnClick = false;
          if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl != "") {
            backgroundAudioManager.stop();
            that.setData({
              ['msgList[' + that.data.current + '].isPlaying']: false
            })
          }
        }
      })
    }else{ 
      wx.setStorage({
        key: 'editMsg',
        data: {
          letter: {
            title: msgCurData.title ? msgCurData.title : '',
            author: msgCurData.author ? msgCurData.author : '',
            content: (msgCurData.subContent && msgCurData.subContent != "") ? msgCurData.subContent:"",
            image: msgCurData.images && msgCurData.images.length > 0 ? msgCurData.images[0] : "",
          },
          musicId: msgCurData.musicId ? msgCurData.musicId:"",
          musicUrl: msgCurData.musicUrl ? { musicId: msgCurData.musicId, musicTitle: '', musicUrl: msgCurData.musicUrl } : { musicId: '', musicTitle: '', musicUrl:''},
          paperUrl: {
            paperId: msgCurData.paperId,
            paperColore: '',
            paperImage: msgCurData.paperUrl,
            paperName: '',
            paperThumb: '',
          },
          nkTempId: msgCurData.nkTempId
        },
        success: function () {

          wx.navigateTo({
            url: "/pages/msg/neweditor/neweditor",
            success: function () {
              isBtnClick = false;
              if (msgCurData && msgCurData.musicUrl && msgCurData.musicUrl!=""){
                backgroundAudioManager.stop();
                that.setData({
                  ['msgList[' + that.data.current+'].isPlaying']:false
                })
              }
              
            },
            fail: function () {
              isBtnClick = false;
            }
          })
        }
      })
    }
    
  },
  onSlideChangePaper: function (e) {
    var index = this.data.current, msgList = this.data.msgList, oldStr = 'msgList[' + index +']',newStr = '';
    if (e.detail.source == 'touch') {

      if (msgList[index] && msgList[index].musicUrl && msgList[index].musicUrl != "") {
        backgroundAudioManager.stop();
      }
      if (msgList[index] && msgList[index].voice && msgList[index].voice != "") {
        innerAudioContext.stop();
      }

      if (msgList[e.detail.current]){
        newStr = 'msgList[' + e.detail.current + ']'; 

        if (msgList[e.detail.current].musicUrl && msgList[e.detail.current].musicUrl != "") {
          backgroundAudioManager.src = msgList[e.detail.current].musicUrl;
          setTimeout(function () {
            backgroundAudioManager.play();
          }, 500)
        }

        if (msgList[e.detail.current].voice && msgList[e.detail.current].voice != "") {
          innerAudioContext.src = msgList[e.detail.current].voice;
        }

        if(index==msgList.length){
          this.setData({
            [newStr + '.isPlaying']: true,
            current: e.detail.current
          }) 
        }else{
          this.setData({
            [oldStr + '.isVoicePlaying']: false,
            [oldStr + '.isPlaying']: false,
            [newStr + '.isPlaying']: true,
            current: e.detail.current
          }) 
        }
        
      }else{
        this.setData({
          current: e.detail.current
        }) 
      }
      
    }
  },
  changeData:function(data,index){
    var that = this,_data = data; 
   _data.paperUrl = (_data.paperUrl && _data.paperUrl != "") ? _data.paperUrl.split(',') : that.data.defaultPaper;
    if(_data.content && _data.content!=""){
      _data.content = _data.content 
        .replace(/\[img\](.*?)\[\/img\]/g, function(k,v){ _data.images = [];
          _data.images.push(v);
          return '';})
        .replace(/\n/g, "<br/>")
        .replace(/  /g, "　")
        .replace(/\[audio\](.*?)\[\/audio\]/g, "");
      WxParse.wxParse('content' + index, 'html', _data.content, that);
      _data.content = that.data['content'+index];
    }
    if (_data.musicUrl && _data.musicUrl!=""){
        _data.isPlaying = false;
        _data.isVoicePlaying = false;
        if (!/^http/g.test(_data.musicUrl)){
          _data.musicUrl = URL.yunMediaRoot + _data.musicUrl;
        }
    }
    if (_data.voice && _data.voice!=""){
      _data.voiceCurrentTime = "00:00:00";
      _data.isVoicePlaying = false;
    }
    return _data;
  },
  playAudio: function () { 
    var that = this, index = that.data.current, msgList = this.data.msgList, str = 'msgList[' + index + ']';
    clearInterval(vTime)
    if (msgList[index].isVoicePlaying && msgList[index].isVoicePlaying == true) {
      that.audioPause();
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
      innerAudioContext.onEnded(function () {
        innerAudioContext.stop();
        setTimeout(function () { 
          that.setData({
            [str + '.isVoicePlaying']: false
          })
          clearInterval(vTime);
          if (msgList[index].isPlaying == true) {
            backgroundAudioManager.play();
          }
        }, 1000)
      })
      if (msgList[index].voice) {
        that.setVoiceTime();
      }
    } 
    this.setData({
      [str + '.isVoicePlaying']: !msgList[index].isVoicePlaying
    })
  },

  audioPause: function () {
    var that = this,index = that.data.current;
    innerAudioContext.onPause(function () {
      if (that.data.msgList[index].isPlaying == true) {
        backgroundAudioManager.play();
      }
    })
  },

  playBackgroundAudio: function () {
    var that = this, index = that.data.current, msgList = that.data.msgList, str = 'msgList['+index+']';
    clearInterval(vTime);
    innerAudioContext.pause();

    if (msgList[index].isPlaying == true) {
      backgroundAudioManager.stop();
    } else {
      backgroundAudioManager.play();
      innerAudioContext.pause();
    }

    this.setData({
      [str + '.isPlaying']: !msgList[index].isPlaying,
      [str + '.isVoicePlaying']: true
    })
    
  },

  setVoiceTime: function () {
    clearInterval(vTime);
    var that = this;
    that.countTime(Math.ceil(innerAudioContext.currentTime));
    vTime = setInterval(function () {
      that.setVoiceTime();
    }, 1000)
  },

  countTime: function (time) {
    var hour = 0, min = 0, sec = 0, index = this.data.current, msgList = this.data.msgList, str = 'msgList[' + index + ']';
    hour = Math.floor(time / 60 / 60);
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);
    hour = hour > 9 ? hour : '0' + hour;
    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec; 

    this.setData({
      [str +'.voiceCurrentTime']: hour + ':' + min + ':' + sec
    })
  }, 
  sendComm:function(e){
    var that = this, msgCurData = that.data.msgList[that.data.current];
    console.log(e);
    if (isBtnClick == true){
      setTimeout(function(){
        isBtnClick = false;
      },1500)
      return false;
    } 
    isBtnClick = true;
    
    wx.navigateTo({
      url: "/pages/nk/comment/comment?type=" + e.target.dataset.attr + "&msgId=" + msgCurData.msgId + "&targetUserId=" + msgCurData.sendUserId,
      success: function () {
        isBtnClick = false;
        if (msgCurData.musicUrl && msgCurData.musicUrl != "") {
          backgroundAudioManager.stop();
          that.setData({
            ['msgList[' + that.data.current + '].isPlaying']: false
          })
        }
      },
      fail: function () {
        isBtnClick = false;
      }
    })
  },
  imageLoading: function (e) {
    var that = this, index = e.target.id.split('_')[1];
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    if (originalWidth>750){
      this.setData({
        ['msgList[' + index + '].imgWidth']: originalWidth,
        ['msgList[' + index + '].imgHeight']: originalHeight
      })
    }else{
      this.setData({
        ['msgList[' + index + '].imgHeight']: originalHeight
      })
    }
    
  },
})