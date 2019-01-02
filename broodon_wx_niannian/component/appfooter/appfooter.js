
var app = getApp(), URL = app.globalData.URL;
var isBtnClick = false;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    list: {
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [
        {
          index: 0,
          text: '探索',
          isActive: false,
          openType: 'redirectTo',
          url: '/pages/find/find', 
          iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-find1.png'
        },
        {
          index: 1,
          text: '写信',
          isActive: false,
          openType: 'navigateTo',
          url: '/pages/msg/begin/begin',
          iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-write.png'
        },
        {
          index: 2,
          text: '我的',
          isActive: false,
          openType: 'redirectTo',
          url: '/pages/tabBar/mine/index',
          iconPath: URL.yunMediaRoot +'niannianyun/wx/images/tab-icon/icon-my.png'
        },
      ]
    },
    firstWrite: {
      type: Boolean,
      value: app.globalData.firstWrite
    },
    isIphoneX: {
      type: Boolean,
      value: app.globalData.isIphoneX
    },
    isBtnClick: {
      type: Boolean,
      value: app.globalData.isBtnClick
    }

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    isAuthor:true
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
    go: function (e) {
      var that = this, info = e.currentTarget.dataset.info, tt = null;

      wx.removeStorage({ //删除在信函详情页存储的回信操作信息
        key: 'writeBack',
        success: function (res) { },
      })

      if (isBtnClick || info.index == 0 || (!e.detail.userInfo) || info.openType=='none') {
        clearTimeout(tt);
        tt = setTimeout(function () { isBtnClick = false; }, 3000);
        return false;
      }

      isBtnClick = true;
      if (app.globalData.userInfo && app.globalData.userInfo.openId){ 
        app.toNavigate(info.openType,info.url,function(){
          setTimeout(function () {
            isBtnClick = false;
          }, 100);
        });
        return false;
      }
      app.login(function (data) { 
        app.toNavigate(info.openType, info.url,function(){
          setTimeout(function () {
            isBtnClick = false;
          }, 100);
        });
        // console.log(data);
        // console.log(app.globalData.isLogin);
        // app.globalData.cacheUrl = info.url;
        // if (app.globalData.isLogin) {
        //   app.globalData.hisUrl = '';
        //   if (info.isActive != true) {
        //     if (info.openType == 'redirectTo') {
        //       wx.redirectTo({
        //         url: info.url,
        //         success: function () {
        //           setTimeout(function () {
        //             isBtnClick = false;

        //           }, 100);
        //         }
        //       })
        //     } else {
        //       wx.navigateTo({
        //         url: info.url,
        //         success: function () {
        //           setTimeout(function () {
        //             isBtnClick = false;

        //           }, 100);
        //         }
        //       })
        //     }
        //   } else {
        //     isBtnClick = false;
        //   }
        // } else {
        //   app.globalData.hisUrl = "/pages/find/find";
        //   wx.navigateTo({
        //     url: "../../pages/login/login",
        //     success: function () {
        //       setTimeout(function () {
        //         isBtnClick = false;
        //       }, 1000);
        //     }
        //   })
        // }
      });


    }
  }
})