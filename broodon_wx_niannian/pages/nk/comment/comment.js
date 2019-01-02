var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    commList:[],
    isComment:true,
    txtValue:null,
    mainHeight:'', 
    targetUserId:null,
    isLoadingDown:false,
    curUserId:"",
    showModal: false,
    replyId: '',
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    if(options.msgId){
      that.setData({
        msgId:options.msgId,
        targetUserId: options.targetUserId,
        curUserId: (app.globalData.userInfo && app.globalData.userInfo.userId) ? app.globalData.userInfo.userId:"", 
        mainHeight: app.globalData.sysInfo.screenHeight - 60
      });
       //that.getCommList(); 
     
    }
  },
  onShow:function(){ 
    var that = this;
    if (!this.data.curUserId){
        this.setData({
          curUserId: (app.globalData.userInfo && app.globalData.userInfo.userId) ? app.globalData.userInfo.userId : "", 
        })
      }
      
      wx.getStorage({
        key: 'nk-comment-success',
        success: function (res) {
          if (res.data) {
            wx.showToast({ title: '评论成功！', icon: "none" });
            wx.removeStorage({
              key: 'nk-comment-success',
              success: function (res) { },
            })
            that.setData({
              page: 1
            })
          }
          that.getCommList();
        },
        fail: function(res){
          that.getCommList(); 
        }
      })
  },
  getCommList:function(){
    var that = this, userId = (app.globalData.userInfo && app.globalData.userInfo.userId) ? app.globalData.userInfo.userId:"";
    if(that.data.page==1){
      that.setData({
        commList: []
      });
    }

    wx.request({
      url: URL.getNkComment,
      data: { msgId: that.data.msgId, userId: userId, page: that.data.page },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.data && res.data.data.list && res.data.data.list.length>0){
          var list = [];
          res.data.data.list.map(function (item) {
            item.content = item.content.replace(/  /g, "　")
            list.push(item)
          })
          if (that.data.commList && that.data.commList.length > 0 && that.data.page>1){
            that.setData({
              commList: that.data.commList.concat(list),
              isLoadingDown: false
            });
          }else{
            that.setData({
              commList: list,
              isLoadingDown: false
            });
          }
          
        }else{
          if(that.data.page==1){
            wx.navigateTo({
              url: "/pages/nk/list/list",
              success: function () {
              },
              fail: function () {
              }
            })
          }else{
            that.setData({
              isLoadingDown: true
            });
          }
         
        }
      },
      error: function (res) {
        console.log(res);
      }
    }); 
  },
  onScrollDown:function(e){
    if (this.data.isLoadingDown) return false;
    var that = this,page = that.data.page+1;
    this.setData({
      page:page
    });
    that.getCommList();

  },
  onScroll:function(e){
    this.setData({
      scrollTop: e.detail.scrollTop
    });
  },
  onComment:function(e){
      var that = this,types = e.target.dataset.attr;
      if(types=='open'){ 
        var hisUrl = "/pages/nk/comeditor/comeditor?msgId=" + that.data.msgId + "&targetUserId=" + that.data.targetUserId;
         
        wx.navigateTo({
          url: hisUrl,
          success: function () { 
          }
        })
      } else if(types=='submit'){
        if (e.detail.value==""){
          wx.showToast({ title: '请输入要评论的内容！', icon: "none" });
          return false;
        }
        wx.request({
          url: URL.sendNkcomment,
          data: { msgId: that.data.msgId, userId: app.globalData.userInfo.userId, targetUserId: that.data.targetUserId, content: e.detail.value },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            if (res.data && res.data.success){
              wx.showToast({ title: '评论成功！', icon: "none" });
              that.setData({
                isComment:false,
                txtValue: '',
                page:1
              });
              that.getCommList();
            }else{
              wx.showToast({ title: '评论失败！', icon: "none" })
            }
            
          },
          error: function (res) {
            wx.showToast({ title: '评论失败！', icon: "none" })
          }
        });         
      }else{
        that.setData({
          replyId: e.target.dataset.id,
          showModal: true
        })
        // wx.showModal({
        //   title: '提示', content: '确定要删除这条评论吗？', success: function (res) {
          
        //   if (res.confirm){
        //     var id = e.target.dataset.id, commList = that.data.commList;
          
        //       wx.request({
        //         url: URL.removeNkComment,
        //         data: { replyId: id, userId: app.globalData.userInfo.userId },
        //         header: {
        //           'Content-Type': 'application/json'
        //         },
        //         success: function (res) {
        //           if (res.data && res.data.success) {
        //             wx.showToast({ title: '删除成功！', icon: "none" })                    
        //             that.setData({
        //               commList: commList.filter(function (item) { return item.replyId != id; })
        //             }); 
        //             if (that.data.commList.length==0){
        //               wx.navigateBack({
                        
        //               })
        //             }
        //           } else {
        //             wx.showToast({ title: '删除失败！', icon: "none" })
        //           }

        //         },
        //         error: function (res) {
        //           wx.showToast({ title: '删除失败！', icon: "none" })
        //         }
        //       });
        //     }
        //   }
        // })
          
      }
  },
  removeComment: function(){
    var that = this;
    var id = that.data.replyId, commList = that.data.commList;

    wx.request({
      url: URL.removeNkComment,
      data: { replyId: id, userId: app.globalData.userInfo.userId },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.success) {
          that.setData({
            showModal: false,
            commList: commList.filter(function (item) { return item.replyId != id; })
          });
          wx.showToast({ title: '删除成功！', icon: "none" })
          if (that.data.commList.length == 0) {
            wx.navigateBack({

            })
          }
        } else {
          wx.showToast({ title: '删除失败！', icon: "none" })
        }

      },
      error: function (res) {
        wx.showToast({ title: '删除失败！', icon: "none" })
      }
    });
  },
  onCloseModal: function () {
    this.setData({
      showModal: false
    })
  },
  onChangeVal:function(e){
      this.setData({
        txtValue: e.detail.value
      })
  }
});