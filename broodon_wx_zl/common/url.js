
var appBaseUrl = "https://morningtalk.niannian99.com"; 

var URL = {
  fileDomain: "https://file.niannian99.com/",
  getOpenId: appBaseUrl +  "/wx/jscode2session",
  getUserInfo: appBaseUrl + "/wx/getUserInfoByOpenId",
  checkUserMobile: appBaseUrl + "/user/checkUserMobile",
  smsLogin: appBaseUrl + "/user/smsLogin",
  getSmsCode: appBaseUrl + "/user/getSmsCode",
  checkDiscountCode: appBaseUrl + "/mall/checkDiscountCode",
  submitOrder: appBaseUrl + "/mall/submitOrder",
  getCardList: appBaseUrl + "/mall/index", 
  getMyLink: appBaseUrl + "/mall/login", 
  getSellerLink: appBaseUrl + "/mall/getMapUrl", 
}

module.exports = URL;