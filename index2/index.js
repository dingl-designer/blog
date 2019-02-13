var LIMITE = 8;
var app = getApp();
Page({
  data: {
    scrollviewHeight: null,
    hotword: '请输入查找内容',
    lowerstatus: true,//下拉每次触发三次，我要一次就够了
    pageNo: 1,//页码从1开始
    list: null,
    currentTab: 0,
    type: 0,
    tabArray: ["全部", "系列课"],
    show: false,
    en1or2: ["英语一", "英语二"]
  },
  onLoad: function (res) {
    var that = this;
    console.log(res.type)
    if(null != res.type){
      that.setData({
        en1or2: en1or2[res.type]
      })
    } else {
      that.setData({
        en1or2: "英语"
      })
    }
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollviewHeight: res.windowHeight - res.windowWidth / 750 * 175
        });
      }
    });
    that.loadData();
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ show: false });
    that.loadData();
  },
  //切换tab事件
  bindChange: function (e) {
    this.initSwiper(e.detail.current);
  },
  swichNav: function (e) {
    this.initSwiper(e.target.dataset.current);
  },
  initSwiper: function (crt) {
    var that = this;
    if (this.data.currentTab === crt) {
      return false;
    } else {
      that.setData({
        currentTab: crt,
        type: crt === 0 ? 0 : 2,
        list: null,
        pageNo: 1
      });
      that.loadData();
    }
  },
  loadhotword: function () {
    var that = this;
    wx.request({
      url: app.globalData.basePrefix + '/config/get',
      data: {
        key: 'hot_word'
      },
      success: function (res) {
        if (res.data) {
          var list = res.data.data;
          if (list) {
            that.setData({ hotword: list.split(',')[0] });
          }
        }
      }
    });
  },
  loadData: function () {
    var that = this;
    that.loadhotword();
    wx.request({
      url: app.globalData.basePrefix + '/subject/list',
      data: {
        type: that.data.type,
        limit: LIMITE,
        offset: (that.data.pageNo - 1) * LIMITE
      },
      success: function (res) {
        if (that.data.pageNo == 1) {
          that.setData({ list: [] });
        }
        if (res.data && res.data.data) {
          var list = res.data.data;
          for (var i = 0; i < list.length; i++) {
            list[i]['picUrl'] = app.globalData.filePrefix + '/' + list[i].thumbUrl;
            list[i]['navi'] = '../subject-detail/subject-detail?id=' + list[i]['id'];//点击跳转路径
          }
          that.setData({
            list: that.data.list == undefined ? list : that.data.list.concat(list),
            lowerstatus: list.length == 0 ? false : true
          });
        }
      },
      complete: function () {
        that.setData({ show: true });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  lowerLoad: function () {
    var that = this;
    if (that.data.lowerstatus == true) {
      that.setData({
        lowerstatus: false,
        pageNo: that.data.pageNo + 1
      })
      that.loadData();
    }
  }
})
