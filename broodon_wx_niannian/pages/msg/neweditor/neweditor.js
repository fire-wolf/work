var app = getApp(), URL = app.globalData.URL;

var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onEnded(function () {
  innerAudioContext.play();
});

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
      "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t41.png", "paperColore": "#F7F6F2", "paperId": 10051, "paperName": "默认", "paperImage": ["https://file.niannian99.com/niannianyun/wx/paper/p51.png", "https://file.niannian99.com/niannianyun/wx/paper/p52.png","https://file.niannian99.com/niannianyun/wx/paper/p53.png"]
    },
    musicUrl: {},
    isPlaying: false,
    isMusic: false,
    isBEJ: false,
    scrollViewHeight: '100%',
    mainHeight: '835rpx',
    isIphoneX: app.globalData.isIphoneX,
    yunMediaRoot: URL.yunMediaRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    if (app.globalData.sysInfo.windowHeight > 673) {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 835)/2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 130) + 'px',
      })
    } else {
      that.setData({
        mainHeight: (app.globalData.sysInfo.windowHeight / 603 * 835)/2 + 'px',
        scrollViewHeight: app.globalData.sysInfo.windowHeight - (app.globalData.sysInfo.windowWidth / 750 * 60) + 'px',
      })
    }

    

    wx.getStorage({ //从信函详情过来 再次编辑
      key: 'editMsg',
      success: function(res) {
        that.setData({
          title: res.data.letter.title,
          content: res.data.letter.content,
          author: res.data.letter.author,
          msgImg: res.data.letter.image,
          musicUrl: res.data.musicUrl,
          paperUrl: res.data.paperUrl,
          isMusic: res.data.musicUrl.musicId ? true : false,
          nkTempId: (res.data.nkTempId && res.data.nkTempId != "") ? res.data.nkTempId:"",
          cardUuid: (app.globalData.cardUuid && app.globalData.cardUuid != "") ? app.globalData.cardUuid:""
        })
        if (res.data.musicUrl.musicId) {
          innerAudioContext.src = res.data.musicUrl.musicUrl;
          that.playAudio();
        }
        if (res.data.letter.image){
          that.setImgTop(res.data.letter.image);
        }
      },
      fail: function(msg){
        that.getMsgCofig(); //正常流程写信
      }
    })
  },

  getMsgCofig: function(){
    var that = this;
    wx.getStorage({
      key: "msgCofig",
      success: function (res) {
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
            author: app.globalData.userInfo.nickName ? app.globalData.userInfo.nickName : ''
          })
          if (res.data.isMusic) {
            innerAudioContext.src = res.data.musicUrl.musicUrl;
            that.playAudio();
          }
        }
        wx.getStorage({ //从BEJ48 成员详情页过来写信
          key: 'bej48',
          success: function(res1) {
            console.log(res1)
            that.setData({
              isBEJ: true,
              title: res1.data.name
            })
          },
        })
      },
      fail: function () {
        that.setData({
          author: app.globalData.userInfo.nickName
        })
      }
    })
  },

  onShow: function () {

    var that = this;
    wx.getStorage({
      key: "msgImg",
      success: function (res) {
        that.setData({
          msgImg: res.data
        })
        that.setImgTop(res.data);
      }
    })
    if(this.data.isPlaying){
      innerAudioContext.play();
    }
  },

  onHide: function () {
    innerAudioContext.stop();
  },

  onUnload: function () {
    innerAudioContext.stop();

    wx.removeStorage({
      key: "msgImg",
      success: function () { }
    })
    
    wx.removeStorage({
      key: "msgCofig",
      success: function () { }
    })
    
    wx.removeStorage({
      key: 'editMsg',
      success: function (res) { },
    })

    wx.removeStorage({
      key: 'bej48',
      success: function (res) { },
    })

    if (/\/pages\/msg\/msgdetail/g.test(app.globalData.hisUrl)) {
      wx.redirectTo({
        url: app.globalData.hisUrl
      })
    }
  },

  playAudio: function (){
    if (this.data.isPlaying == true){
      innerAudioContext.stop();
    }else{
      innerAudioContext.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })

  },

  /**
   * 选择图片
   */
  onSelectImg: function(e){
    var that = this;
    if(that.data.msgImg){
      wx.setStorage({
        key: 'msgImg',
        data: that.data.msgImg,
        success: function(){
          wx.navigateTo({
            url: "/pages/msg/viewimg/viewimg",
          })
        }
      })
    }else{
      wx.chooseImage({
        count: 1,
        success: function (res) {
          wx.setStorage({
            key: "msgImg",
            data: res.tempFilePaths[0],
            success: function(){
              that.setData({
                msgImg: res.tempFilePaths[0]
              })
              that.setImgTop(res.tempFilePaths[0]);
            }
          })
        }
      })
    }
    
  },

  setImgTop: function(imgUrl){
    
    var that = this;
    wx.getImageInfo({
      src: imgUrl,
      success: function (data) {
        var imgTop = 0;
        var param = app.globalData.sysInfo.windowWidth / 750;
        var wid = param * ((750 - 64) * 0.8);
        var heig = param * 326;
        var imgHeig = data.height / (data.width / wid);
        if (imgHeig > heig) {
          imgTop = (imgHeig - heig) / 2 * -1
        } else {
          imgTop = (heig - imgHeig) / 2
        }
        that.setData({
          imgTop
        })
      }
    })
  },

  //文字输入
  onInputText: function(e){
    var _type =  e.target.dataset.type,
    value = e.detail.value;
    if (_type == "title"){
      this.setData({
        title: value
      })
    } else if (_type == "author"){
      this.setData({
        author: value
      })
    }else{
      this.setData({
        content: value
      })
    }
  },

  onInputFocus: function(){
    this.setData({
      errorHidden: true,
    })
  },

  goPreview: function () {
    var that = this,flag = false, errorText = "";
    if (this.data.title == ""){
      errorText = "请输入称呼或标题";
      flag = true;
    }else if (this.data.content == "") {
      errorText = "请输入信函内容";
      flag = true;
    }else if (this.data.author == "") {
      errorText = "请输入署名";
      flag = true;
    }
    if(flag == true){
      this.setData({
        errorHidden: false,
        errorText: errorText
      })
      return false;
    }
    
    wx.setStorage({
      key: "msgPreview",
      data: this.data,
      success: function(){
        if (that.data.isBEJ){
          wx.navigateTo({
            url: "/pages/bej48/preview/preview",
          })
        }else{
          wx.navigateTo({
            url: "/pages/msg/preview/preview",
          })
        }
      }
    })
  }

  
})