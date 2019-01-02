
import Utils from '../../../../utils/util.js'
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    companyId: '',
    msgType: 'common', //activity  common
    handleType: 'send', //receive  send ta的公开信  receive 我的信函
    list: [], 
    pageNo: 1,
    pageSize: 10,
    isEnd: false,
    sendList: [],
    receiveList: [],
    fansList:[],
    sendPage:1,
    sendEnd: false,
    receivePage:1,
    receiveEnd: false,
    fansPage:1,
    fansEnd:false,
    isLoading: false,
    firstLoad: false,
    loadingTxt: '一书一知己，一信一世界',
    textList: ['一书一知己，一信一世界', '尺素如残雪，结为双鲤鱼', '江水三千里，家书十五行', '乡书何处达，归雁洛阳边'],
    mainHt: '100%',
    scrollTop: 0,
    scrollTopSend: 0,
    scrollTopReceive: 0,
    scrollTopFans:0,
    yunMediaRoot: URL.yunMediaRoot,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userId: app.globalData.userInfo.userId,
      companyId: options.companyId
    })
    this.getChangeHeight();
    // this.getList("send");
    // this.getList("receive");
    this.updataFun();
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
    } else if (this.data.handleType == "fans"){
      this.setData({
        scrollTopFans: e.detail.scrollTop
      })
    }else{
      this.setData({
        scrollTopSend: e.detail.scrollTop
      })
    }
  },

  onShow: function(){
    //this.updataFun();
  },

  updataFun: function(){
    if (this.data.handleType == "receive") {
      this.setData({
        receivePage: 1,
        receiveList: [],
        receiveEnd: false
      })
      //this.getList(this.data.handleType);
    } else {
      this.setData({
        sendPage: 1,
        sendList: [],
        sendEnd: false
      })
    }
    this.getList("send");  
   
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
    } else  {
      this.setData({
        sendPage: 1,
        sendList: [],
        sendEnd: false
      })
      this.getList("send");
    }
  },

  bindscrolllower: function(e){
    //this.getList(this.data.handleType);
    if ((this.data.handleType == "send" && this.data.sendEnd == false) ||
      (this.data.handleType == "receive" && this.data.receiveEnd == false) || 
      (this.data.handleType == "fans" && this.data.fansEnd == false)
    ) {
      this.getList(this.data.handleType);
    }
  },

  getList: function (handleType,callback){
    var that = this;
    var pageNo = this.data.pageNo, url = '',data = {};
    if (pageNo <=1){
      that.setData({
        isLoading: true
      })
       
    }
    if (handleType == "send"){
      pageNo = this.data.sendPage;
      url = URL.getFamousPublicList;
      data = {
        companyId: that.data.companyId,
        page: pageNo,
        pageSize: that.data.pageSize,
      }
    } else if (handleType == "fans") {
      pageNo = this.data.fansPage;
      url = URL.getFamousFansPublicList;
      data = {
        companyId: that.data.companyId,
        page: pageNo,
        pageSize: that.data.pageSize,
      }
    } else{
      pageNo = this.data.receivePage; 
      url = URL.getFamousMsgList;
      data = {
        companyId: that.data.companyId,
        page: pageNo,
        pageSize: that.data.pageSize,
        userId: that.data.userId
      }
    }

    wx.request({
      url: url,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: data,
      success: function (res) {
        //console.log(res)
        if (res.data.success == true && res.data.data){
          var list = [],newList = [], isEnd = false;
          res.data.data.map(function(item){
            if (item.letterId){
              newList.push(Object.assign(item,{
                createTime: Utils.formatTime5(new Date(item.createTime)),
                sendUserArea: item.userArea && item.userArea.indexOf('未知') > -1 ? '' : item.userArea ? ('. ' + item.userArea.replace(/-/g,'')) : '',
                left: 0,
              })
            )}
          })
          if (res.data.data.length < 9) {
            isEnd = true
          }
          if (handleType == "send") {
            list = [...that.data.sendList, ...newList]
            that.setData({
              sendEnd: isEnd,
              sendList: list,
              sendPage: that.data.sendPage + 1,
              list: list,
              pageNo: that.data.sendPage + 1,
              loadingTxt: that.data.textList[parseInt(Math.random() * 4)],
            })
          } else if (handleType == "fans") {
            list = [...that.data.fansList, ...newList]
            that.setData({
              fansEnd: isEnd,
              fansList: list,
              fansPage: that.data.fansPage + 1,
              list: list,
              pageNo: that.data.fansPage + 1,
              loadingTxt: that.data.textList[parseInt(Math.random() * 4)],
            })
          } else {
            list = [...that.data.receiveList,...newList]
            that.setData({
              receiveEnd: isEnd,
              receiveList: list,
              receivePage: that.data.receivePage + 1,
              list: list,
              pageNo: that.data.receivePage + 1,
              loadingTxt: that.data.textList[parseInt(Math.random() * 4)]
            })
          }
          setTimeout(function () {
            that.setData({
              firstLoad: false
            }) 
          }, 1300);

          //that.changeList()
          //在我的列表，有部分信件是自己发给自己的信，不显示在我收到的列表，故第一屏可能会出现数据没铺满的情况
          if (list.length < 6 && res.data && res.data.data.length >= that.data.pageSize - 1){
            that.getList(handleType);
          }
        }
        callback && callback();
        wx.hideLoading();
        setTimeout(function () {
          that.setData({
            isLoading: false
          })
        }, 1000)
        // if (handleType == "send" && pageNo <= 1) {
        //   setTimeout(function () {
        //     that.setData({
        //       isLoading: false,
        //     })
        //     //wx.hideLoading();
        //   }, 1000)
        // }
        //that.changeList();
      },
      fail: function(msg){
        that.setData({
          isLoading: false
        })
        wx.hideLoading();
        callback && callback();
      }
    })
  }, 

  // 改变信件类型
  onChangeType: function(e) {
    var that = this,list = this.data.sendList, scrollTop = this.data.scrollTopSend;
    this.setData({
      list: [],
      pageNo: 1
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if (e.target.dataset.type == "receive"){
      list = this.data.receiveList;
      scrollTop = this.data.scrollTopReceive; 
      if (!(list && list.length > 0)) {
        this.getList("receive", function () { 
            that.setData({
              handleType: e.target.dataset.type
            }) 
          
        });
        return false;
      }
    }else if(e.target.dataset.type=='fans'){
      list = this.data.fansList;
      scrollTop = this.data.scrollTopFans;
      if(!(list && list.length>0)){
        this.getList("fans",function(){ 
            that.setData({
              handleType: e.target.dataset.type
            }) 
        });
        return false;
      }
    }
    this.setData({
      list: list,
      scrollTop: scrollTop,
      handleType: e.target.dataset.type
    });
    setTimeout(function(){
      wx.hideLoading();
    },1000);    
  },

  //删除信件
  removeMsg: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var letterId = e.currentTarget.dataset.id;
    var list = this.data.list;
    wx.showModal({
      title: '温馨提示',
      content: '确定删除信函？',
      success: function (respon) {
        if (respon.confirm) {
          //console.log('用户点击确定')
          wx.request({
            url: URL.removeFamousMsg,
            data: {
              userId: that.data.userId,
              letterId: e.currentTarget.dataset.id
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if(res.data.success == true){
                list.splice(index, 1);
                if (that.data.handleType == 'send'){
                  that.setData({
                    list,
                    sendList: list
                  })
                } else if (that.data.handleType == 'fans') {
                  that.setData({
                    list,
                    fansList: list
                  })
                }else{
                  that.setData({
                    list,
                    receiveList: list
                  })
                }
                
                if (list.length < 5) {
                  that.getList(that.data.handleType);
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
      url: "/pages/msg/msgdetail/msgdetail?msgId=" + data.id + "&famous=1",
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

  toWrite: function (e) {
    if (isBtnClick) return false;
    isBtnClick = true;
    wx.request({
      url: URL.checkFamousPower,
      data: {
        companyId: this.data.companyId,
        userId: this.data.userId
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data && res.data.success) {
          wx.setStorage({
            key: 'famousLetter',
            data: { targetUserId: this.data.companyId },
            success: (res) => {
              wx.navigateTo({
                url: '/pages/msg/editor/editor',
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg || '网络错误',
          })
        }
        isBtnClick = false;
      },
      fail: (res) => {
        isBtnClick = false;
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
    if (this.data.handleType == 'send' || this.data.handleType == 'fans') return false;
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
      }else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
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
    if (this.data.handleType == 'send' || this.data.handleType == 'fans') return false;
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