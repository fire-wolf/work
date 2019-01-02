
import Utils from '../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    msgType: 'common', //activity  common
    handleType: 'send', //receive
    list: [
      
    ],
    pageNo: 1,
    pageSize: 10,
    isEnd: false,
    sendList: [],
    receiveList: [],
    sendPage:1,
    sendEnd: false,
    receivePage:1,
    receiveEnd: false,
    isLoading: false,
    firstLoad: true,
    loadingTxt: '一书一知己，一信一世界',
    textList: ['一书一知己，一信一世界', '尺素如残雪，结为双鲤鱼', '江水三千里，家书十五行', '乡书何处达，归雁洛阳边'],
    mainHt: '100%',
    scrollTop: 0,
    scrollTopSend: 0,
    scrollTopReceive: 0,
    yunMediaRoot: URL.yunMediaRoot,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getChangeHeight();
    wx.getStorage({
      key: 'msg-type',
      success: function(res) {
        that.setData({
          //list: that.data.sendList,
          msgType: res.data,
          userId: app.globalData.userInfo.userId
        })
        if(res.data=='common'){
          wx.setNavigationBarTitle({
            title: "普通信函"
          });
        }else{
          wx.setNavigationBarTitle({
            title: "活动信函"
          });
        }
        //that.getMySendMsg();
        that.getList("send");
        that.getList("receive");
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  bindscroll: function(e){
    if (this.data.handleType == "receive") {
      this.setData({
        scrollTopReceive: e.detail.scrollTop
      })
    }else{
      this.setData({
        scrollTopSend: e.detail.scrollTop
      })
    }
  },

  bindscrolltoupper: function () {
    return false;
    if (this.data.handleType == "receive") {
      this.setData({
        receivePage: 1,
        receiveList: [],
        receiveEnd: false
      })
      this.getList("receive");
    } else {
      this.setData({
        sendPage: 1,
        sendList: [],
        sendEnd: false
      })
      this.getList("send");
    }
  },

  bindscrolllower: function(e){
    if ((this.data.handleType == "send" && this.data.sendEnd == false) ||
      (this.data.handleType == "receive" && this.data.receiveEnd == false)
     ){
      this.getList(this.data.handleType);
    }
  },

  getMySendMsg: function(){
    var that = this;
    if (this.data.isLoading == true) return false;
    this.setData({
      isLoading: true
    })
    wx.request({
      url: URL.getMySendMsg,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        page: that.data.pageNo,
        pageSize: that.data.pageSize,
        userId: that.data.userId
      },
      success: function (res) {
       
        if (res.data && res.data.success == true && res.data.data && res.data.data.length>0) {
          var list = [], isEnd = false;
          if (res.data.data.length < 9) {
            isEnd = true
          }
          res.data.data.map(function (item) {
            list.push({
              salutation: item.salutation,
              enveLope: item.enveLope,
              msgId: item.msgId,
              receiveUserid: item.receiveUserid,
              sendUserid: item.sendUserid,
              createTime: Utils.formatTime2(new Date(item.createTime)),
              status: item.status,
              left: 0,
            })
          })
          that.setData({
            isEnd,
            list: [...that.data.list, ...list],
            isLoading: false,
            pageNo: that.data.pageNo + 1
          })
        }
      },
      fail: function(msg){
        console.log(msg)
        that.setData({
          isLoading: false,
        })
      }
    })
  },

  //URL.getMsgList 包含app数据 v1.2与app数据打通
  getList: function (handleType){
    var that = this;
    var pageNo = handleType == "send" ? this.data.sendPage : this.data.receivePage;
    if (handleType == "send" && pageNo <=1){
      that.setData({
        isLoading: true
      })
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request({
      url: URL.getMsgList,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        page: pageNo,
        pageSize: that.data.pageSize,
        dataType: that.data.msgType,
        msgType: handleType,
        userId: that.data.userId
      },
      success: function (res) {
        //console.log(res)
        if (res.data.success == true && res.data.data){
          var list = [],newList = [], isEnd = false;
          res.data.data.map(function(item){
            if (item.msgId && (handleType != 'receive' || (handleType == 'receive' && that.data.userId != item.sendUserid))){
              newList.push({
                salutation: item.salutation,
                enveLope: item.enveLope,
                msgId: item.msgId,
                receiveUserid: item.receiveUserid,
                sendUserid: item.sendUserid,
                createTime: Utils.formatTime2(new Date(item.createTime)),
                status: item.status,
                childType: item.childType,
                msgType: item.msgType,
                left: 0,
              })
            }
          })
          if (res.data.data.length < 9) {
            isEnd = true
          }
          
          if (handleType == "send") {
            //list = that.data.sendList.concat(newList)
            list = [...that.data.sendList, ...newList]
            that.setData({
              sendEnd: isEnd,
              sendList: list,
              sendPage: that.data.sendPage + 1,
              loadingTxt: that.data.textList[parseInt(Math.random() * 4)],
            })
          } else {
            //list = that.data.receiveList.concat(newList)
            list = [...that.data.receiveList,...newList]
            that.setData({
              receiveEnd: isEnd,
              receiveList: list,
              receivePage: that.data.receivePage + 1,
              loadingTxt: that.data.textList[parseInt(Math.random() * 4)]
            })
          }
          that.changeList()
          //在我收到的列表，有部分信件是自己发给自己的信，不显示在我收到的列表，故第一屏可能会出现数据没铺满的情况
          if (list.length < 6 && res.data && res.data.data.length >= that.data.pageSize - 1){
            that.getList(handleType);
          }
        }
        if (handleType == "send" && pageNo <= 1) {
          setTimeout(function () {
            that.setData({
              isLoading: false,
              
            })
            wx.hideLoading();
          }, 1000)
        }
      },
      fail: function(msg){
        that.setData({
          isLoading: false
        })
        wx.hideLoading();
      }
    })
  },

  changeList: function(){
    var that = this;
    var list = this.data.sendList;
    if (this.data.handleType == "receive") {
      list = this.data.receiveList
    }
    setTimeout(function () {
      that.setData({
        list: list,
      })
    }, 1000)
    setTimeout(function () {
      that.setData({
        firstLoad: false
      })
    }, 1300)

  },

  // 改变信件类型
  onChangeType: function(e) {
    var list = this.data.sendList, scrollTop = this.data.scrollTopSend;
    if (e.target.dataset.type == "receive"){
      list = this.data.receiveList;
      scrollTop = this.data.scrollTopReceive;
    }
    this.setData({
      list: list,
      scrollTop: scrollTop,
      handleType: e.target.dataset.type,
    })
  },

  //删除信件
  removeMsg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var msgId = e.currentTarget.dataset.id;
    var list = this.data.list;
    wx.showModal({
      title: '温馨提示',
      content: '确定删除信函？',
      success: function (respon) {
        if (respon.confirm) {
          //console.log('用户点击确定') 6214 8378 5637 8215
          wx.request({
            url: URL.removeMsg,
            data: {
              userId: that.data.userId,
              msgId: e.currentTarget.dataset.id
            },
            success: function (res) {
              if(res.data.success == true){
                list.splice(index, 1);
                if (that.data.handleType == 'send') {
                  that.setData({
                    list,
                    sendList: list
                  })
                } else {
                  that.setData({
                    list,
                    receiveList: list
                  })
                }

                if (list.length < 5) {
                  that.getMySendMsg()
                }
              }
            }
          })
        } else if (respon.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  goDetail: function(e){
    var that = this, data = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/msg/msgdetail/msgdetail?msgId=" + data.id,
      success: function(){
        if (that.data.handleType == "receive" && data.status == 2) {
          var list = [...that.data.receiveList];
          list[data.index].status = 1;
          that.setData({
            list,
            receiveList: list
          })
        }
      }
    })
  },

  touchStart: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list.map(function(item, idx){
      if(index != idx) {
        list[idx].left = 0
      }
    })
    this.setData({
      list,
      startX: e.touches[0].clientX,
    })
  },

  touchMove: function (e) {
    //console.log(e)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = 140 * app.globalData.sysInfo.screenWidth / 750;
      var txtStyle = "";

      if (disX == 0 || disX < delBtnWidth * -1) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "0px";
      } else if (disX < 0 && disX > delBtnWidth * -1) {
        txtStyle = "-" + disX + "px";
      }
      else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  

      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].left = txtStyle;
      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },

  touchEnd: function (e) {
    //console.log(e)
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = 140 * app.globalData.sysInfo.screenWidth / 750;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "-" + delBtnWidth + "px" : "0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index
      var list = this.data.list;
      list[index].left = txtStyle;

      //更新列表的状态  
      this.setData({
        list: list
      });
    }
  },

  getChangeHeight: function () {
    var that = this;
    that.setData({
      mainHt: (app.globalData.sysInfo.windowHeight - app.globalData.sysInfo.windowWidth / 750 * 94) + 'px'
    })
  },

})