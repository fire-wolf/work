var app = getApp(), URL = app.globalData.URL;
var tt = null;
var animation = {};

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    imgUrls: {
      type: Array,
      value: [
        
      ],
    },
    swiperHeight: {
      type: Number,
      value: 1000
    }

  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    currentIndex: 0,
    scale: 1,
    original: 0.7,
    multiple: 0.7,
    startY: 0,
    distance: 250,
  },

  ready: function () {
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
    onMoveStart: function (e) {
      //console.log(e)
      clearInterval(tt);
      if (e.changedTouches[0] && e.changedTouches[0].pageY) {
        this.setData({
          currentIndex: e.target.dataset.index,
          startY: e.changedTouches[0].pageY,
        })
      }
    },

    onMoveEnd: function (e) {
      var that = this;
      // tt = setTimeout(()=>{
      //   that.setData({
      //     //scale: 1
      //   })
      // },500)
      var a = 15, s = 1, o = this.data.multiple, n = 1;
      if (this.data.distance < this.data.swiperHeight / 2) {
        tt = setInterval(() => {
          s = this.data.scale + (10 / 500) / 4;
          o = this.data.original - (10 / 500) / 4;
          o = o < this.data.multiple ? this.data.multiple : o;
          // console.log(o)
          // console.log(s)
          if (s = 1) {
            clearInterval(tt);
          }

          this.setData({
            scale: s,
            original: o,
          })
          n++;
        }, 30)
      } else {
        tt = setInterval(() => {
          s = this.data.scale - (10 / 500) / 4;
          o = this.data.original + (10 / 500) / 4;
          o = o > 1 ? 1 : o;
          s = s < this.data.multiple ? this.data.multiple : s;
          //console.log(((15 + 3 * n) / 500) / 2)
          //console.log(s)
          if (o = 1) {
            clearInterval(tt);
          }
          this.setData({
            scale: s,
            original: o,
          })
          n++;
        }, 30)
      }
    },

    onMove: function (e) {
      var index = e.target.dataset.index;
      var direction = e.changedTouches[0].pageY - this.data.startY;
      var y = Math.abs(e.changedTouches[0].pageY - this.data.startY);

      var s = 1 - (y / 500) / 4;
      var o = this.data.multiple + (y / 500) / 4;
      s = s < this.data.multiple ? this.data.multiple : s;
      o = o > 1 ? 1 : o;
      //console.log(e)

      if ((index == 0 && direction < 0) ||
        (index == this.data.imgUrls.length - 1 && direction > 0) ||
        (index != 0 && index != this.data.imgUrls.length - 1)
      ) {
        this.setData({
          scale: s,
          original: o,
          distance: y
        })
      }
    },

    onAtionFinish: function (e) {
      //console.log(e)
      clearInterval(tt);
      if (e.detail.source == 'touch') {
        clearTimeout(tt)
        this.setData({
          scale: 1,
          currentIndex: e.detail.current,
        })
      }
    },

    onSwiperChange: function (e) {
      //console.log(e)
      // if(e.detail.source == 'touch'){
      //   clearTimeout(tt)
      //   this.setData({
      //     scale: 1,
      //     currentIndex: e.detail.current,
      //   })
      // }

    },

  }
})