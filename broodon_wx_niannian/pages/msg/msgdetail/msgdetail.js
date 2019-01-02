// 我的感悟详情
import Utils from '../../../utils/util.js'
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;

var videoContext = null;
var vTime = null,tt =  null;
var backgroundAudioManager = null;
var innerAudioContext = null;
// var backgroundAudioManager = wx.createInnerAudioContext();
// var innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    msgId: '',
    isFamous: false, //是否名家名企信函
    companyId: '',
    params2: '',
    nickName: '',
    isSendUser: true,
    sendUserId: '',
    receiveUserId: '',
    appParameter: '',
    letter: {
      title: '',
      content: '',
      author: '',
      image: '',
      createTime: '',
    },
    isWxMsg: true,
    isPaiXin: false,
    musicId: '',
    musicUrl: '',
    fontColor: '#3B3635',
    fontSize: 28,
    paperId: '',
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
    voiceCurrentTime: '00:00:00',
    voiceTotalTime: '',
    voiceDuration: 0,
    video: '',
    videoThumb: '',
    isVideoPlaying: false,
    isVoicePlaying: false,
    isVoiceHidden: true,
    isMusic: false,
    isPlaying: false,
    parseData: '',
    windowHeight: 603,
    mainHeight: '100%',
    scrollViewHeight: '800',
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX,
    paiXinUrls: [], //拍信图片链接
    isSensitive: false, //是否包含敏感词
    isAuthor: true,
    isLogin:false,

    isParam: false,
    redPacketBox: null,
    map: null,
    curTime: null,
    status:0,//信函状态显示
    msgDistance:null,
    isOpenBtn:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    that.createAudio();
    // console.log(' msg  Options:'+options.msgId);
    if (app.globalData.sysInfo.windowHeight > 673) {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 1170) / 2,
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 130),
      })
    } else {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 1210) / 2,
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 80),
      })
    }

    //分享者信息
    app.setInviteInfo(options); 
    
    if (options.msgId){
      this.setData({
        msgId: options.msgId,
        isFamous: options.famous ? true : false,
      })
      if (options.msgId == 'systemMsg') {
        wx.request({
          url: URL.getSystemMsg,
          success: function (res) {
            //console.log(res)
            if (res.data.success == true && res.data.data && res.data.data.content) {
              that.setData({
                msgId: "systemMsg",
                contImages: res.data.data.content.split(","),
              })
              that.onShareAppMessage()
            }
          }
        })
      } else { 
        that.getMessage();  
      }
    } else if (options.q){  //app分享二维码识别
      
      var url = decodeURIComponent(options.q), params2 = url.replace(/^http(.*?)\?params2=(\w+)/i, "$2")
      //console.log(params2)
      this.setData({
        params2: params2
      })
      wx.request({
        url: URL.getMsgDecrypt,
        data: {
          params2: params2
        },
        success: (res)=>{
          that.dealMsgInfo(res);
        },
        fail: (res) => {
          wx.showToast({ title: res.data.msg || '系统错误', icon: 'none' });
        },
      })
    }

    that.getUserAuthor();
  },
  //授权|登录处理
  typeMsgBox:function(){
    var that = this;
    if(that.data.isLogin && (that.data.map || that.data.curTime)){
        that.getMessage();
      }
      if (that.data.isLogin && that.data.redPacketBox) {
        if ((that.data.receiveUserId == that.data.userId || that.data.userId == that.data.sendUserId) && that.data.redPacketBox.redPacketStatus == 1) {
          that.setData({
            ['redPacketBox.imgUrl']: that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_r_l.png',
          });
        } else if (that.data.userId == that.data.sendUserId && that.data.redPacketBox.redPacketStatus == 0){
          that.setData({
            ['redPacketBox.imgUrl']: that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_m_redpacket.png'
          });
        } if (that.data.userId == that.data.sendUserId && that.data.redPacketBox.redPacketStatus == 2) {
          that.setData({
            ['redPacketBox.imgUrl']: that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_r_tui2.png'
          });
        } 
        that.setData({
          isParam: true,
          ['redPacketBox.isLogin']: true,
          ['redPacketBox.isReceive']: that.data.receiveUserId == that.data.userId ? true : false,
          ['redPacketBox.isSendUser']: that.data.userId == that.data.sendUserId ? true : false
        });
      } else if (that.data.isAuthor && that.data.redPacketBox){
        that.setData({
          isParam: true, 
          ['redPacketBox.isReceive']:true,
          ['redPacketBox.imgUrl']: that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_r_o.png',
          ['redPacketBox.isLogin']: false
        });
      }

      that.setData({
        isOpenBtn: true
      });
  },
  //获取用户授权
  getUserAuthor: function () {
    var that = this;
    wx.hideShareMenu(); 
    app.getSetting(function () {
      that.setData({
        isAuthor: app.globalData.isAuthor,
      })
      if (app.globalData.isAuthor) {
        app.login(function () {
          if (!app.globalData.wxUserInfo) {
            app.getUserInfo(function () {
              that.setUserInfo(function(){
                that.typeMsgBox();
              });
            });
          } else {
            that.setUserInfo(function(){
              that.typeMsgBox();
            });
          }
        })
      }else{
        that.typeMsgBox();
      }
    })
  },
  setUserInfo: function (callback2) {
    var that = this;
    that.setData({
      userId: app.globalData.userInfo.userId ? app.globalData.userInfo.userId : '',
      nickName: app.globalData.wxUserInfo.nickName,
      isLogin: app.globalData.isLogin
    })
    that.onShareAppMessage();
    wx.showShareMenu();
    callback2 && callback2();
  },
  createAudio: function(callback){
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
        position: innerAudioContext.duration
      })

      setTimeout(function () {
        that.setData({
          isVoicePlaying: false,
        })
        clearInterval(vTime);
        if (that.data.isPlaying == true) {
          backgroundAudioManager.play();
        }
      }, 1000)
    })
    callback && callback();
  }, 
  //获取信函内容
  getMessage: function () {
    var that = this, _data = {};
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      _data = {
        msgId: that.data.msgId,
        letterId: that.data.msgId,
        userId: app.globalData.userInfo.userId
      }
    } else {
      _data = {
        msgId: that.data.msgId,
      }
    }
    if (that.data.map && that.data.map.latitude>0){
      _data = Object.assign(_data,{
        lat: that.data.map.latitude,
        lng: that.data.map.longitude
      });
    }
    // _data = {
    //   letterId: that.data.msgId,
    //   userId: 1784316
    // }
    wx.request({
      url: this.data.isFamous ? URL.getFamousMsgInfo : URL.getMsgInfo,
      data: _data,
      success: function (res) {
        if(!res.data.success){
          if (res.data.data && res.data.data.errorCode && (res.data.data.errorCode == '0001' || res.data.data.errorCode == '0000')){ 
            if(that.data.isLogin){
              that.setData({
                status: 4
              });
            } else{
              that.setData({
                status: 3
              });
            }
                         
          } else if (res.data.data && res.data.data.lat && res.data.data.lat>0){
            that.setData({
              status: 1,
              map:{
                latitude: res.data.data.lat,
                longitude: res.data.data.lng,
                address: res.data.data.location
              }
              
            })
            if (that.data.userId) {
              wx.showToast({ title: res.data.msg || '系统错误', icon: 'none' });
            }
          } else if (res.data.data && res.data.data.sendTime && res.data.data.sendTime > 0 && !that.data.isFamous){
            that.setData({
              status: 2,
              curTime:{
                time:res.data.data.sendTime,
                countdown: res.data.data.countdown
              }
            })
            that.sendTimeFun();
            if (that.data.userId) {
              wx.showToast({ title: res.data.msg || '系统错误', icon: 'none' });
            }
          }

          
          
          
        }else{
          that.setData({
            status:0
          })
          that.dealMsgInfo(res);
        }
        
      },
      fail: function (res) {        
        wx.showToast({ title: res.data.msg || '系统错误', icon: 'none' });
      }
    })
  }, 
  //时间处理
  sendTimeFun:function(){
    var that = this,  distanceTime = that.data.curTime.countdown;
    if (tt) clearInterval(tt);
    if(distanceTime>0){
     
      if(distanceTime>24*60*60){
        var day = Math.floor(distanceTime / 24 / 60 / 60);
        if(day>1){
          this.setData({
            ['curTime.day']: day > 9 ? day : '0' + day
          })
          distanceTime = distanceTime - day * 24 * 60 * 60;
        }
        
      }
      if (distanceTime>60*60){
        var hour = Math.floor(distanceTime / 60 / 60);
        if(hour>1){
          this.setData({
            ['curTime.hour']: hour > 9 ? hour : '0' + hour
          })
          distanceTime = distanceTime - hour * 60 * 60;
        }
        
      }
      if(distanceTime>60){
        var minth = Math.floor(distanceTime / 60);
        if(minth>1){
          this.setData({
            ['curTime.minth']: minth > 9 ? minth : '0' + minth
          })
          distanceTime = distanceTime - minth * 60;
        }
        
      }
      if (distanceTime >= 0){
        var sec = Math.floor(distanceTime);
        if (tt) clearInterval(tt);
        tt = setInterval(function () { 
          sec--;
          if (sec<=0){
            clearInterval(tt);
            that.getMessage();
            // if(minth>0){
            //   //that.sendTimeFun(time);
            // }
          }
          that.setData({
            ['curTime.second']: sec > 9 ? sec : '0' + sec
          })          
        }, 1000)
      }
      
    }else{
      this.setData({
        ['curTime.second']:0
      })
    }

  },
  //打开定点定位信函
  openMsg:function(e){
    var that = this, type = e.currentTarget.dataset.type;
    if(that.data.isLogin){
      that.toTypeMsg(type);
    }else{
      app.phoneLogin(e, function () {
        that.toTypeMsg(type);
      })
    }
    
    
  },
  //打开红包信函处理
  openRedPacket:function(e){
    var that = this;
    if (that.data.redPacketBox.redPacketStatus==0){
      app.phoneLogin(e, function (callback){
        that.setData({
          ['redPacketBox.isLogin']:true
        })
        wx.request({
          url: URL.getRedPacketBox,
          data: {
            userId: app.globalData.userInfo.userId || '',
            msgId: that.data.msgId
          },
          success: function (res) {
            if (res.data.success) {
              that.setData({
                ['redPacketBox.redPacketStatus']: 1,
                ['redPacketBox.isReceive']:true,
                ['redPacketBox.openRedPacketTime']: Utils.formatTime4(new Date(res.data.data.getRedPacketTime)),
                ['redPacketBox.imgUrl']: that.data.yunMediaRoot +'niannianyun/wx/act/msg/icon_r_l.png'
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              });
            }
            callback && callback();
          },
          fail: function () {
            callback && callback();
          }
        })
      }) 
      
    }
    
  },
  //处理定点定位信函数据
  toTypeMsg:function(type){
    var that = this;
    if(type=='write'){
      wx.redirectTo({
        url: '/pages/msg/begin/begin',
      })
    }else if (type =="addr"){
      wx.getLocation({
        success: function (res) {
          that.distanceFun(res);
           
        },
        fail:function(){
          app.goMapAuthorize(function () {
            wx.getLocation({
              success: function (res) {
                that.distanceFun(res);
              }
            }); 
          });
        }
      })
    }else if(type=='time'){ 
      if (that.data.curTime.countdown>0){
        wx.showToast({
          title: '还没到达指定时间噢，请耐心等待信函的到来吧~',
          icon: 'none'
        });
      }else{
        that.getMessage();
      }
    }else if(type=='open'){
      that.getMessage();
    }
  },
  //信函距离处理
  distanceFun:function(res){
    var that = this;
    var distance = Utils.getDistance(res.latitude, res.longitude, that.data.map.latitude, that.data.map.longitude);
    if (distance <= 1) { 
      //已经到达地点可以拆信了
      that.setData({
        status: 0,
        map:{
          latitude: res.latitude,
          longitude: res.longitude
        }
      });
      that.getMessage();
    } else {
      if (that.data.msgDistance && parseFloat(that.data.msgDistance) > 1) {
        wx.showToast({
          title: '还没到达指定地点噢，请您多走几步再来拆信吧~',
          icon: 'none'
        })
      }
      that.setData({
        msgDistance: parseFloat(distance).toFixed(2)
      });
    }
  },
  //信函数据处理操作
  dealMsgInfo: function(res){
    var that = this;
    if (res.data && res.data.success == true && res.data.data) {
      var content = res.data.data.content
        .replace(/\[img\](.*?)\[\/img\]/g, '')
        .replace(/\[audio\](.*?)\[\/audio\]/g, '')
        .replace(/\[video\](.*?)\[\/video\]/g, '')
        .replace(/\[button\](.*?)\[\/button\]/g, '')
        .replace(/\[smile\](.*?)\[\/smile\]/g, '')
        .replace(/<img src=(.*?) \/>/gi, '');

      var paper = [];
      if (res.data.data.paperUrl) {
        var paper = res.data.data.paperUrl.split(',');
      }
      paper.map(function (item, index) {
        if (!/http/gi.test(item)) {
          paper[index] = that.data.yunMediaRoot + item;
        }
      })

      that.setData({
        parseData: res.data.data,
        msgConfig: Utils.msgConfig(res.data.data.type ? res.data.data.type : 'msg', app.globalData.msgObj.msgConfig),
        msgId: res.data.data.msgId ? res.data.data.msgId : res.data.data.letterId,
        isPaiXin: res.data.data.msgType == 3 ? true : false,
        paiXinUrls: res.data.data.msgType == 3 && res.data.data.image ? res.data.data.image.split(',') : [],
        letter: {
          author: res.data.data.author,
          content: content,
          title: res.data.data.title,
          image: res.data.data.image ? res.data.data.image.split(',')[0].replace(/http:\/\/file.niannian99.com/, 'https://file.niannian99.com') : '',
          createTime: Utils.formatTime4(new Date(res.data.data.createTime)),
        },
        musicId: res.data.data.musicId,
        musicUrl: res.data.data.musicUrl && /^http/gi.test(res.data.data.musicUrl) ? res.data.data.musicUrl : URL.yunMediaRoot + res.data.data.musicUrl,
        paperId: res.data.data.paperId,
        paperUrl: paper.length ? paper : that.data.defaultPaper,
        isMusic: res.data.data.musicUrl ? true : false,
        voice: /^http/i.test(res.data.data.voice) ? res.data.data.voice : URL.yunMediaRoot + res.data.data.voice,
        video: res.data.data.video,
        videoThumb: res.data.data.videoThumb,
        sendUserId: res.data.data.sendUserId,
        receiveUserId: res.data.data.receiveUserId,
        companyId: that.data.isFamous ? res.data.data.companyId : '',
        isSendUser: that.data.userId == res.data.data.sendUserId,
        isSensitive: res.data.data.isSensitive ? res.data.data.isSensitive : false
      })

      if (res.data.data.video) {
        //videoContext = wx.createVideoContext('myVideo', this);
      }

      if (res.data.data.redPacketAmount && res.data.data.redPacketAmount>0){
        var imgUrl = that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_r_o.png'; 
        if (res.data.data.redPacketStatus == 0 && (that.data.userId && that.data.userId == res.data.data.sendUserId)){
            imgUrl = that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_m_redpacket.png';
          } else if (res.data.data.redPacketStatus == 1 && that.data.userId && (that.data.userId == that.data.sendUserId || that.data.userId==res.data.data.receiveUserId)){
            imgUrl = that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_r_l.png';
          } else if (res.data.data.redPacketStatus == 2 && that.data.userId && that.data.userId == res.data.data.sendUserId){
            imgUrl = that.data.yunMediaRoot + 'niannianyun/wx/act/msg/icon_r_t.png';
          } 
        that.setData({ 
          isParam: true,
          redPacketBox:{
            redPacket: res.data.data.redPacketAmount,
            redPacketStatus: res.data.data.redPacketStatus,
            imgUrl:imgUrl,
            sendUserNicename: res.data.data.sendUserNicename,
            sendUserImage: Utils.qnUrl(res.data.data.sendUserImage), 
            backRedPacketTime: res.data.data.backRedPacketTime && res.data.data.backRedPacketTime>0?Utils.formatTime4(new Date(res.data.data.backRedPacketTime)):'',
            openRedPacketTime: res.data.data.getRedPacketTime && res.data.data.getRedPacketTime>0? Utils.formatTime4(new Date(res.data.data.getRedPacketTime)):'',
            isLogin: app.globalData.userInfo && app.globalData.userInfo.userId ? true:false,
            isSendUser:that.data.userId && that.data.userId==res.data.data.sendUserId?true:false,
            isReceive: that.data.userId && that.data.userId == res.data.data.receiveUserId ? true : false
          }
        })

      }else if (res.data.data.location && res.data.data.location!=""){
        that.setData({
          isParam: true,         
          map: {  
            address: res.data.data.location
          }
        })
      } else if (res.data.data.sendTime && res.data.data.sendTime != res.data.data.createTime && !that.data.isFamous){
        var dd = new Date(res.data.data.sendTime);
        that.setData({
          isParam: true, 
          curTime: {
            time: res.data.data.sendTime,
            timeStr: Utils.formatTime2(dd)
            
          }
        })
      }
      if (res.data.data.receiveUserId && app.globalData.userInfo.userId == res.data.data.receiveUserId && res.data.data.sendUserId!=res.data.data.receiveUserId){
        that.setData({
          isReceive: true
        })
      }
      if (res.data.data.voice) {
        innerAudioContext.src = /^http/i.test(res.data.data.voice) ? res.data.data.voice : URL.yunMediaRoot + res.data.data.voice;
        innerAudioContext.play();
        innerAudioContext.stop();
        that.countTime(Math.round(innerAudioContext.duration), 'total');
        var t2 = setInterval(() => {
          if (parseInt(innerAudioContext.duration) != 0) {
            clearInterval(t2)
            that.setData({
              voiceDuration: innerAudioContext.duration
            })
            that.countTime(Math.round(innerAudioContext.duration), 'total');
            that.createHtml(res.data.data);
          }
        }, 300)
      } else {

      }

      if (res.data.data.musicUrl) {
        backgroundAudioManager.src = /^http/i.test(res.data.data.musicUrl) ? res.data.data.musicUrl : URL.yunMediaRoot + res.data.data.musicUrl;
        that.playBackgroundAudio();
      }

      that.createHtml(res.data.data);

    }else{
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    }
  },

  /**
   * createHtml 信函content
   *
   * @param {Object} res 整个信函数据
   */
  createHtml: function (res) {
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

  onHide: function () {

    this.setData({
      isVoiceHidden: true,
      isVoicePlaying: true
    })
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
  },

  onShow: function () {
    var that = this;
    that.createAudio(function(){
      innerAudioContext.src = that.data.voice;
      backgroundAudioManager.src = that.data.musicUrl;
      backgroundAudioManager.volume = 1;
      if (that.data.isPlaying) {
        backgroundAudioManager.play();
      }
    });
    // if (innerAudioContext){
    //   innerAudioContext.volume = 1;
    // }
    
    // if (this.data.isPlaying) {
    //   backgroundAudioManager.src = this.data.musicUrl;
    //   backgroundAudioManager.volume = 1;
    //   backgroundAudioManager.play();
    // }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //backgroundAudioManager.stop();
    //innerAudioContext.stop();
    // backgroundAudioManager.volume = 0;
    // innerAudioContext.volume = 0;
    backgroundAudioManager.destroy();
    innerAudioContext.destroy();
    wx.hideToast();
    clearInterval(vTime);
    clearInterval(tt);
    wx.hideToast();
    wx.removeStorage({
      key: 'editMsg',
      success: function (res) { },
    })
  },

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
    // this.setData({
    //   isVideoPlaying: true
    // })
    // videoContext.play();
  },

  pauseVideo: function () {
    this.setData({
      isVideoPlaying: false
    })
    videoContext.pause();
  },

  playAudio: function () {

    var that = this;
    clearInterval(vTime);
    if (this.data.isVoicePlaying == true) {
      //that.audioPause();
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

  audioPause: function () {
    var that = this;
    // innerAudioContext.onStop(function () {
    //   if (that.data.isPlaying == true) {
    //     backgroundAudioManager.play();
    //   }
    // })
  },

  onHiddenVoice: function () {
    var that = this;
    this.setData({
      isVoiceHidden: true,
      isVoicePlaying: false,
      //voiceCurrentTime: this.data.voiceTotalTime
    })
    innerAudioContext.pause();
    if (that.data.isPlaying == true) {
      backgroundAudioManager.play();
    }
    //this.audioPause();
  },

  playBackgroundAudio: function () {
    var that = this;
    clearInterval(vTime);
    innerAudioContext.pause();
    // backgroundAudioManager.onCanplay(function(){

    // })
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

  setVoiceTime: function () {
    clearInterval(vTime);
    var that = this;
    vTime = setInterval(function () {
      if (innerAudioContext.duration - innerAudioContext.currentTime < 0.2){
        that.countTime(0);
      }else{
        that.countTime(Math.round(innerAudioContext.duration - innerAudioContext.currentTime));
      }
      //that.setVoiceTime();
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


  goEdit: function () {
    var that = this;
    //if (this.data.isSendUser == true);
    if (isBtnClick == true) return false;
    isBtnClick = true;
    if (this.data.isSendUser == true) { //再次编辑  名家名企不需要再次编辑
      if (this.data.isFamous == true){
        isBtnClick = false;
        return false;
      }
      wx.removeStorage({
        key: 'msgImg',
        success: function (res) { },
      })
      
      wx.setStorage({
        key: 'writeBack',
        data: {
          handleType: 1,
          targetMsgId: that.data.msgId,
          targetUserId: '',
          url: "/pages/msg/msgdetail/msgdetail?msgId=" + that.data.msgId
        },
      })
      var paramData = {
        parseData: that.data.parseData,
        voiceTotalTime: that.data.voiceTotalTime,
        voiceDuration: that.data.voiceDuration,
        letter: that.data.letter,
        musicId: that.data.musicId,
        musicUrl: { musicId: that.data.musicId, musicTitle: '', musicUrl: that.data.musicUrl },
        paperUrl: {
          paperId: that.data.paperId,
          paperColore: '',
          paperImage: that.data.paperUrl,
          paperName: '',
          paperThumb: '',
        }
      }

      console.log(paramData);
      wx.setStorage({
        key: 'editMsg',
        data: paramData,
        success: function () {

          wx.navigateTo({
            url: "/pages/msg/editor/editor",
            success: function () {
              isBtnClick = false;
            },
            fail: function () {
              isBtnClick = false;
            }
          })
        },
        fail: function(){
          isBtnClick = false;
        }
      })
      return false;
    } else { //回信
      app.login(function () {
        if (app.globalData.isLogin) {
          app.globalData.hisUrl = "";

           
          if (that.data.isFamous){
            that.checkFamousPower(()=>{
              wx.setStorage({
                key: 'famousLetter',
                data: { targetUserId: that.data.companyId },
                success: (res) => { }
              })
              wx.navigateTo({
                url: "/pages/msg/editor/editor",
                success: function () {
                  isBtnClick = false;
                },
                fail: function () {
                  isBtnClick = false;
                }
              })
            })
            
          }else{
            wx.setStorage({
              key: 'writeBack',
              data: {
                handleType: 1,
                targetMsgId: that.data.msgId,
                targetUserId: that.data.sendUserId,
                url: "/pages/msg/msgdetail/msgdetail?msgId=" + that.data.msgId
              },
            })
            wx.navigateTo({
              url: "/pages/msg/editor/editor",
              success: function () {
                isBtnClick = false;
              },
              fail: function () {
                isBtnClick = false;
              }
            })
          }
          
        } else {
          app.globalData.cacheUrl = "/pages/msg/index/index";
          app.globalData.hisUrl = "/pages/msg/msgdetail/msgdetail?msgId=" + that.data.msgId + (that.data.isFamous ? + "&famous=1" : "");
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
    }
  },

  //判断名家名企信函是否还有回信机会  每天3次
  checkFamousPower: function (callback) {
    wx.request({
      url: URL.checkFamousPower,
      data: {
        companyId: this.data.companyId,
        userId: this.data.userId //1784316
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data && res.data.success) {
          callback && callback();
        } else {
          isBtnClick = false;
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg || '网络错误',
          })
        }
      },
      fail: (res) => {

      }
    })
  },

  launchAppError: function (e) {
    wx.showToast({
      title: '唤起App失败',
      icon: 'none'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var shareInfo = {}, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = 'inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = 'inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    if (this.data.msgId == 'systemMsg') {
      shareInfo = {
        title: '念念',
        path: '/pages/find/find' + '?' + param,
        imageUrl: '',
        complete: function (res) {

        }
      }
    } else {
      shareInfo = {
        title: this.data.nickName + ' 用心为您写了一封信',
        path: '/pages/msg/msgdetail/msgdetail?msgId=' + this.data.msgId + '&' + param,
        imageUrl: URL.yunMediaRoot + 'niannianyun/wx/letter/letter_share.png',
        complete: function (res) {

        }
      }
    }
    if (this.data.isFamous){
      wx.hideShareMenu();
    }
    return shareInfo;
  }
})