import Util from '../../../../utils/util.js';
var app = getApp(),
  URL = app.globalData.URL;

Page({
  data: {
    userId: '',
    topics: [],
    collections: [],
  },

  onLoad: function() {
    this.getPagePicture();
    this.getCollections();
  },

  //获取博览馆主页主图
  getPagePicture: function() {
    Util.requestData(URL.getMuseumPagePicture, '', 'POST', (res) => {
      this.setData({
        pagePicture: res.data.data
      })
    });
  },

  //获取博览馆主页主题
  getTopic: function() {
    var userId = app.globalData.userInfo.userId;
    if (userId) {
      var data = {
        userId: userId
      };
    } else {
      data = '';
    }
    Util.requestData(URL.getMuseumTopic, data, 'POST', (res) => {
      this.setData({
        topics: res.data.data
      })
    });
  },

  //获取博览馆精品馆藏
  getCollections: function() {
    var page = 1;
    var data = {
      page: page
    };
    Util.requestData(URL.getMuseumCollections, data, 'POST', (res) => {
      var collections = res.data.data;
      for (var id in collections) {
        collections[id]['title'] = this.omit(res.data.data[id].title, 13);
        collections[id]['msgAbstract'] = this.omit(res.data.data[id].msgAbstract, 30);
      }
      this.setData({
        collections: collections
      })
    });
  },

  //省略
  omit: function(str, n) {
    if (str.length >= n) {
      str = str.substring(0, n) + "...";
      return str;
    }
    return str;
  },

  //导航到主题详情
  toTopicDetail: function(e) {
    var index = e.currentTarget.dataset.index;
    var topic = this.data.topics[index];
    var topicData = {
      topicId: topic.topicId,
      topicName: topic.topicName,
      topicBgImage: topic.topicBgImage,
      introduction: topic.introduction,
      totalLike: topic.totalLike,
      isLike:topic.isLike
    }
    wx.setStorage({
      key: 'topic',
      data: topicData,
      success: function(res) {
        wx.navigateTo({
          url: '/pages/museum/topic/topic',
        })
      },
    })
  },
  onShow:function(){
    this.getTopic();
  }
})