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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  formatTime4: formatTime4,
  msgConfig: msgConfig,
  writePhotosAlbum: writePhotosAlbum,
  setNavigationBar: setNavigationBar
}
