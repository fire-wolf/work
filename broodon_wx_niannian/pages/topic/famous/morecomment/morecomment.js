var app = getApp(), URL = app.globalData.URL;
var timeOut = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    userImage: '',
    userNicename: '',
    commentInfo: {
      like: false
    },
    commentInfoIndex: -1,
    commentContent: '',
    isInputComment: false,
    isCommentFocus: false,
    isBtnClick: false,
    replyItem: {},
    placeholder: '发表评论',
    yunMediaRoot: URL.yunMediaRoot,
    isIphoneX: app.globalData.isIphoneX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userInfo.userId
    })
    wx.getStorage({
      key: 'moreComment',
      success: (res) => {
        //console.log(res)
        this.setData({
          commentInfo: res.data.comment,
          commentInfoIndex: res.data.index,
        })
      },
    })
  },

  onClickCommentBtn: function () {
    this.setData({
      isInputComment: true,
      isCommentFocus: true,
      replyItem: {
        commentPid: this.data.commentInfo.commentId,
        commentOneId: this.data.commentInfo.commentId,
        replyUserId: this.data.commentInfo.userId,
        replyNicename: this.data.commentInfo.userNicename
      },
      placeholder: '发表评论'
    })
  },

  commentInput: function (e) {
    this.setData({
      commentContent: e.detail.value
    })
  },

  commentBlur: function (e) {
    this.setData({
      isInputComment: false,
      isCommentFocus: false
    })
  },

  //点击评论弹出评论输入框
  onClickComment: function(e){
    console.log(e)
    var data = e.currentTarget.dataset.item;
    if (data.userId == this.data.userId) {
      this.setData({
        isInputComment: false,
        isCommentFocus: false,
      })
    }else{
      this.setData({
        replyItem: {
          commentPid: data.commentId,
          commentOneId: data.commentOneId ? data.commentOneId : data.commentId,
          replyUserId: data.userId,
          replyNicename: data.userNicename
        },
        isInputComment: true,
        isCommentFocus: true,
        placeholder: '@' + data.userNicename
      })
    }
  },
  
  //提交评论
  createComment: function (e) {
    if (!this.data.commentContent){
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
    var data = Object.assign(this.data.replyItem, {
      topicId: this.data.commentInfo.topicId,
      companyId: this.data.commentInfo.companyId,
      commentContent: this.data.commentContent.replace(/  /g, "　"),
      userId: this.data.userId
    })

    wx.request({
      url: URL.createTopicComment,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading();
        if (res && res.data && res.data.success && res.data.data) {
          var list = this.data.commentInfo.childList ? this.data.commentInfo.childList : [];
          var commentItem = res.data.data;
          commentItem.formatTime = '刚刚';
          commentItem.userImage = /^http/.test(commentItem.userImage) ? commentItem.userImage : URL.yunMediaRoot + commentItem.userImage;
          list.unshift(commentItem);
          var newList = [];
          list.map((item, index) => {
            item.formatTime = this.formatTimeFun(item.commentTime)
            newList.push(item)
          })

          var commentInfo = this.data.commentInfo;
          commentInfo.childList = newList;
          commentInfo.formatTime = this.formatTimeFun(commentInfo.commentTime);
          this.setData({
            commentInfo,
            commentContent: '',
            isInputComment: false,
            isCommentFocus: false,
            isBtnClick: false
          })
          wx.showToast({
            title: '评论成功',
            icon: 'success'
          })
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 400
          });
          this.updata();
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
        wx.showToast({
          title: '评论失败',
          icon: 'none'
        })
      }
    })
  },

  //点赞
  onLike: function () {
    clearTimeout(timeOut);
    var commentInfo = this.data.commentInfo, like = this.data.commentInfo.like;
    commentInfo.like = !like;
    this.setData({
      commentInfo
    })
    timeOut = setTimeout(() => {
      wx.request({
        url: like ? URL.onFamousCommentUnLike : URL.onFamousCommentLike,
        data: {
          commentId: commentInfo.commentId,
          topicId: commentInfo.topicId,
          userId: this.data.userId,
        },
        success: (res) => {
          this.updata();
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }, 1000)
  },

  //删除评论
  removeComment: function (e) {
    var data = e.currentTarget.dataset;
    if (data.userid == this.data.userId){ //删除
      var msg = '';
      if (data.commentid == this.data.commentInfo.commentId){ //点击的是主评论
        msg = '删除此评论后，所有回复都会被删除。';
      } else { //点击的是二级评论
        msg = '确定删除此回复吗？';
      }
      wx.showModal({
        title: '提示',
        content: msg,
        confirmText: '删除评论',
        confirmColor: '#69BF30',
        cancelColor: '#69BF30',
        success: (res) => {
          if (res.confirm) {
            this.removeCommentFun({
              commentId: data.commentid,
              userId: this.data.userId,
            },data.index);
          }
        }
      })
    }else{ //举报
      wx.navigateTo({
        url: '/pages/report/report?sourceId=' + data.commentid,
      })
    }
  },

  removeCommentFun: function(data,index){
    wx.request({
      url: URL.removeTopicComment,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        var commentInfo = this.data.commentInfo;
        if(index > -1){
          var list = commentInfo.childList;
          list.splice(index,1);
          commentInfo.childList = list;
          this.setData({
            commentInfo
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          this.updata();
        }else{
          commentInfo = null;
          this.setData({
            commentInfo
          })
          this.updata(() => {
            wx.navigateBack({});
          })
        }
        
        // wx.setStorage({
        //   key: 'moreComment',
        //   data: {
        //     comment: commentInfo,
        //     index: this.data.commentInfoIndex,
        //   },
        //   success: (res) => {
        //     this.updata(()=>{
        //       wx.navigateTo({
        //         url: '/pages/famous/morecomment/morecomment',
        //       })
        //     })
        //   }
        // })
      },
      fail: (msg) => {

      }
    })
  },

  //重新存储数据，用于返回上一页更新评论
  updata: function(callback){
    wx.setStorage({
      key: 'moreComment',
      data: {
        comment: this.data.commentInfo,
        index: this.data.commentInfoIndex,
      },
      success: (res) => {
        callback && callback();
      }
    })
  },

  formatTimeFun: function (t) {
    var curTime = (new Date()).getTime();
    var time = curTime - t;
    var min = Math.round(time / (60 * 1000));
    if (min >= 60 * 24) {
      min = parseInt(min / 60 / 24) + '天前';
    } else if (min >= 60) {
      min = parseInt(min / 60) + '小时前';
    } else {
      if (min < 1) {
        min = '刚刚'
      } else {
        min = min + '分钟前'
      }
    }
    return min;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})