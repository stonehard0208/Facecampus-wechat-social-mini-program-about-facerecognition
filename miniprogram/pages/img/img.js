// pages/img/img.js
var app = getApp();
const db = wx.cloud.database()
Page({
  data: {
    img_arr: [],
    title: '',
    detail:'',
    fruit: [{
      id: 1,
      name: '失物招领',
  }, {
      id: 2,
      name: '日常交流'
  }, {
      id: 3,
      name: '创意分享'
  }, {
      id: 4,
      name: '竞赛组队',
  }],
  current: "日常交流"
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
},
  formSubmit: function (e) {
    
    // var that=this
    // wx.request({ 
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   }, 
    //   url: app.globalData.url+'post',  
    //   data:{
    //     'content': e.detail.value.content,   
    //     'title': e.detail.value.title,
    //     'category': that.data.current,
    //     'writer': app.globalData.userInfo.nickName
    //   },  
    //   method: 'POST',  
    //   header: {
   
    //   },
    //   success:function(res) {  
        // setTimeout(() => {
        //     wx.request({ 
              
        //       url: app.globalData.url+'postpics',  
        //       data:{
        //         'message': 'ok',   
        //       },  
        //       method: 'POST',  
        //       header: {
        //         'Content-Type': 'application/json'
        //       },
        //       success:function(res) {  
                   
        //       },  
        //       fail:function(res){  
           
        //       }  
        //   }) 
        // }, 2000);  
  //      console.log('submit');  
  //     },  
  //     fail:function(res){  
  //         console.log('submit fail');  
  //     }  
  // }) 
    this.upload(e)
  },
/**
 * 问题：
 *一张图片传
 */
  upload: function (e) {
    var that = this
    
    wx.login({
      success: function(res) {
        var appId = 'wx19035df8c0760704';
          var secret = '8cd844f45bfca53080f3bf1cc610ec2b';
          var code = res.code;
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
      data: {
        "code": res.code
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
      // console.log(res.data.openid)
      var OD=res.data.openid
if(that.data.img_arr[0]==null)
{
  //不上传图片的情况
  wx.showToast({
    title: '请上传图片',
    icon:'none'
  })
}
else{
    setTimeout(() => {
   
    // for (var i = 0; i < (that.data.img_arr.length); i++) {
    //  console.log(that.data.img_arr[0])

      wx.cloud.uploadFile({
        // url: app.globalData.url+'post',
        filePath: that.data.img_arr[0],
         cloudPath: "load/"+new Date().getTime().toString(),
        // name: 'file',
        success: function (res) {
          // console.log(res)
           //上传数据库
           if (e.detail.value.content&&e.detail.value.title){
            db.collection('shequ').add({
              data:{
                title: e.detail.value.title,
                content:e.detail.value.content,
                imgUrl:res.fileID,
                number:1,
                school:"Tsinghua University",
                user_name:"zhangsan",
                type:that.data.current,
                avatorUrl:"cloud://cloud1-3gf9ughu51389270.636c-cloud1-3gf9ughu51389270-1305714734/avatorimg/avator2.jpg",
                date:new Date().toLocaleDateString(),
                time:new Date().toTimeString().substring(0,8),
              },
                success:res => {
                  wx.showToast({
                    title: '发布成功',
                    
                  });
                  setTimeout(()=>{
                    wx.navigateTo({
                      url: '../index/index',
                    })
                  }, 1000)
                },
                fail: e=>{
                  wx.showToast({
                    title: '发布错误',
                  })
                  console.log(e)
                }
              })
          }else{
            wx.showToast({
              title: '请填写主题和内容',
              icon: 'none'
            })
          }
    
        }
     
      })
    that.setData({
      formdata: ''
    })
     
  }, 1000);
}
}
})
}
})
  },
  
  upimg: function () {
    var that = this;
    if (this.data.img_arr.length  < 1) {
      wx.chooseImage({
        count:2,
        sizeType: ['original', 'compressed'],
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    
    } 

    // if (this.data.img_arr.length  != 1) { 
    //   wx.showToast({
    //     title: '最多上传1张图片',
    //     icon: 'loading',
    //     duration: 3000
    //   });
    // }
  },

  onLoad: function() {
  
  },




}



);
