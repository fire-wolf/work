var app = getApp(), URL = app.globalData.URL;
var timeOut = null;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    cancelText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "删除"
    },
    content: {
      type: String,
      value: "删除此评论后，所有回复都会被删除。"
    }

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    commentindex: -1,
    subCommentIndex: -1,
    removeId: ''
  },

  attached: function () {
    //this.init()
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
      console.log([...this.data.commentList])
      this.triggerEvent('resetData', [...this.data.commentList].concat([...this.data.commentList]));
    },

    //点击评论
    _onClickComment: function(e){
      clearTimeout(timeOut);
      this.setData({
        commentIndex: e.currentTarget.dataset.commentindex,
        subCommentIndex: e.currentTarget.dataset.subcommentindex
      })
      timeOut = setTimeout(()=>{
        this.setData({
          commentIndex: -1,
        })
      },3000)
    },

    //点击复制 或 回复
    _onCopy: function(e){
      var data = e.currentTarget.dataset;
      clearTimeout(timeOut);
      if (data.id == this.data.userId){ //复制
        wx.setClipboardData({
          data: data.content,
          success: (res)=> {
            this.setData({
              commentIndex: -1,
            })
          }
        })
      }else{ //回复

      }
    },

    _onRemove: function(e){
      var data = e.currentTarget.dataset;
      clearTimeout(timeOut);
      if (data.id == this.data.userId) { //删除
        this.setData({
          commentIndex: -1,
          removeId: data.commentid
        })
      } else { //举报

      }
    }
  }
})