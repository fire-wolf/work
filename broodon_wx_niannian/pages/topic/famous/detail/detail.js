// pages/famous/famousDetail/famousDetail.js\
import Utils from '../../../../utils/util.js';
var app = getApp(), URL = app.globalData.URL;
var timeOut = null, isBtnClick = false;;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    companyId: '',
    isLogin: true,
    handleType: 'all', // all:所有评论 my:与我相关
    allComPage: 1, //所有评论的页码4
    myComPage: 1, //与我相关的页码
    allList: [],
    myList: [],
    isAllListEnd: false,
    isMyListEnd: false,
    isFollow: false,
    famousInfo: {
      famousHeardUrl: '',
      famousIndustry: '', //职称/职业/行业描述
      famousIntroduce: '',//名企名家简介
      famousName: '',//名家名企信箱名称
      famousRemark: '',//名企名家更多备注信息
      follow: '',//名企名家状关注状态
      unReadCount: '',//信函未读数
    },
    topicInfo:{
      content: '',
      imgUrl: '',
      topicId: '',
      upNums: 0,
      commentNums: 0,
      isLike: false,
    },
    isGetting: false,
    commentList: [],
    isInputComment: false, //显示哪种评论输入框
    isCommentFocus: false, //评论输入获得焦点
    commentContent: '', //评论输入框的内容
    replyItem: {}, //评论回复的信息
    isIphoneX: app.globalData.isIphoneX,
    yunMediaRoot: URL.yunMediaRoot,
    scrollTop: 0,
    isAuthor: true,
    pageActNo:1,
    actList:null,
    isSayShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    if (options.companyId){
      this.setData({
        companyId: options.companyId,
      })
    }else if(options.q){
      var url = decodeURIComponent(options.q), companyId = url.replace(/^http(.*?)\?companyId=(\w+)/i, "$2");
      this.setData({
        companyId: companyId
      })
    }
    
    this.init();
  },

  init: function (){
    wx.showLoading({
      title: '加载中...',
    })
    this.getUserAuthor();
    //this.getDataFun();
    //app.login((res) => {
      // if (app.globalData.isLogin) {
      //   this.setData({
      //     isLogin: true,
      //     userId: app.globalData.userInfo.userId
      //   })
      //   this.getFamousInfo();
      //   this.getTopByCompany();
      // } else {
      //   wx.hideLoading();
      //   this.setData({
      //     isLogin: false
      //   })
      // }
    //})
  },
  onShow: function () {
    var that = this, commentList = this.data.commentList;
    wx.getStorage({
      key: 'actParam',
      success: function (res) {
        that.setData({
          pageActNo: 1,
          actList:null,
          handleType:'act'
        })
        that.getFanousActList();
        wx.removeStorage({
          key: 'actParam',
          success: function (res) { },
        })
      }
    })
    if (commentList.length > 0) {
      wx.getStorage({
        key: 'moreComment',
        success: (res) => {
          //console.log(res)
          if (res.data.comment) {
            commentList[res.data.index] = res.data.comment;
          } else {
            commentList.splice(res.data.index, 1);
          }

          if (this.data.handleType == 'all') {
            this.setData({
              allList: commentList,
              commentList: commentList
            })
          } else {
            this.setData({
              myList: commentList,
              commentList: commentList
            })
          }
        },
      })
    }
    this.getFamousInfo(); //在信箱列表返回，重新读取未读数
  },

  //登录后控制显示
  onLogin: function (e) {
    this.setData({
      isLogin: e.detail
    })
    this.init();
  },

  scrollToView: function () {
    var that = this, hei = 0;
    wx.createSelectorQuery().select('.head-container').fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
      computedStyle: ['margin', 'backgroundColor']
    }, function (res) {
      //console.log(res)
      hei = hei + res.height;
      wx.createSelectorQuery().select('.main-container').fields({
        dataset: true,
        size: true,
        scrollOffset: true,
        properties: ['scrollX', 'scrollY'],
        computedStyle: ['margin', 'backgroundColor']
      }, function (res2) {
        //console.log(res)
        hei = hei + res2.height;
        that.setData({
          scrollTop: hei
        })
      }).exec()
    }).exec();
  },

  getUserAuthor: function () {
    var that = this;
    app.getSetting(function () {
      that.setData({
        isAuthor: app.globalData.isAuthor,
      })
      if (app.globalData.isAuthor) {
        app.login(function(){
          that.getDataFun();
        })
      }else{
        that.getDataFun();
      }
    })
  },

  getDataFun: function(){
    var that = this;
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: true,
        userId: app.globalData.userInfo.userId
      })
      this.getFamousInfo();
      this.getTopByCompany();
      this.getFanousActList();
    } else {
      wx.hideLoading();
      this.setData({
        isLogin: null
      })
    }
  },

  resetData: function(e){
    //console.log(e.detail)
    if (this.data.handleType == 'all'){
      this.setData({
        allList: e.detail,
        commentList: e.detail
      })
    }else{
      this.setData({
        myList: e.detail,
        commentList: e.detail
      })
    }
  },

  //名家名企信息详情
  getFamousInfo: function(){
    wx.request({
      url: URL.getFamousInfo,
      data: {
        companyId: this.data.companyId,
        userId: this.data.userId
      },
      success: (res) => {
        if (res && res.data && res.data.success && res.data.data) {
          this.setData({
            famousInfo: res.data.data,
            introceTxt: res.data.data.famousIntroduce && res.data.data.famousIntroduce != "" ? (res.data.data.famousIntroduce.length > 28 ? res.data.data.famousIntroduce.substr(0, 28) + '...' : res.data.data.famousIntroduce) :''
          })
          wx.setNavigationBarTitle({
            title: res.data.data.famousName
          })
        }
        wx.hideLoading();
        wx.showShareMenu();
      },
      fail: (msg) => {
        this.setData({
          isLoading: false,
        })
        wx.hideLoading();
      }
    })
  },

  //今日话题信息
  getTopByCompany: function () {
    wx.request({
      url: URL.getTopByCompany,
      data: {
        companyId: this.data.companyId,
        userId: this.data.userId
      },
      success: (res) => {
        if (res && res.data && res.data.success && res.data.data) {
          this.setData({
            topicInfo: res.data.data
          })
          this.getTopicComment('all');
          this.getTopicComment('my');
        }else{
          this.setData({
            isSayShow:false,
            handleType:'act'
          })
        }
      },
      fail: (msg) => {
        this.setData({
          isLoading: false,
        })
      }
    })
  },
//获取活动列表信息
  getFanousActList:function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (this.data.pageActNo==1){
      that.setData({
        actList: []
      });
    }
    wx.request({
      url: URL.getActList,
      data: {
        pageNo: this.data.pageActNo,
        pageSize: 10,
        userId: this.data.userId,
        companyId: this.data.companyId,
      }, 
      success: (res) => {
        wx.hideLoading();
        // console.log(res);
        if (res.data.data && res.data.data.list && res.data.data.list.length>0){
          if (that.data.actList && that.data.actList.length > 0) { 
            that.data.actList = that.data.actList.concat(res.data.data.list);
          } else {
            that.data.actList = res.data.data.list;
          }
          that.setData({
            actList: that.data.actList
          });
        }
      },
      fail:function(){
        wx.hideLoading();
      }
    });
  },
  onTopicLike: function(){
    clearTimeout(timeOut);
    var topicInfo = this.data.topicInfo, like = this.data.topicInfo.like;
    topicInfo.like = !like;
    topicInfo.upNums = like ? topicInfo.upNums - 1 : topicInfo.upNums + 1;
    this.setData({
      topicInfo
    })
    timeOut = setTimeout(()=>{
      wx.request({
        url: like ? URL.topicUnLike : URL.topicLike,
        data: {
          companyId: this.data.companyId,
          topicId: this.data.topicInfo.topicId,
          userId: this.data.userId,
        },
        success: (res) => {

        },
        fail: (res) => {

        }
      })
    },1000)
  },

  onChangeType: function (e) {
    var handleType = e.currentTarget.dataset.type;
    if (handleType == 'act' || handleType == 'say'){
      this.setData({
        isSayShow: handleType == 'act'?false:true
      });
      if(handleType=='act'){
        this.setData({
          pageActNo:1,
          actList:[],
          handleType:'act'
        })
        this.getFanousActList();
      }
    }else{
      this.setData({
        handleType: handleType,
        allComPage: 1,
        myComPage: 1
      })
      this.getTopicComment(handleType, (list) => {
        this.changeList(list);
      });
    }
   
    
  },

  //获取评论
  getTopicComment: function (handleType, callback){
    var pageNo = handleType == "all" ? this.data.allComPage : this.data.myComPage;
    if (this.data.isGetting && pageNo > 1) return false;
    this.setData({
      isGetting: true
    })
    
    wx.request({
      url: handleType == 'all' ? URL.getTopicComment : URL.getTopicCommentWithMe,
      data: {
        page: pageNo,
        pageSize: 10,
        userId: this.data.userId,
        topicId: this.data.topicInfo.topicId,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        //this.createComment();
        if (res && res.data && res.data.success && res.data.data) {
          var list = [], isEnd = false;

          if (pageNo > 1){
            if (handleType == "all") {
              list = this.data.allList;
            } else {
              list = this.data.myList;
            }
          }
      
          res.data.data.map((item,index)=>{
            if (item.childList){
              item.childList.map((childItem,childIndex)=>{
                item.childList[childIndex].formatTime = this.formatTime(childItem.commentTime)
              })
            }
            item.formatTime = this.formatTime(item.commentTime)
            list.push(item)
          })

          if (res.data.data.length < 9) {
            isEnd = true
          }

          if (handleType == "all") {
            this.setData({
              allComPage: this.data.allComPage + 1,
              allList: list,
              isAllListEnd: isEnd
            })
            if(pageNo ==1){
              this.changeList(list);
            }
          } else {
            this.setData({
              myComPage: this.data.myComPage + 1,
              myList: list,
              isMyListEnd: isEnd
            })
          }
          callback && callback(list);
        }else{
          if (res.data.success && res.data.data == null){
            if (handleType == "all") {
              this.setData({
                isAllListEnd: true
              })
            } else {
              this.setData({
                isMyListEnd: true
              })
            }
          }
        }
        this.setData({
          isGetting: false
        })
      },
      fail: (msg) => {
        this.setData({
          isGetting: false
        })
      }
    })
  },

  changeList: function (newList) {
    var that = this;
    that.setData({
      commentList: newList,
    })
  },

  bindscrolltolower: function(e){
    if ((this.data.handleType == "all" && this.data.isAllListEnd ==false) ||
      (this.data.handleType == "my" && this.data.isMyListEnd == false)
    ) {
      //this.getTopicComment(this.data.handleType);
      this.getTopicComment(this.data.handleType, (list) => {
        this.changeList(list);
      });
    } else if (this.data.handleType =='act'){ 
      var pageActNo = this.data.pageActNo + 1;
      this.setData({
          pageActNo: pageActNo
      })
      this.getFanousActList();
    }
    
  },

  //输入评论的内容
  commentInput: function(e){
    this.setData({
      commentContent: e.detail
    })
  },

  //评论回复的内容
  replyCommentFun: function(e){
    var data = e.detail;
    this.setData({
      replyItem: data,
    })
  },

  showCommentTextarea: function(e){
    //console.log(e)
    this.setData({
      isCommentFocus: e.detail.isCommentFocus,
      isInputComment: e.detail.isInputComment
    })
  },

  createComment: function(e){
    //console.log(e)
    if (!this.data.commentContent) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      })
      return false;
    }
    if (this.data.isBtnClick) return false;
    this.setData({
      isBtnClick: true
    })

    wx.showLoading({
      title: '发表中...',
    })
    var data = Object.assign(this.data.replyItem,{
      topicId: this.data.topicInfo.topicId,
      companyId: this.data.companyId,
      commentContent: this.data.commentContent.replace(/  /g, "　"),
      userId: this.data.userId
    })
    
    //return false;
    wx.request({
      url: URL.createTopicComment,
      data: data,
      // data: {
      //   commentContent: '对第一条评论进行评论',
      //   userId: this.data.userId,
      //   topicId: this.data.topicInfo.topicId,
      //   companyId: this.data.companyId,
      //   commentPid: 69,
      //   commentOneId: 66,
      //   replyUserId: 1784281
      // },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading();
        if (res && res.data && res.data.success && res.data.data) {
          var commentItem = Object.assign(data, {
            commentId: res.data.data.commentId,
            formatTime: '刚刚',
            commentTime: new Date().getTime(),
            like: false,
            userImage: app.globalData.userInfo.image,
            userNicename: app.globalData.userInfo.nickName,
          })

          var list = [...this.data.commentList], newList = [];

          if (e.detail.subCommentIndex > -1) {
            newList = list[e.detail.commentIndex].childList ? list[e.detail.commentIndex].childList : [];
            list[e.detail.commentIndex].childList = [commentItem].concat(newList);
          } else if (e.detail.commentIndex > -1) {
            newList = list[e.detail.commentIndex].childList ? list[e.detail.commentIndex].childList : [];
            list[e.detail.commentIndex].childList = [commentItem].concat(newList);
          } else {
            list = [commentItem].concat(list);
          }

          var topicInfo = this.data.topicInfo;
          topicInfo.commentNums = parseInt(topicInfo.commentNums) + 1;
          this.setData({
            commentList: list,
            commentContent: '',
            isInputComment: false,
            isCommentFocus: false,
            topicInfo: topicInfo,
            isBtnClick: false
          })
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          })
          this.scrollToView();
        }else{
          this.setData({
            isBtnClick: false
          })
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg || '评论失败',
          })
        }
      },
      fail: (msg) => {
        this.setData({
          isBtnClick: false
        })
      }
    })
  },

  formatTime: function(t){
    var curTime = (new Date()).getTime();
    var time = curTime - t;
    var min = Math.round(time / (60 * 1000));
    if(min >= 60 * 24){
      min = parseInt(min / 60 / 24) + '天前';
    }else if(min >= 60){
      min = parseInt(min / 60) + '小时前';
    }else{
      if(min < 1){
        min = '刚刚'
      }else{
        min = min + '分钟前'
      }
    }
    return min;
  },

  //导航到详情信息页面
  toDetailMsg:function(e){
    wx.setStorage({
      key: 'famousInfo',
      data: this.data.famousInfo,
      success:(res)=>{
        wx.navigateTo({
          url: '/pages/topic/famous/introduce/introduce'
        })
      }
    })
  },

  //导航到专属信箱页面
  toLetterBox:function(e){
    this.setData({
      allComPage: 1,
      myComPage: 1
    })
    this.getTopicComment(this.data.handleType, (list) => {
      this.changeList(list);
    });
    wx.navigateTo({
      url: '/pages/topic/famous/letterlist/letterlist?companyId=' + this.data.companyId,
    })
  },

  //写信给ta
  toWrite:function(e){
    if (isBtnClick) return false;
    isBtnClick = true;
    wx.request({
      url: URL.checkFamousPower,
      data:{
        companyId: this.data.companyId,
        userId: this.data.userId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res)=>{
        if(res.data && res.data.success){
          wx.setStorage({
            key: 'famousLetter',
            data: { targetUserId: this.data.companyId },
            success: (res) => {
              this.setData({
                allComPage: 1,
                myComPage: 1
              })
              this.getTopicComment(this.data.handleType, (list) => {
                this.changeList(list);
              });
              wx.navigateTo({
                url: '/pages/msg/editor/editor',
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg || '网络错误',
          })
        }
        isBtnClick = false;
      },
      fail: (res)=>{
        isBtnClick = false;
      }
    })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.famousInfo.famousName + '',
      path: '/pages/topic/famous/detail/detail?companyId=' + this.data.companyId,
      imageUrl: this.data.famousInfo.famousHeardUrl,
      complete: function (res) {}
    }
  },
  //图片放大效果
  onMaxImg: function (e) {
    var that = this;
    var nowImgUrl = e.target.dataset.src, imgArry = [];
    imgArry.push(nowImgUrl);
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: imgArry // 需要预览的图片http链接列表
    })
  },
  //跳转至活动详情
  goActDetail:function(e){
    wx.setStorage({
      key: 'actParam',
      data: {
        actId: e.currentTarget.dataset.item.activitiesId,
        userId:this.data.userId
      },
      success:function(){
        wx.navigateTo({
          url: '../actdetail/actdetail?actId=' + e.currentTarget.dataset.item.activitiesId,
        })
      }
    }) 
  }
})