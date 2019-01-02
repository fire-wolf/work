import Util from '../../../../utils/util.js';
var app = getApp(),
  URL = app.globalData.URL;
var timeOut = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    isLike: false,
    userId: '',
    list: [],
    isLogin: true,
    isAuthor: true,
    yunMediaRoot: URL.yunMediaRoot,
    isEnd: false,
    isBottom: false,
    page: 1,
    isRequest: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.isLogin == true) {
      this.setData({
        userId: app.globalData.userInfo.userId
      });
    }
    wx.getStorage({
      key: 'topic',
      success: (res) => {
        var isLike = res.data.isLike ? true : false;
        this.setData({
          topic: res.data,
          isLike: isLike
        })
        this.getMuseumList();
      },
    })
  },

  //获取信函列表
  getMuseumList: function() {
    var page = this.data.page;
    var data = {
      topicId: this.data.topic.topicId,
      page: page
    }
    Util.requestData(URL.getMuseumList, data, 'POST', (res) => {
      if (res.data && res.data.data) {
        var newList = res.data.data;
        var isEnd = false;
        var curPage = this.data.page;
        if (newList.length < 6) {
          isEnd = true;
        } else {
          curPage = curPage + 1;
        }
        var list = [...this.data.list, ...res.data.data];
        this.setData({
          list: list,
          isEnd: isEnd,
          page: curPage
        })
      }
    })
  },

  //点赞
  onLike: function() {
    clearTimeout(timeOut);
    if (this.data.userId) {
      var isLike = !this.data.isLike;
      var totalLike = this.data.topic.totalLike;
      var topic = this.data.topic
      var data = {
        topicId: this.data.topic.topicId,
        userId: this.data.userId,
      }
      topic.totalLike = isLike ? totalLike + 1 : totalLike - 1;
      this.setData({
        isLike: isLike,
        topic: topic
      })
      timeOut = setTimeout(() => {
        Util.requestData(URL.museumTopicLike, data, 'POST', (res) => {
          wx.setStorage({
            key: 'topic',
            data: this.data.topic
          })
        });
      }, 1000)

    } else {
      this.getUserAuthor();
    }
  },

  //获取用户授权信息
  getUserAuthor: function() {
    app.getSetting(() => {
      this.setData({
        isAuthor: app.globalData.isAuthor,
      })
      if (app.globalData.isAuthor) {
        app.login(() => {
          this.getDataFun();
        })
      } else {
        this.getDataFun();
      }
    })
  },

  getDataFun: function() {
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: true,
        userId: app.globalData.userInfo.userId
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
  },

  //加载更多
  LoadMore: function(e) {
    if (this.data.list.length > 2) {
      if (this.data.isRequest) {
        this.setData({
          isBottom: true,
          isRequest: false,
        })
        console.log(this.data.page);
        setTimeout(() => {
          if (!this.data.isEnd) {
            this.getMuseumList();
          }
          this.setData({
            isBottom: false,
            isRequest: true,
          })
        }, 800)
      }
    }
  }
})