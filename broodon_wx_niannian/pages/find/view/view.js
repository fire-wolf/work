 
import Utils from '../../../utils/util.js'
var WxParse = require('../../../wxParse/wxParse.js');

var app = getApp(), URL = app.globalData.URL;

Page({
  data:{
    isIphoneX: app.globalData.isIphoneX
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      //获取文章详情接口
      url: URL.getArticleView,
      data: {
        articleId: options.id
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.success == true){
          that.createHtml(res.data.data);
        }
      }
    });
    
    //分享者信息
    app.setInviteInfo(options);
  },
  createHtml:function(res){
    var that = this;
    var data1 = res.content ? res.content : '';
    if(res.content && res.conntent!=""){
      data1 = data1
        .replace(/\n?\[img\](.*?)\[\/img\]\n?/g, function (k, v) {
          if (/\,/gi.test(v)) {
            return '<img  src="' + v.split(',')[0] + '" /><div class="img-txt"><span class="line"></span><span class="txt">' + v.split(',')[1] + '</span><span class="line"></span></div>';
          } else {
            return '<img  src="' + Utils.qnUrl(v) + '" />';
          }
        })
        .replace(/\n/g, "<span class='sBr' style='display:block;height:10rpx;'></span>").replace(/<img src=(.*?) \/>/gi, function (a, b) {
          if(/^http/.test(b)){
            return '<img src=' + b + ' />';
          }else{
            console.log(b)
            return '<img src=' + Utils.qnUrl(b) + ' />';
          }
        }).replace(/\[audio\](.*?)\[\/audio\]/g,"");
      WxParse.wxParse('content', 'html', data1, that, 0);
    } 
    that.setData({ title: res.title, userNickName: res.userNickName, articleId: res.articleId });
  },
  onShareAppMessage: function (res) {
    var that = this, param = '';
    if (app.globalData.userInfo && app.globalData.userInfo.userId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.userInfo.userId;
    } else if (app.globalData.inviteInfo.inviteUserId) {
      param = '&inviteActiviName=commonMsg&inviteUserId=' + app.globalData.inviteInfo.inviteUserId;
    }
    return {
      title: that.data.title,
      path: '/pages/view/view?id=' + that.data.articleId + param,
      success: function (res) {
        // 转发成功
       console.log("转发成功！");
      },
      complete: function (res) {
          console.log(res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败！");
      }
    }
  }
  
})
 