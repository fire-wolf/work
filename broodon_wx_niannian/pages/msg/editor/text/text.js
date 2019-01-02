var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:null, 
    mainHeight: '',
    txtData:null,
    focus:false
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    if(options.curIndex){
      this.setData({
        'txtData':{ 
            'index': options.curIndex, 
            'text':options.text,
            'isShow': 'true',
            'type': 'text',
            'status':options.status
          },
          'focus':true,
          'mainHeight': app.globalData.sysInfo.screenHeight - 160
        });
    }
  },
  content:function(e){
    var that = this, txt = e.detail.value,txtData = this.data.txtData;
    if (txt == ''){
      wx.showToast({
        title: '请输入信函内容',
        icon: 'none'
      })
      return false;
    }else{
      txtData['text'] = txt;
      wx.setStorage({
        key: 'txtData',
        data: txtData,
        success: function () {
          wx.navigateBack();
        }
      })
    }
  },
  bindFormSubmit:function(e){
    var txt = e.detail.value.textarea, txtData = this.data.txtData;
    console.log(txt + ':' + txt)
    if(txt == ''){
      wx.showToast({
        title: '请输入信函内容',
        icon: 'none'
      })
      return false;
    }else{
      txtData['text'] = txt.replace(/  /g, "　");
      wx.setStorage({
        key: 'txtData',
        data: txtData,
        success: function () {
          wx.navigateBack();
        }
      })
    }
  }
});