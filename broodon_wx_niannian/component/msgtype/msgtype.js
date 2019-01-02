 
var app = getApp(), URL = app.globalData.URL;
var vTime = null;
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
    isParam: {
      type: Boolean
    },
    redPacket:{
      type: Number,
      value: 0
    },
    redPacketBox:{
      type:Object,
      value:null
    },
    map:{
      type: Object,
      value: null
    },
    curTime:{
      type: Object,
      value: null

    },
    isEditor:{
      type:Boolean,
      value:false
    },
    isReceive:{
      type: Boolean,
      value: false
    }



  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    yunMediaRoot:URL.yunMediaRoot, 
    isIphoneX: app.globalData.isIphoneX,
    scrollViewWidth:0,
    isRedOpen:false
  },

  ready: function() {
    this.init()
    
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
    init: function(){
      this.setData({
        scrollViewWidth: app.globalData.sysInfo.windowWidth - 16 + 'px'
      });
    },
    changeMsgType:function(e){
      var eventDetail = {
        type: e.target.dataset.type
      }
      this.triggerEvent('changeMsgType', eventDetail);
    },
    //打开红包操作
    openRedPacket:function(e){
      var eventDetail = {
        type: e.target.dataset.type
      } 
      if (eventDetail.type=='show'){
        this.setData({
          isRedOpen: true
        })
        // this.triggerEvent('openRedPacket', eventDetail);
      } else if (eventDetail.type=='close'){
        this.setData({
          isRedOpen: false
        })
      }else if(eventDetail.type=='open'){
        if (this.data.redPacketBox.redPacketStatus==1){
          return false;
        }
        this.triggerEvent('openRedPacket',e);
      }
      
    }
     
    
     
  }
})