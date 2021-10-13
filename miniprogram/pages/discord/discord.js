//index.js
const app = getApp()
//artland
var api = require('../../utils/api.js')
var bmap = require('../../utils/bmap-wx')
const QQMapWX = require('../../utils/qqmap-wx-jssdk')
var qqmap = require('../../utils/qqmap-wx-jssdk')

Page({
  data: {
    systemInfo: {},
    _api: {},
    
    currentNavbar: '0',
    swipers: [],
    list: [],
    hot_last_id: 0,
    latest_list: [],
    latest_last_id: 0,
    showDialog:false,
    //signbanner:"https://i.loli.net/2021/05/02/kG7xsZaONUFlqXy.jpg"
    //sysWidth:wx.getSystemInfoSync().windowWidth,
    sysHeight:wx.getSystemInfoSync().windowHeight,

    shequ_img_List:[]

    

    
  },
  
 


  onLoad:function () {

    const db = wx.cloud.database();
    
    db.collection('shequ').get({
      success:res=>{
        console.log(res.data)
        this.setData({
          shequ_img_List:res.data.reverse()
        })
      },
      fail:console.error
    })





    var _this = this;
    _this.setData({
      _api: api,

    });
    this.getSwipers()
    this.pullUpLoad()
   // _this.findSchool()
  },


   getSwipers () {
     api.get(api.SWIPERS)
       .then(res => {
         this.setData({
           swipers: res.data.ads
         })
       })
   },

  /**
   * 点击跳转详情页
   */
  onItemClick (e) {
    var targetUrl = api.PAGE_WORK
    if (e.currentTarget.dataset.rowId != null)
      targetUrl = targetUrl + '?rowId=' + e.currentTarget.dataset.rowId
    wx.navigateTo({
      url: targetUrl
    })
  },

  /**
   * 切换 navbar
   */
  swichNav (e) {
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 1 && this.data.latest_list.length == 0) {
      this.pullUpLoadLatest()
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh () {
    switch (this.data.currentNavbar) {
      case '0':
        this.setData({
          list: [],
          hot_last_id: 0
        })
        this.pullUpLoad()
        break
      case '1':
        this.setData({
          latest_list: [],
          latest_list_id: 0
        })
        this.pullUpLoadLatest()
        break
      case '2':
        wx.stopPullDownRefresh()
        break
    }
  },

  /**
   * [推荐]上拉刷新
   */
  pullUpLoad () {
    wx.showNavigationBarLoading()
    api.get(api.HOST_IOS + api.HOT + '?last_id=' + this.data.hot_last_id)
      .then(res => {
        this.setData({
          list: this.data.list.concat(res.data.list),
          hot_last_id: res.data.last_id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
  },

  /**
   * [最新]上拉刷新
   */
  pullUpLoadLatest () {
    wx.showNavigationBarLoading()
    api.get(api.HOST_IOS + api.LATEST + '?last_id=' + this.data.latest_last_id)
      .then(res => {
        this.setData({
          latest_list: this.data.latest_list.concat(res.data.list),
          latest_last_id: res.data.last_id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
  },
  



  getAccessToken:function(){  
    wx.navigateTo({
      url: '/pages/timetable/timetable',
    })
},
 /* getAccessToken(){
    var APP_ID = "wx19035df8c0760704";
    var API_KEY = "V3r7hoDUOMd0cA7oKOe4cUS8";
    var SECRET_KEY = "vogGeRYOugTvU3H4X4FGfFVOnLhVlPOI";

    var _this = this;

    var options = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+API_KEY+'&client_secret='+SECRET_KEY+'&';

    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', // 仅为示例，并非真实的接口地址
      method: 'GET',
      data: {
        grant_type: 'client_credentials',
        client_id: 'V3r7hoDUOMd0cA7oKOe4cUS8',
        client_secret: 'vogGeRYOugTvU3H4X4FGfFVOnLhVlPOI'//自己的
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          token: res.data.access_token//获取到token
        })
        console.log(res);
        console.log("token:" + res.data.access_token);
      }
    });
    
    var req = wx.request(options,function(res){
      console.log(res)
      res.on('data',function(d){
        access_token+=d;
      });

      res.on("end",function(){
        console.log(access_token);
      })


    });
    // req.end(function(){
    //   console.log("end");
    // })

  }*/

})