// pages/famous/famousList/famousList.js
var app = getApp(), URL = app.globalData.URL;
var td = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch:false, //是否查询到结果
    pageNo: 1,
    keyWord:'',//输入框的值
    isEnd: false,
    isFetching: false,
    famousList:[],
    famousTopList: [],
    yunMediaRoot: URL.yunMediaRoot
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopList();
  },

  getTopList: function () {
    this.setData({
      isFetching: true
    })
    wx.request({
      url: URL.getFamousTopList,
      data: {
        page: this.data.pageNo,
      },
      success: (res) => {
        console.log(res)
        if(res && res.data.success && res.data.data){
          this.setData({
            famousList: res.data.data,
            famousTopList: res.data.data,
            title: '热门推荐',
            isSearch: false
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: res.data.msg || '请求错误',
          icon: 'none'
        })
        this.setData({
          isSearch: true
        })
      }
    })
  },

  toFamousDetail:function(e){
    wx.navigateTo({
      url: '/pages/topic/famous/detail/detail?companyId=' + e.currentTarget.dataset.companyid
    })
  },

  onFocus:function(e){
    this.setData({
      isFocus:true
    })
  },

  clearValue: function(e){
    this.setData({
      keyWord: '',
      pageNo: 1,
      title: '热门推荐',
      isSearch: false,
      isEnd: false,
      famousList: this.data.famousTopList
    })
    //this.getSearchList('');
  },

  cancel:function(e){
    this.setData({
      isSearch:false,
      keyWord: '',
      pageNo: 1,
      isEnd: false,
      famousList: this.data.famousTopList
    })
    wx.navigateBack({})
  },

  onInput:function(e){
    var inputValue = e.detail.value;  
    clearTimeout(td);
    if (!inputValue){
      this.clearValue();
    }else{
      td = setTimeout(() => {
        this.setData({
          keyWord: inputValue,
          pageNo: 1,
          isEnd: false,
          isSearch: false,
          famousList: [],
        })
        this.getSearchList(inputValue);
      }, 1000)
    }
    
  },

  getSearchList: function (val) {
    wx.request({
      url: URL.getFamousList,
      data: {
        keyword: val,
        page: this.data.pageNo,
        pageSize: 20
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        var list = [], famousList = [...this.data.famousList];
        if (res && res.data.success && res.data.data) {
          list = res.data.data;
        } else if (res && res.data.success && res.data.data == null){
          list = [];
        }
        this.setData({
          famousList: famousList.concat(list),
          pageNo: this.data.pageNo + 1,
          isSearch: true,
        })
        if(list.length < 20){
          this.setData({
            isEnd: true
          })
        }
      },
      fail: (msg) => {
        console.log(msg)
        this.setData({
          isSearch: true,
        })
      }
    })
  },

  onReachBottom: function(e){
    if (this.data.isEnd == false && isSearch){
      this.getSearchList(this.data.keyWord);
    }
  }
})