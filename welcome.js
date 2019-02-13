// pages/welcome/welcome.js
const app = getApp();
Page({
  data: {
    showButton: false,
    button_text: "授权登录",
    disable : false
  },
  //初始加载或者从设置页返回时调用
  onShow: function (options) {
    //获取userinfo，成功后跳转
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          that.gotoIndex();
        } else {
          that.setData({
            showButton: true
          })
        }
      }
    })
  },
  /*onShareAppMessage: function (res) {
    return {
      path: '/pages/welcome/welcome',
      imageUrl: '/imgs/da.png'
    }
  },*/
  navi: function (e) {
    var that = this;
    if(e.detail.userInfo != null) {
      that.gotoIndex();
    } else {
      wx.showModal({
        title: '提示',
        content: '此应用需要使用您的微信授权才能登录',
        showCancel: false
      })
    }
  },
  gotoIndex: function(){
    wx.switchTab({
      url: '/pages/index2/index'
    })
  }
})