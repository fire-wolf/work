var app = getApp(), URL = app.globalData.URL;
var timeOut = null, isBtnClick = false;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    commentList: {
      type: Array,
      value: [],
    },
    userId: {
      type: Number,
      value: 0
    },
    commentContent: {
      type: String,
      value: ''
    },
    isInputComment: {
      type: Boolean,
      value:false
    },
    isCommentFocus: {
      type: Boolean,
      value: false
    }

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    commentIndex: -1,
    commentIndex2: -1,
    subCommentIndex: -1,
    removeId: '',
    isIphoneX: app.globalData.isIphoneX,
    // isInputComment: false,
    //isCommentFocus: false
  },

  attached: function () {
    //this.init()
    setTimeout(() => {
      app.login(function () {
        //console.log(app.globalData.userInfo)
      })
    }, 500)
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */


  methods: {
    /*
     * 公有方法
     */

    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _onLike: function(e){
      console.log(e)
      var list = [...this.data.commentList], data = e.currentTarget.dataset;
      var like = list[data.index].like;
      list[data.index].like = !like;
      timeOut = setTimeout(() => {
        wx.request({
          url: like ? URL.onFamousCommentUnLike : URL.onFamousCommentLike,
          data: {
            commentId: list[data.index].commentId,
            topicId: list[data.index].topicId,
            userId: this.data.userId,
          },
          success: (res) => {
            
          },
          fail: (res) => {
            console.log(res)
          }
        })
      }, 1000)
      this.triggerEvent('resetData', list);
    },

    //点击评论
    _onClickComment: function(e){
      //console.log(e);
      wx.setStorage({
        key: 'moreComment',
        data: {
          comment: e.currentTarget.dataset.item,
          index: e.currentTarget.dataset.commentindex,
        },
        success: (res)=>{
          wx.navigateTo({
            url: '/pages/topic/famous/morecomment/morecomment',
          })
        }
      })
      // clearTimeout(timeOut);
      // this.setData({
      //   commentIndex: e.currentTarget.dataset.commentindex,
      //   commentIndex2: e.currentTarget.dataset.commentindex,
      //   subCommentIndex: e.currentTarget.dataset.subcommentindex
      // })
      // timeOut = setTimeout(()=>{
      //   this.setData({
      //     commentIndex: -1,
      //   })
      // },3000)
    },

    //点击复制 或 回复
    _onCopy: function(e){
      console.log(e)
      var data = e.currentTarget.dataset;
      clearTimeout(timeOut);
      if (data.replyuserid == this.data.userId){ //复制
        wx.setClipboardData({
          data: data.content,
          success: (res)=> {
            this.setData({
              commentIndex: -1,
            })
          }
        })
      }else{ //回复
        var comData = {
          commentPid: data.parentid,
          commentOneId: data.oneid,
          replyUserId: data.replyuserid,
          replyNicename: data.nsernicename
        }
        this.setData({
          commentIndex: -1,
        })
        this.triggerEvent("replyCommentFun", comData);
        this._showCommentTextarea();
      }
    },

    _onClickCommentBtn: function(){
      this.setData({
        commentIndex: -1,
        commentIndex2: -1,
        subCommentIndex: -1
      })
      this.triggerEvent("replyCommentFun", {});
      this._showCommentTextarea();
    },

    _showCommentTextarea: function (e) {
      if (isBtnClick) return false;
      isBtnClick = true;
      app.login((data) => {
        if (app.globalData.isLogin) {
          app.globalData.cacheUrl = '';
          // this.setData({
          //   isInputComment: true,
          //   isCommentFocus: true
          // })
          this.triggerEvent("showCommentTextarea", { isInputComment: true, isCommentFocus: true});
          isBtnClick = false;
        } else {
          app.globalData.cacheUrl = "/pages/topic/famous/comeditor/comeditor"
          wx.navigateTo({
            url: "/pages/login/login",
            success: () => {
              setTimeout(() => {
                isBtnClick = false;
              }, 2000);
            },
            fail: () => {
              isBtnClick = false;
            }
          })
        }
      })
    },

    _commentBlur: function (e) {
      // this.setData({
      //   isInputComment: false,
      //   isCommentFocus: false
      // })
      this.triggerEvent("showCommentTextarea", { isInputComment: false, isCommentFocus: false });
    },

    _commentInput: function (e) {
      this.triggerEvent('commentInput', e.detail.value);
    },

    _createComment: function(e){
      this.triggerEvent("createComment", { commentIndex: this.data.commentIndex2, subCommentIndex: this.data.subCommentIndex});
    },

    //删除评论
    _onRemove: function (e) {
      var data = e.currentTarget.dataset;
      var commentIndex = this.data.commentIndex;
      var subCommentIndex = this.data.subCommentIndex;
      clearTimeout(timeOut);
      if (data.replyuserid == this.data.userId) { //删除
        this.setData({
          commentIndex: -1,
          removeId: data.commentid
        })
        wx.showModal({
          title: '提示',
          content: '删除此评论后，所有回复都会被删除。',
          confirmText: '删除评论',
          confirmColor: '#69BF30',
          cancelColor: '#69BF30',
          success: (res) => {
            if (res.confirm) {
              new Promise((resolve, reject) => {
                wx.request({
                  url: URL.removeTopicComment,
                  data: {
                    commentId: data.commentid,
                    userId: this.data.userId,
                  },
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: (res) => {
                    resolve(res);
                  },
                  fail: (msg) => {
                    reject(msg);
                  }
                })
              }).then((res) => {
                var list = this.data.commentList;
                if (subCommentIndex > -1) {
                  var subList = list[commentIndex].childList;
                  subList.splice(subCommentIndex, 1);
                  list[commentIndex].childList = subList;
                } else {
                  list.splice(commentIndex, 1);
                }
                this.setData({
                  commentList: list
                })
                this.triggerEvent('resetData', list);
              }).catch((res) => {

              })
            }
          }
        })
      } else { //举报
        this.setData({
          commentIndex: -1,
        })
        wx.navigateTo({
          url: '/pages/report/report?sourceId=' + data.commentid,
        })
      }
    },

    _removeComment: function () {
      wx.request({
        url: URL.removeTopicComment,
        data: {
          commentId: 53,
          userId: this.data.userId,
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {

        },
        fail: (msg) => {

        }
      })
    },
  }
})