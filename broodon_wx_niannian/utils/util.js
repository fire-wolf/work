import URL from './url.js'
import qiniuUploader from './qiniuUploader.js';

const formatTime = date => {
  if (typeof date === 'number' || date < 0) {
    const hour = parseInt(date / 3600)
    date = date % 3600
    const minute = parseInt(date / 60)
    date = date % 60
    const second = date

    return ([hour, minute, second]).map(function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':');
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime2 = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatTime3 = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('.') ; 
}

const formatTime4 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return year + '年' + month + '月' + day + '日' + ' ' + formatNumber(hour) + ':' + formatNumber(minute);
}

const formatTime5 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return year + '年' + month + '月' + day + '日';
}

const formatTime6 = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var week = date.getDay()
  switch(week){
    case 1: week = "一";break;
    case 2: week = "二";break;
    case 3: week = "三";break;
    case 4: week = "四";break;
    case 5: week = "五";break;
    case 6: week = "六";break;
    case 7: week = "天";break;
  }
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':') + " 周"+ week;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const qnUrl = url => {
  url = url.replace(/(\/|&nbsp;|\s+)$/g, "");
  if (!/^(http|https)/g.test(url)) {
    if (url && url != "" && url.indexOf('niannianyun') >= 0) {
      return URL.fileDomain + url;
    } else if (/^uploadFiles/g.test(url)) {
      return 'https://www.niannian99.com/' + url;
    } else {
      return url;
    }
  } else {
    return url;
  }
}

//信纸配置
const msgConfig = (msgType, obj) => {
  var msgConfig = {}
  obj.map(function (item) {
    if (item.type == msgType) {
      var paper = item.paperUrl.split(',')
      msgConfig = {
        paperTop: paper[0],
        paperMidle: paper[1],
        paperBottom: paper[2],
        backgroundColor: paper[3]
      }
    }
  })
  return msgConfig;
}

//保存图片到相册
const writePhotosAlbum = (successFun,failFun) =>{
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            successFun && successFun()
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: "小程序需要您的微信授权保存图片，是否重新授权？",
              showCancel: true,
              cancelText: "否",
              confirmText: "是",
              success: function (res2) {
                if (res2.confirm) { //用户点击确定'
                  wx.openSetting({
                    success: (res3) => {
                      if (res3.authSetting['scope.writePhotosAlbum']) {
                        //已授权
                        successFun && successFun()
                      } else {
                        failFun && failFun()
                      }
                    }
                  })
                } else {
                  failFun && failFun()
                }
              }
            });
          }
        })
      } else {
        successFun && successFun()
      }
    }
  })
}

const setNavigationBar = (title, fontColor, bgColor) => {
  wx.setNavigationBarTitle({
    title: title
  })
  wx.setNavigationBarColor({
    frontColor: fontColor,
    backgroundColor: bgColor
  })
}

const sendComm = (data,callback) => {
  console.log(data)
  wx.request({
    url: URL.sendNkcomment,
    data: data,
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      if (res.data && res.data.success) {
        wx.setStorage({
          key: 'nk-comment-success',
          data: true,
          success: function(res) {
            //wx.showToast({ title: '评论成功！', icon: "none" });
            callback && callback();
          },
        })
      } else {
        wx.showToast({ title: '评论失败！', icon: "none" })
      }

    },
    error: function (res) {
      wx.showToast({ title: '评论失败！', icon: "none" })
    }
  });
}

const uploadFun = (obj, successFun, errorFun) => {
  var options = {
    region: 'ECN', // 华北区
    uptokenURL: URL.appBaseUrl + '/qiniu/getToken?fileName=' + obj.fileName,
    fileName: obj.fileName,
    // uptoken: 'xxxx',
    domain: URL.fileDomain
  };
  qiniuUploader.init(options);
  // 交给七牛上传 
  qiniuUploader.upload(obj.url, (res) => {
    successFun && successFun(res);
  }, (error) => {
    errorFun && errorFun(error);
  });
}
const requestData = (url, data, method, callback) => {
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: (res) => {
      callback && callback(res);
    },
  })
}
//数组去重
const unionArry = (array) => {
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}
//计算两个经纬度之间的距离
const getDistance= (lat1, lng1, lat2, lng2) => {
  console.log('lat1:' + lat1 + ' lng1:' + lng1 + '\r\n' + 'lat2:' + lat2 + ' lng2:' + lng2);
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;

  var La1 = lat1 * Math.PI / 180.0;

  var La2 = lat2 * Math.PI / 180.0;

  var La3 = La1 - La2;

  var Lb3 = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));

  s = s * 6378.137;//地球半径

  s = Math.round(s * 10000) / 10000;

  return s;
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  formatTime4: formatTime4,
  formatTime5: formatTime5,
  formatTime6: formatTime6,
  qnUrl: qnUrl,
  msgConfig: msgConfig,
  writePhotosAlbum: writePhotosAlbum,
  setNavigationBar: setNavigationBar,
  sendComm: sendComm,
  uploadFun: uploadFun,
  requestData: requestData,
  unionArry: unionArry,
  getDistance: getDistance
}
