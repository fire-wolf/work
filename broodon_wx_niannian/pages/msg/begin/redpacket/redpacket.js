var isBtnClick = false;
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    inputVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "发红包"
    });
  },
  onShow:function(){
    var that = this;
    wx.getStorage({
      key: 'msgRedPacket',
      success: function (res) { 
        if (res.data.redpacket){
          that.setData({
            inputVal:res.data.redpacket
          });
        }
        wx.removeStorage({ key: 'msgRedPacket' })
      }
    })
  },
  inputKey:function(e){
    if (e.detail.value != "") {
      this.setData({
        inputVal: e.detail.value
      });
    }else{
      this.setData({
        inputVal: ""
      });
    }
  },
  inputBLur:function(e){
    if(e.detail.value!=""){
      this.setData({
        inputVal: e.detail.value
      });
    }else{
      this.setData({
        inputVal: ""
      });
    }
  },
  subFun:function(){
    var inputVal = this.data.inputVal;
    if (inputVal == "" || parseFloat(inputVal) < 0 || isNaN(parseFloat(inputVal))){
      wx.showModal({
        title: '提示',
        content:'请输入红包金额！'
      });
      return false;
    } else if (parseFloat(inputVal) < 0.01){
      wx.showModal({
        title: '提示',
        content: '红包金额不能小于0.01，请重新输入！',
      });
      return false;
    }else{
      if (parseFloat(inputVal)>666){
        wx.showModal({
          title:'提示',
          content: '红包金额不能大于666，请重新输入！',
        });
        return false;
      }
    }
    if (isBtnClick) return false;
    isBtnClick = true;
    wx.navigateTo({
      url: "/pages/msg/editor/editor?redPacket=" + parseFloat(inputVal).toFixed(2),
      success: function () {
        setTimeout(function () {
          isBtnClick = false;2
        }, 1000);
      }
    });
  }
})