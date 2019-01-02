
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
          text: '卡券',
          isActive: false,
          openType: 'redirectTo',
          url: '/pages/find/find',
          iconPath: '../../images/tab-icon/icon-find1.png'
        },
        {
          text: '商家',
          isActive: false,
          openType: 'navigateTo',
          url: '/pages/seller/seller',
          iconPath: '../../images/tab-icon/icon-seller.png'
        },
        {
          text: '我的',
          isActive: false,
          openType: 'redirectTo',
          url: '/pages/my/my',
          iconPath: '../../images/tab-icon/icon-my.png'
        },
      ]
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
    targetUrl: ''
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
    handleClick: function (e) {
      var that = this, info = e.currentTarget.dataset.info, tt = null;
      that.setData({
        targetUrl: info.url
      })

      if (isBtnClick) {
        clearTimeout(tt);
        tt = setTimeout(function () { isBtnClick = false; }, 3000);
        return false;
      }
      isBtnClick = true;
      if (/pages\/seller\/seller/.test(info.url)) {
        that.go();
      }else{
        app.login(function (data) {

          if (info.isActive != true) {
            //console.log(app.globalData)
            if(app.globalData.isLogin) {
              that.triggerEvent("handleShowLogin", false);
              that.go();
            } else {
              that.triggerEvent("handleShowLogin", true);
              app.globalData.cacheFun = function () {
                that.go();
              };
              clearTimeout(tt);
              isBtnClick = false;
            }
          } else {
            clearTimeout(tt);
            isBtnClick = false;
          }
        });
      }
    },
    
    go: function(){
      var that = this,_data = {
        openId: app.globalData.userInfo.openId,
        userId: app.globalData.userInfo.userId,
      };
      var _url = URL.getMyLink, targetPage = '/pages/my/my'; //我的地址
      
      if (/pages\/seller\/seller/.test(this.data.targetUrl)) {
        _url = URL.getSellerLink; //商家地址
        targetPage = '/pages/seller/seller'
        _data = {}
      }
      //that.triggerEvent("handleShowLogin", false);
      wx.request({
        url: _url,
        data: _data,
        success: (res) => {
          if (res.data && res.data.data && res.data.success) {
            if (/pages\/seller\/seller/.test(that.data.targetUrl)) {
              app.globalData.sellerLink = res.data.data;
            }else{
              app.globalData.myLink = res.data.data;
            }
            wx.navigateTo({
              url: targetPage,
              success: () => {
                that.triggerEvent("handleShowLogin", false);
                isBtnClick = false;
              },
              fail: ()=>{
                isBtnClick = false;
              }
            })
          }
        }
      })
    }
  }
})