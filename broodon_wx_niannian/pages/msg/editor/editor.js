import HtmlToJson from '../../../wxParse/html2json.js';
import qiniuUploader from '../../../utils/qiniuUploader.js';
import Utils from '../../../utils/util.js';
var app = getApp(),
  URL = app.globalData.URL;

var innerAudioContext = wx.createInnerAudioContext();
var backgroundAudioManager = null;

var tt = null, isBtnClick = false;
// 初始化七牛相关参数
function initQiniu(obj) {
  var options = {
    region: 'ECN', // 华北区
    uptokenURL: URL.appBaseUrl + '/qiniu/getToken?fileName=' + obj.fileName,
    fileName: obj.fileName,
    // uptoken: 'xxxx',
    domain: URL.fileDomain
  };
  qiniuUploader.init(options);
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorText: '请输入正文',
    errorHidden: true,
    title: "",
    content: "",
    author: "",
    msgImg: "",
    imgTop: 0,
    addIcon: "http://file.niannian99.com/niannianyun/wx/write/1.1/bg-add-img.png",
    paperUrl: {
      "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t41.png",
      "paperColore": "#F7F6F2",
      "paperId": 10051,
      "paperName": "默认",
      "paperImage": ["https://file.niannian99.com/niannianyun/wx/paper/p51.png", "https://file.niannian99.com/niannianyun/wx/paper/p52.png", "https://file.niannian99.com/niannianyun/wx/paper/p53.png"]
    },
    musicUrl: {},
    isPlaying: false,
    isMusic: false,
    isBEJ: false,
    isEditing: false, //是否点击更多操作
    itemSize: 4,
    scrollViewHeight: '100%',
    mainHeight: '835rpx',
    addBoxTop: '310rpx',
    isShow: true,
    isIphoneX: app.globalData.isIphoneX,
    contData: [],
    curIndex: 0,
    yunMediaRoot: URL.yunMediaRoot,
    msgList: [{
      'index': 0,
      'isShow': false
    }],
    msgImgSize: 0,
    isText: true,
    isImg: true,
    isVoice: true,
    isVideo: true,
    isVoicePlaying: false,
    time: 0, //播放时长
    clock: '00:00', //播放时间显示
    voiceTotalTime: '',
    startVoice: false,
    voice: '',
    video: '',
    videoThumb: '',
    isParam: false,
    redPacket: 0,
    map: null,
    curTime: null,
    userId: null,
    userName:'',
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (backgroundAudioManager) backgroundAudioManager.destroy();
    if (innerAudioContext) innerAudioContext.destroy();
    innerAudioContext = wx.createInnerAudioContext();
    backgroundAudioManager = wx.createInnerAudioContext();
    backgroundAudioManager.loop = true;
    this.getWinHeight(); 
    this.setData({
      userId:app.globalData.userInfo.userId || '',
      userTel:app.globalData.userInfo.userTel || '',
      userName: app.globalData.userInfo.nickName,
      openid:app.globalData.userInfo.openid,
      isLogin:app.globalData.isLogin
    })
    if (options.redPacket && options.redPacket != "") {
      this.setData({
        isParam: true,
        userTel: that.data.userTel,
        redPacket: parseFloat(options.redPacket)
      });
    }
    if (options.map && options.map != "") {
      this.setData({
        isParam: true,
        map: JSON.parse(options.map)
      });
    }
    if (options.time && options.time != "") {
      this.setData({
        isParam: true,
        curTime: JSON.parse(options.time)
      });
      
    }
    
    wx.setNavigationBarTitle({
      title: "写信"
    });
    
    wx.getStorage({ //从信函详情过来 再次编辑
      key: 'editMsg',
      success: function(res) {
        if (res.errMsg == 'getStorage:ok') {
          that.dealEditContent(res.data);
        }
      },
      fail: function(msg) {
        that.getMsgCofig(); //正常流程写信
      }
    })
  },

  getMsgCofig: function() {
    var that = this;
    wx.getStorage({
      key: "msgCofig",
      success: function(res) {
        if (res.data) {
          that.setData({
            paperUrl: {
              paperId: res.data.paperUrl.paperId,
              paperColore: res.data.paperUrl.paperColore,
              paperImage: res.data.paperUrl.paperImage.split(","),
              paperName: res.data.paperUrl.paperName,
              paperThumb: res.data.paperUrl.paperThumb,
            },
            musicUrl: res.data.musicUrl,
            isMusic: res.data.isMusic,
            author: that.data.userName
          })
          if (res.data.isMusic) {
            backgroundAudioManager.src = res.data.musicUrl.musicUrl;
            that.playAudio();
          }
        }

      },
      fail: function() {
        that.setData({
          author: that.data.userName
        })
        if (that.data.isMusic) {
          backgroundAudioManager.src = that.data.musicUrl.musicUrl;
          that.playAudio();
        }
      }
    })
  },

  //获取屏幕高度 
  getWinHeight: function() {
    var that = this;
    if (app.globalData.sysInfo.windowHeight > 673) {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 835) / 2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 130) + 'px',
        scrollViewWidth: app.globalData.sysInfo.windowWidth - 16 + 'px'
      })
    } else {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 835) / 2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 60) + 'px',
        scrollViewWidth: app.globalData.sysInfo.windowWidth - 16 + 'px'
      })
    }

  },

  //处理再次编辑的数据
  dealEditContent: function(data) {
    //console.log(data)
    var contHtml = "",
      that = this,
      msgList = [],
      msgImgSize = 0;
    if (data.parseData) {
      var html = data.parseData.content.replace(/\n?\[img\](.*?)\[\/img\]\n?/g, function(k, v) {
          if (/,/g.test(v)) {
            return '<img src="' + v.split(',')[0] + '" />';
          } else {
            return '<img src="' + v + '" />';
          }
        })
        .replace(/\n?\[audio\](.*?)\[\/audio\]\n?/g, function(k, v) {
          return '<audio src="' + v + '"></audio>';
        })
        .replace(/\n?\[video\](.*?)\[\/video\]\n?/g, function(k, v) {
          if (/,/g.test(v)) {
            return '<video src="' + v.split(',')[0] + '"></video>';
          } else {
            return '<video src="' + v + '"></video>';
          }
        }),
        htmlArry = [],
        num = 0;

      if (html && html != "") htmlArry = HtmlToJson.html2json(html).nodes;

      if (htmlArry.length > 0) {
        console.log(htmlArry)
        htmlArry.forEach(function(o) {
          if (o.node == "text") {
            if (o.text) {
              msgList.push({
                'type': "text",
                "text": o.text,
                "isShow": true,
                "index": num
              });
              num++;
              // if (o.text.indexOf('') > -1 && o.text.length > 1){
              //   msgList.push({ 'type': "text", "text": o.text, "isShow": true, "index": num });
              //   num++;
              // }
            }
          } else if (o.node == "element") {
            if (o.tag == "img") {
              msgImgSize++;
              msgList.push({
                'type': "images",
                "images": o.attr.src,
                "isShow": true,
                "index": num
              });

            } else if (o.tag == "audio") {

              msgList.push({
                'type': "voice",
                "voice": o.attr.src,
                "tempFilePath": o.attr.src,
                "isShow": true,
                "index": num,
                "curClock": data.voiceTotalTime.split(":")[1] + ":" + data.voiceTotalTime.split(":")[2],
                "curTime": data.voiceDuration * 1000
              });
              that.setData({
                isVoice: false,
                voice: o.attr.src,
                time: data.voiceDuration * 1000,
                clock: data.voiceTotalTime.split(":")[1] + ":" + data.voiceTotalTime.split(":")[2],
                voiceTotalTime: data.voiceTotalTime
              })
            } else if (o.tag == "video") {
              that.setData({
                isVideo: false,
                video: o.attr.src,
                videoThumb: data.parseData.videoThumb
              })
              msgList.push({
                'type': "video",
                "video": o.attr.src,
                "isShow": true,
                "index": num,
                "videoThumb": data.parseData.videoThumb
              });

            }
            num++;
          }
        })
      }
      msgList.push({
        "isShow": true,
        "index": num,
      });
      //console.log(msgList)
    }

    that.setData({
      msgList: msgList,
      title: data.letter.title,
      content: data.letter.content,
      author: data.letter.author,
      msgImg: data.letter.image,
      msgImgSize: msgImgSize,
      musicUrl: data.musicUrl,
      paperUrl: data.paperUrl,
      isMusic: data.musicUrl.musicId ? true : false,
      nkTempId: (data.nkTempId && data.nkTempId != "") ? data.nkTempId : "",
      cardUuid: (app.globalData.cardUuid && app.globalData.cardUuid != "") ? app.globalData.cardUuid : ""
    })
    if (data.musicUrl.musicId) {
      backgroundAudioManager.src = data.musicUrl.musicUrl;
      that.playAudio();
    }
  },

  //点击按钮显示制作按钮
  add: function(e) {
    var index = e.currentTarget.dataset.index,
      curIndex = this.data.curIndex;
    if (index != curIndex && this.data.msgList[curIndex]) {
      this.setData({
        ["msgList[" + curIndex + "].isShow"]: true
      })
    }
    this.setData({
      'curIndex': index,
      isEditing: false
    });
    if (this.data.msgList[index].isShow) {
      this.setData({
        ["msgList[" + index + "].isShow"]: false
      });
    } else {
      this.setData({
        ["msgList[" + index + "].isShow"]: true
      });
    }
  },
  //点击按钮删除所选项
  deleteFun: function(e) {
    var index = e.currentTarget.dataset.index,
      type = e.currentTarget.dataset.type;
    this.setMsgListData({
      'index': index,
      'type': type
    }, 'delete');
  },
  changeOrder: function(e) {
    var data = e.currentTarget.dataset;
    var msgList = this.data.msgList;
    var midData = null;
    if (data.ordertype == 'up') {
      if (data.index == 0) {
        return;
      } else {
        midData = msgList[data.index];
        msgList[data.index] = msgList[data.index - 1];
        msgList[data.index - 1] = midData;
        msgList[data.index].index = data.index;
        msgList[data.index - 1].index = data.index - 1;
        this.setData({
          msgList: msgList
        })
      }
    } else {
      if (data.index == msgList.length - 2) {
        return;
      } else {
        midData = msgList[data.index];
        msgList[data.index] = msgList[data.index + 1];
        msgList[data.index + 1] = midData;
        msgList[data.index].index = data.index;
        msgList[data.index + 1].index = data.index + 1;
        this.setData({
          msgList: msgList
        })
      }
    }
  },
  uploadFileFun: function(filePath, successFun, errorFun) {
    initQiniu({
      fileName: 'niannianyun/wx/' + new Date().getTime() + filePath.replace(/.*?(\.\w+)$/, "$1")
    });
    // 交给七牛上传 
    qiniuUploader.upload(filePath, (res) => {
      // that.dealData(respone, res.imageURL);
      successFun && successFun(res);
    }, (error) => {
      errorFun && errorFun(error);
      console.log(error);
    });
  },
  //选择上传的类型
  onSelect: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      cType = e.currentTarget.dataset.type,
      curData = that.data.msgList[index];
    if (cType == 'image') {
      wx.chooseImage({
        count: 9 - that.data.msgImgSize,
        sizeType: 'compressed',
        success: function(res) {
          wx.showLoading({
            mask: true,
            title: '上传中...'
          });
          var imgUploaderFun = function(num) {
              if (num == res.tempFilePaths.length) {
                wx.hideLoading();
                return false;
              }
              that.uploadFileFun(res.tempFilePaths[num], function(data) {
                that.setMsgListData({
                  'index': index,
                  'images': data.imageURL,
                  'type': 'images',
                  'isShow': true
                }, 'add');
                num++;
                imgUploaderFun(num);
              }, function(error) {
                num++;
                imgUploaderFun(num);
              });
            },
            num = 0;
          imgUploaderFun(0);

        },
        fail: function(error) {
          console.log(error.errMsg);
        }
      })
    } else if (cType == 'video') {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        compressed: false,
        success: function(res) {
          console.log(res)
          if (parseFloat(res.size) / 1024 / 1024 > 200) {
            wx.showToast({
              icon: 'none',
              title: '请上传小于200M的视频哦！',
              duration: 3000
            });
            return false;
          }
          wx.showLoading({
            mask: true,
            title: '上传中...'
          });
          that.uploadFileFun(res.tempFilePath, function(data) {
            wx.downloadFile({
              url: data.imageURL + '?vframe/png/offset/0',
              success: (respone) => {
                if (!respone.tempFilePath) respone.tempFilePath = '';
                that.uploadFileFun(respone.tempFilePath, function(data2) {
                  that.setMsgListData({
                    'index': index,
                    'video': data.imageURL,
                    'videoThumb': data2.imageURL,
                    'width': res.width,
                    'height': res.height,
                    'type': 'video',
                    'isShow': true
                  }, 'add');
                  that.setData({
                    video: data.imageURL,
                    videoThumb: data2.imageURL
                  })
                  wx.hideLoading();
                }, function(error) {
                  wx.hideLoading();
                  wx.showToast({
                    icon: 'none',
                    title: '上传文件失败,请重试！'
                  });
                });
              },
              fail: (respone) => {
                wx.hideLoading();
                wx.showToast({
                  icon: 'none',
                  title: '上传文件失败,请重试！'
                });
              }
            })
          }, function(error) {
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '上传文件失败,请重试！'
            });
          });
        },
        fail: function(error) {
          //console.log(error)
          wx.hideLoading();
          //wx.showToast({ icon: 'none', title: '上传文件失败,请重试！' });
        },
        complete: function(res) {
          console.log(res)
        }
      })
    } else if (cType == 'text') {
      wx.navigateTo({
        url: "/pages/msg/editor/text/text?curIndex=" + index + "&status=add",
        success: function() {},
        fail: function() {}
      })
    } else if (cType == 'voice') {
      wx.navigateTo({
        url: "/pages/msg/editor/voice/voice?curIndex=" + index + "&status=add",
        success: function() {},
        fail: function() {

        }
      })
    }
  },
  //编辑选择的类型
  onSelectEditor: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      cType = e.currentTarget.dataset.type,
      curData = that.data.msgList[index];
    if (cType == 'image') {
      wx.navigateTo({
        url: "/pages/msg/editor/image/image?curIndex=" + index + '&images=' + curData.images,
        success: function() {},
        fail: function() {}
      })
    } else if (cType == 'text') {
      wx.navigateTo({
        url: "/pages/msg/editor/text/text?curIndex=" + index + "&text=" + curData.text + "&status=update",
        success: function() {},
        fail: function() {}
      })
    } else if (cType == 'voice') {
      innerAudioContext.stop();
      clearTimeout(tt);
      that.setData({
        isVoicePlaying: false,
        startVoice: false,
        time: that.data.msgList[index].curTime,
        clock: that.data.msgList[index].curClock,
      })
      wx.navigateTo({
        url: "/pages/msg/editor/voice/voice?curIndex=" + index + "&tempFilePath=" + curData.tempFilePath + "&curTime=" + curData.curTime + "&curClock=" + curData.curClock + "&voice=" + curData.voice + "&status=update",
        success: function() {},
        fail: function() {}
      })
    } else if (cType == 'video') {
      wx.setStorage({
        key: 'editor-video',
        data: that.data.msgList[index],
        success: (res) => {
          wx.navigateTo({
            url: "/pages/msg/editor/video/video?curIndex=" +
              index + "&video=" + that.data.msgList[index].video +
              "&videoThumb=" + that.data.msgList[index].videoThumb +
              "&width=" + that.data.msgList[index].width +
              "&height=" + that.data.msgList[index].height +
              "&status=update",
          })
        }
      })
    }
  },
  //图片加载完成
  imgLoad: function(e) {
    var index = e.currentTarget.dataset.index,
      width = e.detail.width,
      height = e.detail.height;
    if (width >= app.globalData.sysInfo.windowWidth) {
      height = height * (app.globalData.sysInfo.windowWidth / width);
      width = app.globalData.sysInfo.windowWidth;
    }
    this.setData({
      ['msgList[' + index + '].width']: width,
      ['msgList[' + index + '].height']: height
    })
  },
  //设置信函数据处理
  setMsgListData: function(data, type) {
    var that = this,
      msgListData = this.data.msgList,
      changeData = null,
      imgSize = 0,
      itemSize = 4;
    if (type == 'add') {
      msgListData.splice(data.index, 0, data);
    } else if (type == 'delete') {
      if (data.type == 'voice') {
        that.setData({
          'isVoice': true
        });
      } else if (data.type == 'video') {
        that.setData({
          'isVideo': true
        });
      }
      msgListData.splice(data.index, 1);
    } else if (type == 'update') {
      msgListData[data.index][data.type] = data[data.type];
      if (data.type == 'voice') {
        msgListData[data.index].tempFilePath = data.tempFilePath;
        msgListData[data.index].curTime = data.curTime;
        msgListData[data.index].curClock = data.curClock;
      }
      if (data.type == 'video') {
        msgListData[data.index] = data;
      }
    }
    msgListData.forEach(function(o, i) {
      o.index = i;
      o.isShow = true;
      if (o.type == 'images') {
        imgSize++;
      }
      if (o.type == 'voice') {
        itemSize = itemSize - 1;
        that.setData({
          'isVoice': false
        });
      } else if (o.type == 'video') {
        itemSize = itemSize - 1;
        that.setData({
          'isVideo': false
        });
      }

    });
    if (imgSize >= 9) {
      itemSize = itemSize - 1;
      that.setData({
        'isImg': false
      });
    } else {
      that.setData({
        'isImg': true
      });
    }
    if (msgListData.length > 1) {
      this.setData({
        errorHidden: true
      });
    } else {
      this.setData({
        ['msgList[0].isShow']: false
      });
    }
    if (msgListData.length <= 1) {
      this.setData({
        isEditing: false
      })
    }
    that.getWinHeight();
    that.setData({
      'msgList': msgListData,
      'msgImgSize': imgSize,
      'itemSize': itemSize
    });
  },
  //获取信函数据
  getMsgListData: function() {
    var that = this,
      msgListData = that.data.msgList,
      htmlStr = '',
      imgList = [];
    msgListData.forEach(function(o, i) {
      //console.log(o)
      if (o.type == 'text') {
        htmlStr += (o.text + '\n');
      } else if (o.type == 'images') {
        htmlStr += '[img]' + o.images + '[/img]';
        imgList.push(o.images);
      } else if (o.type == 'voice') {
        htmlStr += '[audio]' + o.voice + '[/audio]';
      } else if (o.type == 'video') {
        htmlStr += '[video]' + o.video + ',' + o.videoThumb + '[/video]';
        that.setData({
          video:o.video,
          videoThumb: o.videoThumb
        })
      }
    });
    that.setData({
      'content': htmlStr,
      'msgImg': imgList.length > 0 ? imgList[0] : that.data.msgImg
    });
  },

  onShow: function(e) {
    var that = this;
    if (this.data.isPlaying == true) {
      backgroundAudioManager.play();
    }
    this.setData({
      isVoicePlaying: false,
    });

    wx.getStorage({ //更换信纸过来 再次编辑
      key: 'editMsg',
      success: function(res) {
        if (res.errMsg == 'getStorage:ok') {
          that.dealEditContent(res.data);
        }
        wx.removeStorage({
          key: 'editMsg'
        })
      }
    })

    wx.getStorage({
      key: 'txtData',
      success: function(res) {
        if (res.data.text != "") {
          that.setMsgListData(res.data, res.data.status);
        } else if (res.data.text == "") {
          that.setMsgListData(res.data, 'delete');
        }
        wx.removeStorage({
          key: "txtData",
          success: function() {}
        })
      }
    })

    wx.getStorage({
      key: 'imgData',
      success: function(res) {
        if (res.data.index <= that.data.msgList.length - 1 && res.data.images != "") {
          that.setMsgListData(res.data, 'update');
        } else if (res.data.images == "") {
          that.setMsgListData(res.data, 'delete');
        }
        wx.removeStorage({
          key: "imgData",
          success: function() {}
        })
      }
    })
    wx.getStorage({
      key: 'voiceData',
      success: function(res) {
        //console.log(res)
        if (res.data.tempFilePath != "") {
          that.setMsgListData(res.data, res.data.status);
          that.setData({
            time: res.data.curTime,
            clock: res.data.curClock,
            voiceTotalTime: res.data.curClock,
            voice: res.data.voice
          })
        } else if (res.data.tempFilePath == "") {
          that.setMsgListData(res.data, 'delete');
        }

        // if (res.data.index >= that.data.msgList.length - 1 && res.data.tempFilePath != "") {
        //   that.setMsgListData(res.data, 'add');
        //   that.setData({
        //     time: res.data.curTime,
        //     clock: res.data.curClock,
        //     voiceTotalTime: res.data.curClock,
        //     voice: res.data.voice
        //   })
        // } else if (res.data.index <= that.data.msgList.length - 1 && res.data.tempFilePath != "") {
        //   that.setMsgListData(res.data, 'update');
        //   that.setData({
        //     time: res.data.curTime,
        //     clock: res.data.curClock,
        //     voiceTotalTime: res.data.curClock,
        //     voice: res.data.voice
        //   })
        // } else if (res.data.tempFilePath == "") {
        //   that.setMsgListData(res.data, 'delete');
        // }
        wx.removeStorage({
          key: 'voiceData',
          success: function(res) {},
        })
      },
    })
    wx.getStorage({
      key: 'videoData',
      success: function(res) {
        if (res.data.index <= that.data.msgList.length - 1 && res.data.video != "") {
          that.setMsgListData(res.data, 'update');
        } else if (res.data.video == "") {
          that.setMsgListData(res.data, 'delete');
        }
        wx.removeStorage({
          key: "videoData",
          success: function() {}
        })
      }
    })
  },
  onHide: function(e) {
    innerAudioContext.stop();
    backgroundAudioManager.stop();
    clearTimeout(tt);
  },

  onUnload: function(e) {
    backgroundAudioManager.stop();
    // backgroundAudioManager.volume = 0;
    // innerAudioContext.volume = 0;
    backgroundAudioManager.destroy();
    innerAudioContext.destroy();
    clearTimeout(tt);

    wx.getStorage({
      key: 'txtData',
      success: function(res) {
        that.setMsgListData(res.data, 'add');
      }
    })

    wx.removeStorage({
      key: "msgImg",
      success: function() {}
    })

    wx.removeStorage({
      key: "msgCofig",
      success: function() {}
    })

    if(!(this.data.redPacket || this.data.curTime)){
      wx.removeStorage({
        key: 'editMsg',
        success: function (res) { },
      })
    }
    

    wx.removeStorage({
      key: 'bej48',
      success: function(res) {},
    })

    if (/\/pages\/msg\/msgdetail/g.test(app.globalData.hisUrl)) {
      wx.redirectTo({
        url: app.globalData.hisUrl
      })
    }
  },

  playAudio: function() {
    if (this.data.isPlaying == true) {
      backgroundAudioManager.stop();
    } else {
      backgroundAudioManager.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })

  },

  //文字输入
  onInputText: function(e) {
    var _type = e.target.dataset.type,
      value = e.detail.value;
    if (_type == "title") {
      this.setData({
        title: value
      })
    } else if (_type == "author") {
      this.setData({
        author: value
      })
    }
  },

  onInputFocus: function() {
    this.setData({
      errorHidden: true,
    })
  },

  playVoice: function(e) {
    clearTimeout(tt);
    var voicePlay = !this.data.isVoicePlaying;
    var tempFilePath = e.currentTarget.dataset.path;
    var index = e.currentTarget.dataset.idx;
    this.setData({
      isVoicePlaying: voicePlay,
      startVoice: true,
    });
    if (this.data.startVoice)
      if (voicePlay) {
        backgroundAudioManager.stop();
        this.voicePlay(tempFilePath, index);
        this.timeDown(this, index);
      } else {
        innerAudioContext.pause();
        if (this.data.isPlaying == true) {
          backgroundAudioManager.play();
        }
      }
  },

  //录音播放
  voicePlay: function(tempFilePath, index) {
    innerAudioContext.autoplay = true;
    innerAudioContext.src = tempFilePath;
    innerAudioContext.play();
    // innerAudioContext.onEnded((res) => {
    //   this.setData({
    //     isVoicePlaying: false,
    //     startVoice: false,
    //     time: this.data.msgList[index].curTime,
    //     clock: this.data.msgList[index].curClock,
    //   })
    // })
  },

  showEditFun: function() {
    // var msgList = this.data.msgList,newList = [];
    // msgList.forEach((item,index)=>{
    //   item.isEditing = !this.data.isEditing;
    //   newList.push(item)
    // })
    this.setData({
      isEditing: !this.data.isEditing
    })
  },
  //信函下一步逻辑处理
  goSend:function(e){
    var that = this;
    if (isBtnClick){
      setTimeout(function () {
        isBtnClick = false;
      }, 2000);
      return false;
    }
    isBtnClick = true;
    if (app.globalData.isLogin) {
      this.toPreview(e.currentTarget.dataset.type, function () {
        setTimeout(function () {
          isBtnClick = false;
        }, 1000)
      });
    } else {
      if (e.detail && e.detail.encryptedData && app.globalData.sessionKey) {
        var userInfo = app.globalData.userInfo, sysInfo = app.globalData.sysInfo;
        var param = {
          userSex: userInfo.gender,
          openid: userInfo.openId,
          unionid: userInfo.unionId,
          userImage: userInfo.avatarUrl,
          userNicename: userInfo.nickName,
          mobileType: /iOS/g.test(sysInfo.system) ? 1 : 0,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: app.globalData.sessionKey
        }
        if (app.globalData.inviteInfo.inviteUserId) {
          param = Object.assign(param, { 'inviteUserId': app.globalData.inviteInfo.inviteUserId });
        }
        if (app.globalData.inviteInfo.inviteActiviName) {
          param = Object.assign(param, { 'inviteActiviName': app.globalData.inviteInfo.inviteActiviName })
        }


        wx.request({
          //获取openid接口  
          url: URL.bindUserInfo,
          data: param,
          method: 'GET',
          success: function (res) {
            if (res.data && res.data.data) {
              app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data.data);
              app.globalData.isLogin = true;
              that.setData({
                isLogin: true,
                nickName: res.data.data.userNicename,
                userImage: Utils.qnUrl(res.data.data.userImage)
              });
              that.toPreview(e.currentTarget.dataset.type,function(){
                setTimeout(function () {
                  isBtnClick = false;
                }, 1000)
              });
            }
          },
          fail: function (error) {
            setTimeout(function () {
              isBtnClick = false;
            }, 1000)
          }
        });
      } 
      setTimeout(function () {
        isBtnClick = false;
      }, 1000)
    } 
  },
  //下一步到预览操作
  toPreview: function(type,callback) {

    var that = this,
      flag = false,
      errorText = "";
    this.getMsgListData();
    this.setData({
      isEditing: false
    })
    if (this.data.title == "") {
      errorText = "请输入称呼或标题";
      flag = true;
    } else if (this.data.content == "") {
      errorText = "请输入信函内容";
      flag = true;
    } else if (this.data.author == "") {
      errorText = "请输入署名";
      flag = true;
    }
    if (flag == true) {
      this.setData({
        errorHidden: false,
        errorText: errorText
      })
      setTimeout(function () {
        isBtnClick = false;
      }, 1000);
      return false;
    } else {
     

      wx.setStorage({
        key: "msgPreview",
        data: this.data,
        success: function () {
          if (that.data.isBEJ) {
            wx.navigateTo({
              url: "/pages/bej48/preview/preview",
            })
          } else {
            wx.navigateTo({
              url: "/pages/msg/preview/preview",
            })
          }
          callback && callback();
        }
      })


    }

  },
  //信函数据发送处理
  sendSubmit: function(callback) {
    var that = this,
      msgCurData;
    this.getMsgListData();
    wx.showLoading({
      title: '信函生成中',
    });
    var param = {
      'paperId': this.data.paperUrl ? this.data.paperUrl.paperId : '',
      'musicId': this.data.isMusic ? this.data.musicUrl.musicId : '',
      'signature': this.data.author,
      'content': (this.data.content && this.data.content != "") ? this.data.content : "",
      'image': this.data.msgImg,
      'salutation': this.data.title,
      'userId': this.data.userId,
      'isQrCode': 1,
      'nkTempId': this.data.nkTempId ? this.data.nkTempId : "",
      'cardUuid': this.data.cardUuid ? this.data.cardUuid : "",
      'voice': this.data.voice,
      'video': this.data.video,
      'videoThumb': this.data.videoThumb,
    }
    if (this.data.map) {
      param = Object.assign(param, {
        lat: that.data.map.latitude,
        lng: that.data.map.longitude,
        location: that.data.map.address
      })
    } else if (this.data.curTime) {
      param = Object.assign(param, {
        sendTime: that.data.curTime.time
      })
    } else if (this.data.redPacket && this.data.redPacket > 0) {
      param = Object.assign(param, {
        redPacketAmount: that.data.redPacket
      })
    }
    if (this.data.curMsgId) {
      wx.hideLoading();
      callback && callback({
        data: that.data.curMsgId
      });
      return false;
    }
    wx.request({
      url: URL.sendMsg,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: param,
      success: function(res) {
        wx.hideLoading();
        callback && callback(res, param);
      },
      fail: function(error) {
        wx.showLoading({
          title: JSON.stringify(error)
        });
        setTimeout(function() {
          wx.hideLoading();
        }, 2000)
      }
    })
  }, 
  //倒计时
  timeDown: function(that, index) {
    var that = this;
    that.setData({
      clock: this.dateformat(that.data.time),
    })

    if (that.data.time <= 0) {
      innerAudioContext.stop();
      this.setData({
        isVoicePlaying: false,
        startVoice: false,
        time: this.data.msgList[index].curTime,
        clock: this.data.msgList[index].curClock,
      })
      if (that.data.isPlaying == true) {
        backgroundAudioManager.play();
      }
      return;
    }
    tt = setTimeout(function() {
      that.data.time -= 10;
      that.timeDown(that, index);
    }, 10)
  },

  dateformat: function(millisecond) {
    //总秒数
    var second = Math.floor(millisecond / 1000);
    //秒
    var sec = Math.floor(second % 60);
    sec = sec > 9 ? sec : '0' + sec;
    //分
    var min = Math.floor(second / 60);
    //时
    var hour = Math.floor(min / 60);
    return hour + "" + min + ":" + sec;
  },
  //处理编辑项
  changeMsgType: function(e) {
    var that = this,
      type = e.detail.type || e.currentTarget.dataset.type,
      url = "",
      msgCurData = this.data,
      voiceDuration = 0;
    this.getMsgListData();
    if (msgCurData.voiceTotalTime != "") {
      voiceDuration = msgCurData.voiceTotalTime.split(':');
      voiceDuration = parseInt(voiceDuration[0]) * 60 + parseInt(voiceDuration[1]);
    }
    if (type == 'map') {
      wx.chooseLocation({
        success: function(res) {
          if (res.address == "") {
            wx.showLoading({
              title: '请选中定位地区地址！',
            });
            setTimeout(function() {
              wx.hideLoading()
            }, 2000)
          } else {
            that.setData({
              map: res
            });
          }
        }
      })
      return false;
    }
    wx.setStorage({
      key: 'editMsg',
      data: {
        parseData: {
          content: (msgCurData.content && msgCurData.content != "") ? msgCurData.content : "",
          videoThumb: msgCurData.videoThumb != "" ? msgCurData.videoThumb : ""
        },
        letter: {
          title: msgCurData.title ? msgCurData.title : '',
          author: msgCurData.author ? msgCurData.author : '',
          content: (msgCurData.content && msgCurData.content != "") ? msgCurData.content : "",
          image: msgCurData.msgImg && msgCurData.msgImg != "" ? msgCurData.msgImg : "",
        },
        musicId: msgCurData.musicUrl.musicId ? msgCurData.musicUrl.musicId : "",
        musicUrl: msgCurData.musicUrl ? {
          musicId: msgCurData.musicUrl.musicId,
          musicTitle: '',
          musicUrl: msgCurData.musicUrl.musicUrl
        } : {
          musicId: '',
          musicTitle: '',
          musicUrl: ''
        },
        paperUrl: {
          paperId: msgCurData.paperId || msgCurData.paperUrl.paperId,
          paperColore: '',
          paperImage: msgCurData.paperUrl.paperImage,
          paperName: '',
          paperThumb: '',
        },
        voiceTotalTime: msgCurData.voiceTotalTime && msgCurData.voiceTotalTime.split(':').length > 2 ? msgCurData.voiceTotalTime:"00:" + msgCurData.voiceTotalTime,
        voiceDuration: voiceDuration


      },
      success: function() {
        if (type == 'redPacket') {
          wx.setStorage({
            key: 'msgRedPacket',
            data: {
              redpacket: msgCurData.redPacket
            }
          })
          wx.navigateBack();
        } else if (type == 'time') {
          wx.setStorage({
            key: 'msgTime',
            data: {
              msgTime: msgCurData.curTime
            }
          })
          wx.navigateBack();
        } else if (type == "paper") {
          wx.navigateTo({
            url: "/pages/msg/index/index"
          })
        }

      }
    });
  },
  //发送分享的信函
  //  onShareAppMessage: function (shareObj) {
  //    var that = this, param = '', title = '',url = '';
  //   if (that.data.letter && that.data.letter.content == ""){
  //     wx.showToast({
  //       title: '分享内容不能为空！',
  //       icon: 'none'
  //     })
  //     return false;
  //   }
  //   if (app.globalData.userInfo && app.globalData.userInfo.userId) {
  //     param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
  //   } else if (app.globalData.inviteInfo.inviteUserId) {
  //     param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
  //   }


  //   if(shareObj.from=='menu'){
  //     title = app.globalData.userInfo.nickName + ' 给你分享了一个写信工具';
  //     url = "/pages/find/find"
  //   }else{
  //     setTimeout(function(){
  //       title = app.globalData.userInfo.nickName + ' 给你写了一封信'
  //       url = '/pages/msg/msgdetail/msgdetail?msgId=' + that.data.msgId + param;
  //     },3000);

  //   }
  //   return {
  //     title: title,
  //     path: url,
  //     imageUrl: URL.yunMediaRoot + 'niannianyun/wx/letter/letter_share.png',
  //     success: function (res) {

  //     }
  //   }
  // }
})