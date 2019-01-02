
import Utils from '../../../utils/util.js';
import qiniuUploader from '../../../utils/qiniuUploader.js';
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
var videoContext = null;
var vTime = null;
//var backgroundAudioManager = wx.createInnerAudioContext();
var backgroundAudioManager = null;
var innerAudioContext = null;
var st = null;

// 初始化七牛相关参数
function initQiniu(obj) {
  var options = {
    region: 'ECN', // 华北区
    uptokenURL: 'https://app.niannian99.com/qiniu/getToken?fileName=' + obj.fileName,
    fileName: obj.fileName,
    // uptoken: 'xxxx',
    domain: 'https://file.niannian99.com/'
  };
  qiniuUploader.init(options);
}


Page({
  data: { 
    userId: '',
    msgId: '',
    nickName: '',
    userImage: '',
    unionId: '',
    isPlaying: false,
    isMusic: false,
    isSend: false,
    isMsgSend:false,
    isWriteBack: false, //是否回信
    isFamous: false, //是否给名家名企写信
    targetUserId: '',
    targetMsgId: '',
    nkTempId: '',
    cardUuid: '',
    letter: {
      title: '',
      content: '',
      author: '',
      msgImg: '',
      upLoadImg: '',
      createTime: ''
    },
    paperUrl: {
      "paperThumb": "", "paperColore": "#F0EBE4", "paperId": 147, "paperName": "", "paperImage": ["", "", ""]
    },
    musicUrl: {},
    isVoicePlaying: false,
    isVoiceHidden: true,
    voice: '',
    voiceTotalTime: '',
    voiceCurrentTime: '00:00:00',
    voiceDuration: 0,
    video: '',
    videoThumb: '',
    wxacodePath: '',
    isBtnClick: false,
    showModal: false,
    shareHidden: false,
    sharePyqHidden: true,
    canvasHidden: true,
    screenWidth: 375,
    mainHeight: '838rpx',
    scrollViewHeight: '100%',
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX,
    isParam:false, //场景浮层开关
    redPacket: 0,
    map: null,
    curTime: null,
    isRedPacketWin: 0,//红包弹层 
    smsCode: 60,
    smsCodeNum: '',
    redPacketInfo:''
  },
  
  onLoad: function (options) {
    var that = this;
    this.controlAudio();

    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    wx.hideShareMenu();
    if (options){
      this.setData({
        isSend: options.isSend && options.isSend!=""?true:false
      })
    }
    if (app.globalData.sysInfo.windowHeight > 673) {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 800) / 2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 130) + 'px',
      })
    } else {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 815) / 2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 60) + 'px',
      })
    }
    if (app.globalData.isLogin == true) {
      that.setData({
        userImage: app.globalData.userInfo.image,
        userId: app.globalData.userInfo.userId,
        unionId: app.globalData.userInfo.unionId,
        screenWidth: app.globalData.sysInfo.screenWidth
      })
    } else {
      that.setData({
        screenWidth: app.globalData.sysInfo.screenWidth,
        userId:847,
        openid:'o6eGk5EyO-xboZ9R4OOUMpS57ago'
      })
    }
   
    if (!app.globalData.wxUserInfo) {
      app.getUserInfo(function () {
        that.setCurrentData()
      });
    }else {
      that.setCurrentData()
    }

    wx.setNavigationBarTitle({
      title: '发送'
    })

  },

  setCurrentData: function() {
    var that = this;
    wx.getStorage({
      key: "msgPreview",
      success: function (respone) {
        //console.log(respone)
        if (respone.data.msgImg &&  
          /https:\/\/file.niannian99/g.test(respone.data.msgImg) == false &&
          /http:\/\/file.niannian99/g.test(respone.data.msgImg) == false 
        ) 
        {
          initQiniu({ fileName: 'niannianyun/wx/' + new Date().getTime() + respone.data.msgImg.replace(/.*?(\.\w+)$/, "$1") });
          // 交给七牛上传 
          qiniuUploader.upload(respone.data.msgImg, (res) => {
            that.typeData(respone);
            that.dealData(respone, res.imageURL);
          }, (error) => {
            that.setCurrentData();
            console.log(error);
          });
        }else{ 
          that.typeData(respone);
          that.dealData(respone, "");
        }
      }
    })

  },

  //创建背景音乐和语音
  controlAudio: function(){
    var that = this;
    if (backgroundAudioManager) backgroundAudioManager.destroy();
    if (innerAudioContext) innerAudioContext.destroy();
    backgroundAudioManager = wx.createInnerAudioContext();
    innerAudioContext = wx.createInnerAudioContext();
    backgroundAudioManager.loop = true;

    innerAudioContext.onPlay(function () {
      backgroundAudioManager.stop();
    });
    innerAudioContext.onStop(function () {
      if (that.data.isPlaying == true) {
        backgroundAudioManager.play();
      }
    })
    innerAudioContext.onPause(function () {
      if (that.data.isPlaying == true) {
        backgroundAudioManager.play();
      }
    })

    innerAudioContext.onEnded(function () {
      innerAudioContext.seek({
        position: 0
      })
      setTimeout(function () {
        that.setData({
          isVoicePlaying: false
        })
        clearInterval(vTime);
        if (that.data.isPlaying == true) {
          backgroundAudioManager.play();
        }
      }, 1000)
    })

    backgroundAudioManager.onEnded(function () {
      backgroundAudioManager.play();
    });
  },
  //场景信件处理
  typeData: function (respone){
    if (respone.data.redPacket && respone.data.redPacket != "") {
      this.setData({
        isParam: true,
        redPacket: respone.data.redPacket,
        scrollViewWidth: app.globalData.sysInfo.windowWidth - 16 + 'px'
      });
    }
    if (respone.data.map && respone.data.map != "") {
      this.setData({
        isParam: true,
        map: respone.data.map,
        scrollViewWidth: app.globalData.sysInfo.windowWidth - 16 + 'px'
      });
    }
    if (respone.data.curTime && respone.data.curTime != "") {
      this.setData({
        isParam: true,
        curTime: respone.data.curTime,
        scrollViewWidth: app.globalData.sysInfo.windowWidth - 16 + 'px'
      });
    }
  },
  //内容数据处理
  dealData: function (respone, upLoadImg){
    var that = this;
    that.setData({
      nickName: app.globalData.wxUserInfo.nickName,
      letter: {
        title: respone.data.title,
        content: respone.data.content.replace(/  /g, "　"),
        author: respone.data.author,
        msgImg: (upLoadImg && upLoadImg != "") ? upLoadImg : respone.data.msgImg,
        upLoadImg: (upLoadImg && upLoadImg != "") ? upLoadImg : respone.data.msgImg
      },
      musicUrl: respone.data.musicUrl,
      paperUrl: respone.data.paperUrl,
      isMusic: respone.data.isMusic,
      voice: respone.data.voice,
      voiceTotalTime: (respone.data.voiceTotalTime && respone.data.voiceTotalTime.split(':').length > 2) ? respone.data.voiceTotalTime:'00:' + respone.data.voiceTotalTime,
      video: respone.data.video,
      videoThumb: respone.data.videoThumb,
      nkTempId: (respone.data.nkTempId && respone.data.nkTempId != "") ? respone.data.nkTempId : "",
      cardUuid: (app.globalData.cardUuid && app.globalData.cardUuid != "") ? app.globalData.cardUuid : ""
    })

    that.createHtml(respone.data);

    if (respone.data.isMusic == true) {
      backgroundAudioManager.src = /^http/i.test(respone.data.musicUrl.musicUrl) ? respone.data.musicUrl.musicUrl : URL.yunMediaRoot + respone.data.musicUrl.musicUrl;
      that.playBackgroundAudio();
    }

    if (respone.data.voice) {
      innerAudioContext.src = /^http/i.test(respone.data.voice) ? respone.data.voice : URL.yunMediaRoot + respone.data.voice;
    } 

    wx.getStorage({
      key: 'writeBack', //从信函详情过来回信
      success: function (res) {
        wx.hideLoading();
        if (res.data && res.data.handleType == 1) {
          wx.hideLoading();
          that.setData({
            isWriteBack: true,
            isMsgSend: true,
            targetMsgId: res.data.targetMsgId,
            targetUserId: res.data.targetUserId
          })
        } 
        that.sendMsg();           
        
      },
      fail: function() {
        if (app.globalData.cardUuid) {
          wx.hideLoading();
        }else{
          wx.getStorage({  //从名家名企过来发信
            key: 'famousLetter',
            success: (res2) => {
              wx.hideLoading();
              that.setData({
                isFamous: true,
                isWriteBack: true,
                isMsgSend: true,
                targetUserId: res2.data.targetUserId
              })
            },
            fail: (res) => { 
                that.sendMsg(); 
            }
          })
        }
      }
    })
  },

  //转化html 模板数据
  createHtml: function (res) {
    console.log(res)
    var that = this;
    var data1 = res.content ? res.content : '';
    if (res.content && res.conntent != "") {
      if (/\[img\](.*?)\[\/img\]/.test(data1)) {
        that.setData({
          isWxMsg: false
        })
      }
      data1 = data1
        .replace(/    /g, "　")
        .replace(/\n?\[img\](.*?)\[\/img\]\n?/g, function (k, v) {
          if (/\,/gi.test(v)) {
            return '<img  src="' + v.split(',')[0] + '" /><div class="img-txt"><span class="line"></span><span class="txt">' + v.split(',')[1] + '</span><span class="line"></span></div>';
          } else {
            return '<img  src="' + v + '" />';
          }
        })
        //.replace(/\n?\[audio\](.*?)\[\/audio\]\n?/g, "")
        .replace(/\n?\[audio\](.*?)\[\/audio\]\n?/g, '<audio src="$1" audioCurTime="' + that.data.voiceTotalTime + '" isVoicePlaying="false" ></audio>')
        .replace(/\n?\[video\](.*?)\[\/video\]\n?/g, function (k, v) { return '<video style="background-image: url(' + v.split(',')[1] + ');" src="' + v + '"></video>'; })
        .replace(/\[smile\](.*?)\[\/smile\]/g, "")
        .replace(/\[button\](.*?)\[\/button\]/g, "")
        .replace(/<img src=(.*?) \/>/gi, function (a, b) {
          return '<img src=' + (URL.fileDomain + b) + ' />';
        }).replace(/\n/g, "<span class='sBr' style='display:block;height:15rpx;'></span>");

      WxParse.wxParse('content', 'html', data1, that, 0);
    }
  },

  //发送信函
  sendMsg: function () {
    var that = this, content = this.data.letter.content;          
    if (that.data.isBtnClick) return false;
    that.setData({
      isBtnClick: true
    })
    // if (that.data.letter.replyId && that.data.letter.upLoadImg!=""){
    //   content = '[img]' + that.data.letter.upLoadImg+'[/img]'+content;
    // }
    var param = {
      'paperId': this.data.paperUrl ? this.data.paperUrl.paperId : '',
      'musicId': this.data.isMusic ? this.data.musicUrl.musicId : '',
      'signature': this.data.letter.author,
      'content': content,
      'image': this.data.letter.upLoadImg,
      'salutation': this.data.letter.title,
      'userId': this.data.userId,
      'isQrCode': this.data.isParam ? 0 : 1,
      'nkTempId': this.data.nkTempId,
      'cardUuid': this.data.cardUuid,
      'voice': this.data.voice,
      'video': this.data.video,
      'videoThumb': this.data.videoThumb,
      'sendTime': this.data.curTime ? this.data.curTime.time : "",
      'redPacketAmount': this.data.redPacket || 0,
      'lat': this.data.map ? this.data.map.latitude : '',
      'lng': this.data.map ? this.data.map.longitude : '',
      'location': this.data.map ? this.data.map.address : ''
    }
    
    if (that.data.targetUserId) {
      param = Object.assign(param, { 'receiveUserId': this.data.targetUserId,'isQrCode':0 })
    } else {
      param = Object.assign(param, { 'targetMsgId': this.data.targetMsgId })
    }
    wx.request({
      url: URL.sendMsg,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: param,
      success: function (res) {
        wx.hideLoading();
        if (res.data && res.data.success) {
          that.setData({
            msgId: res.data.data,
            showModal: false,
            isBtnClick: false,
            isMsgSend: true,
          })
          that.onShareAppMessage();
          wx.showShareMenu();
          if (that.data.cardUuid){
            wx.showToast({
              title: '祝福卡内容已保存',
              icon: 'none',
              mask: true,
              duration: 2000
            })
            app.globalData.cardUuid = '';
            setTimeout(function(){
              wx.reLaunch({
                url: '/pages/find/find'
              })
            }, 2500)
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            isMsgSend: false,
            isBtnClick: false
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        that.setData({
          isMsgSend: false,
          isBtnClick: false
        })
      }
    })
  },

  //回信操作 发送信函
  replyMsg: function (callBack) {
    var that = this, content = this.data.letter.content;
    // if (that.data.letter.upLoadImg && that.data.letter.upLoadImg != "") {
    //   content = '[img]' + that.data.letter.upLoadImg + '[/img]' + content;
    // }
    var param = {
      'paperId': this.data.paperUrl ? this.data.paperUrl.paperId : '',
      'musicId': this.data.isMusic ? this.data.musicUrl.musicId : '',
      'signature': this.data.letter.author,
      'content': content,
      'image': this.data.letter.upLoadImg,
      'salutation': this.data.letter.title,
      'voice': this.data.voice,
      'video': this.data.video,
      'videoThumb': this.data.videoThumb,
      'userId': this.data.userId,//1784281
      'isQrCode': 0
    };
    if (that.data.targetUserId){
      param = Object.assign(param, { 'receiveUserId': this.data.targetUserId})
    }else{
      param = Object.assign(param, { 'targetMsgId': this.data.targetMsgId })
    }
    that.setData({
      isBtnClick: true
    })
    wx.request({
      url: this.data.isFamous ? URL.sendFamousMsg : URL.replyMsg,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: param,
      success: function (res) {
        if (res.data && res.data && res.data.success) {
          that.setData({
            msgId: res.data.data,
            isBtnClick: false
          })
          if (callBack){
            callBack();
          }else{
            wx.showToast({
              title: '发送成功',
              icon: 'none',
              duration: 2000
            })
            wx.removeStorage({
              key: 'writeBack',
              success: function (res) { },
            })
            wx.removeStorage({
              key: 'famousLetter',
              success: function (res) { },
            })
            var pages = getCurrentPages();
            var delta = 2,first = 0, second = 0;
            pages.forEach(function (currentValue, index){
              if (/famous\/letterlist\/letterlist/.test(currentValue.route)){
                delta = 3;
              }
              if (/msg\/msgdetail\/msgdetail/.test(currentValue.route)){ 
                first = 1; //念念平台荟专属信箱里信函详情
              }
            }) 
            setTimeout(function () {
              wx.navigateBack({
                delta: first == 1 ? 5 :delta
              })
            }, 2000)
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            isMsgSend:false
          })
        }
      },
      fail: function (res) {
        that.setData({
          isMsgSend: false
        })
      }
    })
  },

  //删除信函
  removeMsg: function() {
    var that = this;
    wx.request({
      url: URL.removeMsg,
      data: {
        userId: that.data.userId,
        msgId: that.data.msgId
      },
      success: function (res) {

      }
    })
  },

  //回信操作  
  onBackMsg: function(){
    var that = this;
    if (that.data.isBtnClick) return false;
    if (this.data.isWriteBack){
      if(that.data.msgId){
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
        wx.removeStorage({
          key: 'writeBack',
          success: function (res) { },
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 3
          })
        }, 2000)
      }else{
        this.replyMsg();
      }
    }
  },

  //念卡写信
  onSaveNk: function(){
    var that = this;
    this.setData({
      showModal: true
    })
  },

  //关闭提示框
  onCloseModal: function(){
    this.setData({
      showModal: false
    })
  },

  onHide: function () {
    backgroundAudioManager.volume = 0;
    innerAudioContext.volume = 0;
    if (/iOS/gi.test(app.globalData.sysInfo.system)) {
      innerAudioContext.stop();
      backgroundAudioManager.stop();
    } else {
      backgroundAudioManager.destroy();
      innerAudioContext.destroy();
    }
    clearInterval(vTime);
    wx.hideLoading();
  },

  onShow: function () {
    if (innerAudioContext) {
      innerAudioContext.volume = 1;
    }
    if (this.data.isPlaying == true && this.data.isMusic == true) {
      backgroundAudioManager.src = this.data.musicUrl.musicUrl;
      backgroundAudioManager.play();
      backgroundAudioManager.volume = 1;
    }
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    backgroundAudioManager.stop();
    // backgroundAudioManager.volume = 0;
    // innerAudioContext.volume = 0;
    backgroundAudioManager.destroy();
    innerAudioContext.destroy();
    clearInterval(vTime);

    if (this.data.isSend == false && this.data.isWriteBack == false && !this.data.cardUuid) {
      //做删除
      that.removeMsg();
    } else if (this.data.isRedpacketWin == 4 && !this.data.shareHidden){
      wx.setStorage({
        key: 'redPacketTips',
        data: '您的信函已生成，请到我的信函列表，发送该红包信函给好友！',
      }) 
      wx.navigateBack({
        delta: 3
      }) 
    }else{
      wx.getStorage({
        key: 'writeBack',
        success: function(res) {
          wx.removeStorage({
            key: 'writeBack',
            success: function(res) {},
          })
          if (res.data){
            if (res.data.handleType == 0) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.data.handleType == 1 && that.data.isSend){
              wx.navigateBack({
                delta: 2
              })
            } 
          }
        },
      })
    }
    wx.hideLoading();


  },

  //点击播放视频
  playVideo: function () {
    backgroundAudioManager.stop();
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

  //点击播放背景音乐
  playBackgroundAudio: function () {
    var that = this;
    clearInterval(vTime);
    innerAudioContext.pause();
    console.log(that.data.isPlaying)
    if (that.data.isPlaying == true) {
      backgroundAudioManager.stop();
    } else {
      setTimeout(function () {
        backgroundAudioManager.play();
        innerAudioContext.pause();
      }, 500)
    }

    this.setData({
      isPlaying: !this.data.isPlaying,
      isVoicePlaying: false
    })
  },

  //点击播放语音
  playAudio: function () {
    var that = this;
    clearInterval(vTime);
    if (this.data.isVoicePlaying == true) {
      innerAudioContext.pause();
    } else {
      if (this.data.voice) {
        innerAudioContext.play();
        backgroundAudioManager.stop();
        that.setVoiceTime();
      }
    }

    this.setData({
      isVoiceHidden: false,
      isVoicePlaying: !this.data.isVoicePlaying
    })
  },

  //点击关闭语音播放
  onHiddenVoice: function () {
    var that = this;
    this.setData({
      isVoiceHidden: true,
      isVoicePlaying: false,
    })
    innerAudioContext.pause();
    if (that.data.isPlaying == true) {
      backgroundAudioManager.play();
    }
  },

  //设置语音时间
  setVoiceTime: function () {
    clearInterval(vTime);
    var that = this;
    vTime = setInterval(function () {
      if (innerAudioContext.duration - innerAudioContext.currentTime < 0.5) {
        that.countTime(0);
      } else {
        that.countTime(Math.floor(innerAudioContext.duration - innerAudioContext.currentTime));
      }
      //that.setVoiceTime();
    }, 100)
  },

  //计算时间
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
      voiceCurrentTime: time == 0 ? this.data.voiceTotalTime : hour + ':' + min + ':' + sec,
      voiceTotalTime: total ? hour + ':' + min + ':' + sec : this.data.voiceTotalTime
    })
  },

  //点击生成分享图片
  bindHandleSave: function () {
    var that = this;
    if(that.data.isWriteBack){ //回信
      if(that.data.msgId){
        that.goCreateImage();
      }else{
        this.replyMsg(function () {
          that.goCreateImage();
        });
      }
    }else{  //普通写信
      if (!that.data.msgId) return false;
      that.setData({
        isSend: true
      })
      that.goCreateImage();
    }
  },
  //处理红包支付相关问题
  redPacketPay: function (e) {
    var that = this,
      type = e.target.dataset.type;
    switch (type) {
      case "close": 
        that.setData({
          isRedpacketWin: 0
        });        
        break;
      case "local": 
        if (isBtnClick) return false;
        isBtnClick = true; 
        that.sendSmsCode(function(){
          setTimeout(function(){
            isBtnClick = false;
          },2000)
          
        });
        break;
      case "local_smsCode":
        that.setData({
          smsCode: 60
        }) 
        if (isBtnClick) return false;
        isBtnClick = true; 
        that.sendSmsCode(function(){
          setTimeout(function () {
            isBtnClick = false;
          }, 2000)
        });
        break;
      case "local_pay":
        
        that.sendPay('local', function (res) {
          if (res.data.success) {
            // wx.navigateTo({
            //   url: "/pages/msg/preview/preview?isSend=ok",
            // })
            if (st) clearTimeout(st);
            that.setData({
              isRedpacketWin: 4,
              isSend: true 
            });
          } else {
             
            if (res.data.data && res.data.data.errorCode && res.data.data.errorCode=='1001'){
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000
              })
            }else{
              that.setData({
                isRedpacketWin: 3,
                redPacketInfo: res.data.msg
              });
            }
            
          }
        });
        break;
      case "wx":
        that.sendPay('wx', function (res) { 
          if(res.data.success){
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              success:function(_res){ 
                if (_res.errMsg=="requestPayment:ok"){
                  that.setData({
                    isRedpacketWin: 4, 
                    isSend: true 
                  });
                }
              },
              fail:function(error){
                 
              }
            });
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
          
        });
        break;
      case "1":
        that.setData({
          isRedpacketWin: 1,
          curMsgId: that.data.msgId
        })
        break;
      case "2":
        break;
    }
  },
  //微信支付操作
  sendPay: function (type, callback) {
    var model = '',
      desc = '',
      param, smsCode = '';
    if (type == 'wx') {
      desc = '小程序写信微信支付';
      model = 'W';
    } else {
      desc = '小程序写信余额支付';
      model = 'B';
      smsCode = this.data.smsCodeNum;
    }
    wx.request({
      url: URL.getWXPayInfo,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        chargeDesc: desc,
        chargeModel: model,
        smsCode: smsCode,
        chargeMoney: this.data.redPacket,
        msgId: this.data.curMsgId,
        userId: this.data.userId
      },
      success: function (res) {
        callback && callback(res);
      },
      fail: function (error) { }
    });
  },
  //发送短信验证码
  sendSmsCode: function (callback) {
    var that = this;
    if(st) clearTimeout(st);
    wx.request({
      url: URL.getMsgPayCode,
      data: {
        type: "sms_user_balance",
        userId: this.data.userId
      },
      success: function (res) {
        if(res.data.success){
          that.setData({
            isRedpacketWin: 2
          })
          that.payTimeOut();
        }else{
          wx.showToast({
            title:res.data.msg,
            icon: 'none',
            duration: 3000
          })
        }
        callback && callback(res);
        
      },
      fail:function(){
        callback && callback();
      }
    })
  },
  //短信验证码数据
  smsCodeBlur: function (e) {
    if (e.detail.value != "") {
      this.setData({
        smsCodeNum: e.detail.value
      });
    }
  },
  //验证码倒计时
  payTimeOut: function () {
    var that = this,
      tt = this.data.smsCode;
    if (tt > 0) {
      tt--;
      that.setData({
        smsCode: tt
      })
      st = setTimeout(function () {
        that.payTimeOut();
      }, 1000);
    } else {
      that.setData({
        smsCode: 0
      })
    }
  },
  //去创建图片
  goCreateImage: function() {
    var that = this;
    wx.setStorage({
      key: 'preview-create-img',
      data: {
        msgId: that.data.msgId,
        nickName: that.data.nickName
      },
      success: function () {
        wx.navigateTo({
          url: '/pages/msg/createimg/createimg',
        })
      }
    })
  },

  onShareAppMessage: function (res) {
    var that = this, param = '';
    if (that.data.letter && that.data.letter.content == ""){
      wx.showToast({
        title: '分享内容不能为空！',
        icon: 'none'
      })
      return false;
    }
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    } 

    if (res && res.from === 'button') { 
      
      that.setData({
        shareHidden: true,
        isSend: true
      });
      
      if (that.data.isWriteBack){
         
      }else{
        setTimeout(function () {
          wx.navigateBack({
            delta: 4
          })
        }, 3000)
      }
        
      
      
    }
    
    return {
      title: that.data.nickName + ' 用心为您写了一封信',
      path: '/pages/msg/msgdetail/msgdetail?msgId=' + that.data.msgId + param,
      imageUrl: URL.yunMediaRoot + 'niannianyun/wx/letter/letter_share.png'
    }
  },


});
 

 