var innerAudioContext = wx.createInnerAudioContext();
var vTime = null, isVoicePlaying = false; 
module.exports = {
  curTime:'00:00:00',
  playAudio:function(data,callback){
    innerAudioContext.src = data;
    if (isVoicePlaying == true) {
      innerAudioContext.stop();
      clearInterval(vTime);
    } else {
      innerAudioContext.play();
      this.setVoiceTime(callback);
      innerAudioContext.onEnded(function () {
        clearInterval(vTime);
      });
    }
    isVoicePlaying = !isVoicePlaying;
  },
  audioPause: function () {
    var that = this;
    innerAudioContext.onPause(function () {
      if (that.data.isPlaying == true) {
        backgroundAudioManager.play();
      }
    })
  }, 

  setVoiceTime: function (callback) {
    var that = this;
    clearInterval(vTime);
    vTime = setInterval(function () {
      var countTime = that.countTime(); 
      callback && callback(countTime);
      //that.setData({ 'voiceCurrentTime': countTime});
      
    }, 500)
  },

  countTime: function () {
    var time = Math.ceil(innerAudioContext.currentTime);
    var hour = 0, min = 0, sec = 0;
    hour = Math.floor(time / 60 / 60);
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);
    hour = hour > 9 ? hour : '0' + hour;
    min = min > 9 ? min : '0' + min;
    sec = sec > 9 ? sec : '0' + sec;
    return hour + ':' + min + ':' + sec;
  },

}