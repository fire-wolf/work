// var appBaseUrl = "http://appweb.nnkj.com";
//var appBaseUrl = "https://app-pre.niannian99.com"; //灰度
var appBaseUrl = "https://app.niannian99.com";


//var famousUrl = "http://wx.nnkj.com";
//var famousUrl = "http://192.168.51.240:8083/broodon_wx";
var famousUrl = appBaseUrl;

// 小程序 灰度app- pre.niannian99.com/wx
// 正式环境 wx.niannian99.com/wx

var URL = {
  appBaseUrl: appBaseUrl,
  fileDomain: "https://file.niannian99.com/",
  getSmsCode: appBaseUrl + "/u/getLoginAuthCode",
  login: appBaseUrl + "/wx/user/create",
  getUserTelZone: appBaseUrl +"/wx/area/countries",//更改用户区号
  bindUserInfo: appBaseUrl + '/wx/user/bindUserTel', 
  sendMsg: appBaseUrl + "/message/qnsend1",
  getBannerList: appBaseUrl + "/wx/find/getBanners",
  getHotArticleList: appBaseUrl + "/wx/find/getHotArticle",
  getArticleView: appBaseUrl + "/wx/find/article",
  getUserInfoView: appBaseUrl + "/wx/user/getUserInfo",
  getDecryptUserInfo: appBaseUrl + "/wx/user/decryptUserInfo",
  getFindPush: appBaseUrl + "/wx/common/findPush",
  createRedMsg: appBaseUrl + "/wx/redMsg/create",
  getRedMsg: appBaseUrl + "/wx/redMsg/getMsgById",
  sendMsg: appBaseUrl + "/wx/msg/send",
  replyMsg: appBaseUrl + "/wx/msg/reply",
  removeMsg: appBaseUrl + "/wx/msg/remove",
  // getMsgInfo: appBaseUrl + "/wx/msg/getMsgInfo",
  getMsgInfo: appBaseUrl +"/wx/msg/getMsgInfoV2",
  getMsgDecrypt: appBaseUrl + "/wx/msg/decrypt",
  getMsgList: appBaseUrl + "/wx/msg/getMyMsgList",
  getMySendMsg: appBaseUrl + "/wx/msg/getMySendMsg",
  getMyMsgList: appBaseUrl + "/wx/redMsg/getMyMsgList",
  getMyMsgUnReadCount: appBaseUrl + "/wx/msg/getMyMsgUnReadCount",
  getUserInfo: appBaseUrl + "/wx/user/getUserInfo",
  getMyRank: appBaseUrl + "/wx/redMsg/getMyRank",
  getUnionIdInfo: appBaseUrl + "/h5/weixin/jscode2session",
  getwxaCode: appBaseUrl + "/h5/weixin/getwxacode",
  getConfig: appBaseUrl + "/wx/common/getConfig",
  getMsgPaperAndMusic: appBaseUrl + "/wx/msg/getMsgPaperAndMusic",
  getMsgPayCode: appBaseUrl + "/pay/getAlipaySmsCode",
  getWXPayInfo: appBaseUrl + "/pay/getOrderNoBySmallProgram",
  getSystemMsg: appBaseUrl + "/wx/common/getSystemMsg",
  yunMediaRoot: "https://file.niannian99.com/",

  getsnhIndexList: appBaseUrl + "/wx/snh48/index",
  getsnhDetailInfo: appBaseUrl + "/wx/snh48/getDetailInfo",
  snhLike: appBaseUrl + "/wx/snh48/v2/like",
  snhReplyMsg: appBaseUrl + "/wx/snh48/v2/msg/reply",
  getNkInfo: appBaseUrl + "/wx/nk/index",
  getNkComment: appBaseUrl + "/wx/nk/getAllReply",
  sendNkcomment: appBaseUrl + "/wx/nk/reply",
  removeNkComment: appBaseUrl + "/wx/nk/removeReply",
  getNkListInfo: appBaseUrl + "/wx/nk/show",

  getReportReason: famousUrl + "/wx/famous/report/getValue", //获取举报投诉原因的列表
  subMitReport: famousUrl + "/wx/famous/report/create", //提交举报投诉
  getFamousList: famousUrl + "/wx/famous/index", //名家名企主页列表
  getFamousTopList: famousUrl + "/wx/famous/index/top", //名家名企主页 推荐列表
  getFamousHistoryList: famousUrl + "/wx/famous/index/history", //名家名企最近浏览列表
  getFamousInfo: famousUrl + "/wx/famous/getFamousInfoById",
  getTopByCompany: famousUrl + "/wx/famous/topic/getTopByCompanyId",
  getActList: famousUrl +"/wx/activity/list", //获取活动列表
  getActDetail: famousUrl +"/wx/activity/get", //获取活动列表详情
  actSignUp: famousUrl +"/wx/activity/enroll",//提交报名信息
  actRecordList: famousUrl +"/wx/activity/recoredList",//活动记录列表信息
  addActRecord: famousUrl +"/wx/activity/publishRecored",//发布活动记录
  goActSignIn: famousUrl +"/wx/activity/checkIn",//去活动签到
  goActSignOut: famousUrl +"/wx/activity/checkOut",//去活动签出操作

  topicLike: famousUrl + "/wx/famous/topic/like", //名家名企 今日话题点赞
  topicUnLike: famousUrl + "/wx/famous/topic/unLike", //今日话题取消点赞
  getTopicComment: famousUrl + '/wx/famous/topic/getComment', //获取今日话题评论
  getTopicCommentWithMe: famousUrl + '/wx/famous/topic/withMe', //获取今日话题与我相关评论
  createTopicComment: famousUrl + '/wx/famous/topic/comment/create', //发布今日话题评论
  removeTopicComment: famousUrl + '/wx/famous/topic/comment/remove', //删除今日话题评论 //
  onFamousCommentLike: famousUrl + '/wx/famous/topic/comment/like', //话题评论点赞
  onFamousCommentUnLike: famousUrl + '/wx/famous/topic/comment/unLike', //取消话题评论点赞
  sendFamousMsg: famousUrl + '/wx/famous/msg/send', //向他写信
  checkFamousPower: famousUrl + '/wx/famous/msg/checkPower', //检查有没有发送机会 
  getFamousMsgInfo: famousUrl + '/wx/famous/msg/getInfo', //读取名家名企信函详情 
  getFamousFansPublicList:famousUrl+'/wx/famous/msg/getFansPublicList',//获取名家名企粉丝公开信列表
  getFamousPublicList: famousUrl + '/wx/famous/msg/getPublicList', //获取名家名企业公开信列表 
  getFamousMsgList: famousUrl + '/wx/famous/msg/getList', //获取与名家名企业来往信函列表
  removeFamousMsg: famousUrl + '/wx/famous/msg/remove', //删除我与名家名企列表的信函
  getActCountAllTime: appBaseUrl +'/wx/activity/countAll',//统计所有活动时间
  getActCountMonth: appBaseUrl +'/wx/activity/countByMonth',//统计月活动列表

  getMuseumBanner: appBaseUrl + '/wx/museum/findMuseumPagePicture', //获取博览馆banner
  getMuseumTopic: appBaseUrl + '/wx/museum/findMuseumTopic', //获取博览馆首页主题
  getMuseumTopicList: appBaseUrl + '/wx/fmuseum/indMuseumPageTopic', //获取博览馆主题列表
  getMuseumList: appBaseUrl + '/wx/museum/findMuseumPageMsg', //获取博览馆信函列表
  getMuseumView: appBaseUrl + '/wx/museum/getMsgDetail', //获取博览馆信函详情
  museumMsgLike: appBaseUrl + '/wx/museum/Msglike', //博览馆信函详情点赞与取消
  getMuseumPagePicture: appBaseUrl + '/wx/museum/findMuseumPagePicture', //获取博览馆主页主图
  getMuseumCollections: appBaseUrl + '/wx/museum/findMuseumPageMsg2', //获取博览馆精品馆藏
  museumTopicLike: appBaseUrl + '/wx/museum/topicLikeOrCancel', //话题点赞或者取消点赞

  getIDnumber: appBaseUrl + '/u/findCert', //获取用户实名认证信息
  putIDnumber: appBaseUrl + '/wx/u/updateIsCert', //提交用户实名认证信息
  getBalance: appBaseUrl +'/user/getBalance',//获取用户钱包余额
  getMsgCode:appBaseUrl+'/userTelExistsSendSms',//获取短信验证码
  applyTixian: appBaseUrl +'/wx/pay/tixian',//提现申请
  getTradeRecord: appBaseUrl + '/money/getMyTradeLog',//获取交易明细
  getWithdrawRecord: appBaseUrl +'/money/getMyTxLogV2',//获取提现明细
  getRedPacketBox: appBaseUrl +'/wx/msg/getRedPacket',//领取红包操作



  getActivityList: appBaseUrl +'/wx/activity/myList',//获取活动列表
}

module.exports = URL;