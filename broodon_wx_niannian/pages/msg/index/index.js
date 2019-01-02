var app = getApp(), URL = app.globalData.URL;
var innerAudioContext = wx.createInnerAudioContext();

// innerAudioContext.onEnded(function () {
//   innerAudioContext.play();
// })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    paperUrls: [
      { "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t5.png", "paperColore": "#F7F6F2", "paperId": 10051, "paperName": "默认", "paperImage": "https://file.niannian99.com/niannianyun/wx/paper/p51.png,https://file.niannian99.com/niannianyun/wx/paper/p52.png,https://file.niannian99.com/niannianyun/wx/paper/p53.png" },
      { "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t41.png", "paperColore": "#FAE3CD", "paperId": 10050, "paperName": "思念团员", "paperImage": "https://file.niannian99.com/niannianyun/wx/paper/p41.png,https://file.niannian99.com/niannianyun/wx/paper/p42.png,https://file.niannian99.com/niannianyun/wx/paper/p43.png" },
      { "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t1.png", "paperColore": "#FFF6F5", "paperId": 10049, "paperName": "幸福", "paperImage": "https://file.niannian99.com/niannianyun/wx/paper/p1.png,https://file.niannian99.com/niannianyun/wx/paper/p2.png,https://file.niannian99.com/niannianyun/wx/paper/p3.png" },
      { "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t21.png", "paperColore": "#FFF8EB", "paperId": 10048, "paperName": "天真无邪", "paperImage": "https://file.niannian99.com/niannianyun/wx/paper/p21.png,https://file.niannian99.com/niannianyun/wx/paper/p22.png,https://file.niannian99.com/niannianyun/wx/paper/p23.png" },
      { "paperThumb": "https://file.niannian99.com/niannianyun/wx/paper/t31.png", "paperColore": "#FAF7F2", "paperId": 10047, "paperName": "生日快乐", "paperImage": "https://file.niannian99.com/niannianyun/wx/paper/p31.png,https://file.niannian99.com/niannianyun/wx/paper/p32.png,https://file.niannian99.com/niannianyun/wx/paper/p34.png" }
      ],
    current: 0,
    musicIndex: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    isPlaying: false,
    choosing: false, //正在选择背景音乐
    musicUrls: [
      { "musicId": 60, "musicTitle": "默认", "musicUrl": "https://file.niannian99.com/niannianyun/wx/paper/v5.mp3" }, { "musicId": 61, "musicTitle": "思念团员", "musicUrl": "https://file.niannian99.com/niannianyun/wx/paper/v4.mp3" }, { "musicId": 62, "musicTitle": "幸福", "musicUrl": "https://file.niannian99.com/niannianyun/wx/paper/v1.mp3" }, { "musicId": 63, "musicTitle": "天真无邪", "musicUrl": "https://file.niannian99.com/niannianyun/wx/paper/v2.mp3" }, { "musicId": 64, "musicTitle": "生日快乐", "musicUrl": "https://file.niannian99.com/niannianyun/wx/paper/v3.mp3" }
      ],
    playingMusicUrl: {},
    yunMediaRoot: URL.yunMediaRoot,
    editorData:null
  },

  onLoad: function (options) {
    var that = this;
    if (innerAudioContext) innerAudioContext.destroy();
    innerAudioContext = null;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.obeyMuteSwitch = false;
    innerAudioContext.volume = 1;
    innerAudioContext.loop = true;

    this.getMsgPaperAndMusic();

    wx.getStorage({
      key: 'editMsg',
      success: function (res) { 
        that.setData({
          editorData: res.data
        });
        wx.removeStorage({
          key: 'editMsg',
          success: function(res) {},
        })
      }
    }) 
    wx.removeStorage({
      key: 'editMsg',
      success: function(res) {},
    })
    wx.removeStorage({
      key: 'msgPreview',
      success: function (res) { },
    })

    wx.setNavigationBarTitle({
      title: "信纸"
    });
  },

  onShow: function () {
    if (this.data.isPlaying && innerAudioContext) {
      innerAudioContext.src = this.data.playingMusicUrl.musicUrl;
      innerAudioContext.play();
    }
  },

  onHide: function () {
    innerAudioContext.stop();
  },

  getMsgPaperAndMusic: function(){
    var that = this;
    wx.request({
      url: URL.getMsgPaperAndMusic,
      success:function(res){
        //console.log(res)
        if(res.data.success == true){
          that.setData({
            paperUrls: res.data.data.paperList,
            musicUrls: res.data.data.musicList,
            isPlaying: true,
            playingMusicUrl: res.data.data.musicList[that.data.musicIndex]
          })
          setTimeout(function(){
            that.onPlayAudio();
          },500)
          
        }
      },
      fail: function(msg){
        console.log(msg)
      }
    })
  },

  onSlideChangePaper: function (e) {
    if (e.detail.source == 'touch'){
      this.setData({
        choosing: false,
        isPlaying: true,
        current: e.detail.current,
        musicIndex: e.detail.current,
        playingMusicUrl: this.data.musicUrls[e.detail.current]
      })
      this.onPlayAudio();
    }
  },

  showMuisc: function() { //显示所有背景音乐
    this.setData({
      choosing: !this.data.choosing
    })
  },

  hideMuisc: function(){
    this.setData({
      choosing: false
    })
  },

  onChoiceMuisc: function(e){ //选择背景音乐操作
    if (e.target.dataset.muisc == "close") {
      this.setData({
        musicIndex: -1,
        isPlaying: false,
        choosing: false
      })
      innerAudioContext.stop();
    } else if (e.target.dataset.muisc == "play"){
      this.setData({
        isPlaying: true,
      })
    } else{
      this.setData({
        musicIndex: e.target.dataset.muisc,
        isPlaying: true,
        playingMusicUrl: this.data.musicUrls[e.target.dataset.muisc]
      })
      this.onPlayAudio()
    }
  },

  onPlayAudio: function () {
    var that = this;
    innerAudioContext.stop();
    innerAudioContext.src = this.data.playingMusicUrl.musicUrl;
    innerAudioContext.play();
  },

  goEditor: function () {
    var that = this,curData = {
      paperUrl: this.data.paperUrls[this.data.current],
      musicUrl: this.data.playingMusicUrl,
      isMusic: that.data.isPlaying
    };
    wx.setStorage({
      key: "msgImg",
      data: "",
    })
    //console.log(this.data);
    curData.paperUrl.paperImage = curData.paperUrl.paperImage.split(",");
    if (this.data.editorData){
      curData = Object.assign(that.data.editorData,curData);
    }
    wx.setStorage({
      key: "editMsg",
      data: curData,
      success: function() {
        innerAudioContext.stop();
        wx.navigateBack();
      }
    })
  },

  onUnload: function () {
    // innerAudioContext.stop(); 
    // innerAudioContext.destroy();
    //console.log(111)
    if (/iOS/gi.test(app.globalData.sysInfo.system)) {
      innerAudioContext.stop();
    } else {
      innerAudioContext.destroy();
    }
    innerAudioContext = null;
    if (/\/pages\/find\/find/g.test(app.globalData.hisUrl) ||
      /\/pages\/msg\/msgdetail/g.test(app.globalData.hisUrl) ||  
      /\/pages\/appdetail\/appdetail/g.test(app.globalData.hisUrl)) {
      wx.redirectTo({
        url: app.globalData.hisUrl
      })

    }
    if (/pages\/bej48\/detail/g.test(app.globalData.hisUrl) || 
      /pages\/guide\/guide/g.test(app.globalData.hisUrl)
    ){
      wx.navigateBack({
        delta: 2
      })
    }
  },

})

