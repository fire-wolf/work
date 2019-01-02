// pages/famous/famous-detailMsg/famous-detailMsg.js
var app = getApp(), URL = app.globalData.URL;
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    famousInfo: {},
    yunMediaRoot: URL.yunMediaRoot,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var name = this.data.name;
    var nameLength = name.length;
    this.setData({
      nameLength: nameLength
    })
    this.init();
  },

  init: function(){
    var that = this;
    wx.getStorage({
      key: 'famousInfo',
      success: (res) => {
        //console.log(res.data) 
        this.setData({
          famousInfo: res.data
        })
        var famousRemark = res.data.famousRemark ? res.data.famousRemark : '';
        var content = famousRemark
          .replace(/    /g, "　")
          .replace(/\n?\[img\](.*?)\[\/img\]\n?/g, function (k, v) {
            if (/\,/gi.test(v)) {
              return '<img  src="' + v.split(',')[0] + '" /><div class="img-txt"><span class="line"></span><span class="txt">' + v.split(',')[1] + '</span><span class="line"></span></div>';
            } else {
              return '<img  src="' + v + '" />';
            }
          })
          .replace(/\n?\[audio\](.*?)\[\/audio\]\n?/g, '')
          .replace(/\<audio\>|\<\/audio\>/g, '')
          .replace(/\n?\[video\](.*?)\[\/video\]\n?/g, '')
          .replace(/\[smile\](.*?)\[\/smile\]/g, "")
          .replace(/\[button\](.*?)\[\/button\]/g, "")
          .replace(/<img src=(.*?) \/>/gi, function (a, b) {
            return '<img src=' + (URL.fileDomain + b) + ' />';
          }).replace(/\n/g, "<br/>").replace(/&nbsp;/g, '<span class="sline"></span>');
        WxParse.wxParse('content', 'html', content, this, 0);
      },
    })
  }


})