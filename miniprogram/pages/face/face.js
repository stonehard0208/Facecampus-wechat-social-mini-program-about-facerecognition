var app = getApp();
Page({
  data: {
    src:"",
    fengmian:"",
    videoSrc:"",
    src1:"",
    who:"",
    openid: "",
    token: "",
    windowWidth: 0,
    canvasshow:true,
    access_token:''
  },

  onLoad() {
    var that = this
    wx.showLoading({
      title: '努力加载中',
      mask: true
    })
    //屏幕宽度
    var sysInfo = wx.getSystemInfoSync()
    that.setData({
      windowWidth: sysInfo.windowWidth,
    })
    that.ctx = wx.createCameraContext()
    console.log("onLoad"),
      that.setData({
        openid: app.globalData.openid,
        token: app.globalData.token
      });
    
    // 每次更新access_token
    wx.request({
      // url: "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + app.globalData.baiduapikey + "&client_secret=" + app.globalData.baidusecretkey,
      url : 'https://aip.baidubce.com/oauth/2.0/token',
      method: 'GET',
      dataType: "json",
      data: {
        grant_type: 'client_credentials',
        client_id: 'V3r7hoDUOMd0cA7oKOe4cUS8',
        client_secret: 'vogGeRYOugTvU3H4X4FGfFVOnLhVlPOI'//自己的
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.access_token);
        // app.globalData.access_token = res.data.access_token;
        that.setData({
          access_token: res.data.access_token
        });
      }
    })
    wx.hideLoading()

  },

  onReady: function () {
  },

 
  takePhoto() {
    console.log("takePhoto")
    var that = this
    var takephonewidth
    var takephoneheight
    that.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth= res.width,
            takephoneheight = res.height
          }
        })
        // console.log(takephonewidth, takephoneheight)
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data),
            wx.request({
              url: "https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=" + that.data.access_token,
              data: {
                image:res.data,
                image_type:"BASE64",
                max_face_num:10
              },
              method: 'POST',
              dataType: "json",
              header: {
                'content-type': 'application/json' },
              success: function (res) {
                console.log(res.data);
                if (res.data.error_code === 0) { 
                  var ctx = wx.createContext()
                  ctx.setStrokeStyle('#31859c')
                  ctx.lineWidth = 3
                  for (let j = 0; j < res.data.result.face_num; j++){
                    var cavansl = res.data.result.face_list[j].location.left / takephonewidth * that.data.windowWidth
                    var cavanst = res.data.result.face_list[j].location.top / takephoneheight * that.data.windowWidth
                    var cavansw = res.data.result.face_list[j].location.width / takephonewidth * that.data.windowWidth
                    var cavansh = res.data.result.face_list[j].location.height / takephoneheight * that.data.windowWidth
                    ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)
                  }
                  wx.drawCanvas({
                    canvasId: 'canvas',
                    actions: ctx.getActions()
                  })
                } else{
                var ctx = wx.createContext()
                ctx.setStrokeStyle('#31859c')
                ctx.lineWidth = 3
                wx.drawCanvas({
                  canvasId: 'canvas',
                  actions: ctx.getActions()
                })
              }
              },
            })

          }
        })
      }
    })
  },

  search(){
    var that = this
    that.setData({
      who: ""
    })
    var takephonewidth
    var takephoneheight
    that.ctx.takePhoto({
      quality: 'heigh',
      success: (res) => {
        // console.log(res.tempImagePath),
        // 获取图片真实宽高
        wx.getImageInfo({
          src: res.tempImagePath,
          success: function (res) {
            takephonewidth = res.width,
              takephoneheight = res.height
          }
        })
        that.setData({
          src: res.tempImagePath
        }),
        wx.getFileSystemManager().readFile({
          filePath: that.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            wx.request({
              url: "https://aip.baidubce.com/rest/2.0/face/v3/multi-search?access_token=" + that.data.access_token,
              data: {
                image: res.data,
                image_type: "BASE64",
                group_id_list: "camera000001",
                max_face_num: 10,
                match_threshold: 60,

              },
              method: 'POST',
              dataType: "json",
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                // var name = res.data.result.face_list[j].user_list[0].user_id;
                  var ctx = wx.createContext()
                  if (res.data.error_code === 0) {
                    that.setData({
                      src1: !res.data.error_code,
                    })
                    ctx.setStrokeStyle('#31859c')
                    ctx.setFillStyle('#31859c');
                    ctx.lineWidth = 3
                    for (let j = 0; j < res.data.result.face_num; j++) {
                      var cavansl = res.data.result.face_list[j].location.left / takephonewidth * that.data.windowWidth/2
                      var cavanst = res.data.result.face_list[j].location.top / takephoneheight * that.data.windowWidth/2
                      var cavansw = res.data.result.face_list[j].location.width / takephonewidth * that.data.windowWidth/2
                      var cavansh = res.data.result.face_list[j].location.height / takephoneheight * that.data.windowWidth/2
                      var cavanstext = res.data.result.face_list[j].user_list.length>0?res.data.result.face_list[j].user_list[0].user_id + " " + res.data.result.face_list[j].user_list[0].score.toFixed(0) + "%":"Unknow"
                      ctx.setFontSize(14);
                      ctx.fillText(cavanstext, cavansl, cavanst-2)
                      ctx.strokeRect(cavansl, cavanst, cavansw, cavansh)
                    }
                    wx.drawCanvas({
                      canvasId: 'canvasresult',
                      actions: ctx.getActions()
                    })
                  } else {
                    that.setData({
                      who: res.data.result.face_list[0].user_list[0].user_id,
                    })
                    var ctx = wx.createContext()
                    ctx.setStrokeStyle('#31859c')
                    ctx.lineWidth = 3
                    wx.drawCanvas({
                      canvasId: 'canvasresult',
                      actions: ctx.getActions()
                    })
                  }
              },
            })
          }
        })
      }
    })

  },
  over(){
    
    wx.showModal({  
      title: '提示',  
      content: '人脸识别成功，是否确认签到',  
      success: function(res) {  
          if (res.confirm) {  
          console.log('用户点击确定');
          wx.showToast({
            title: '签到成功',
          })
          wx.navigateTo({
            url: '../index/index',
          })  
          wx.showToast({
            title: '签到成功',
          })
          } else if (res.cancel) {  
          console.log('用户点击取消')  
          }  
      }  
  }) 
  
  },

  uploadRecord() {
    var that = this;
    wx.showLoading({
      title: '上传中',
    })
    //获取摄像头信息
    wx.request({
      url: app.globalData.urlHeader + '/login/cameralist',
      data: {
        openid: app.globalData.openid,
        token: app.globalData.token
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code === 0) {
          
          if (res.data.data.cameras == null) {
            wx.request({
              url: app.globalData.urlHeader + '/login/addcamera',
              data: {
                openid: app.globalData.openid,
                token: app.globalData.token,
                camera: "phone",
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                if (res.data.code === 0) {
                  console.log('添加成功')
                } else {
                  console.log(res.data.error)
                }
              }
            })
          } else {
            var cameras = res.data.data.cameras
            if (cameras.includes("phone")) {
              return false
            } else {
              wx.request({
                url: app.globalData.urlHeader + '/login/addcamera',
                data: {
                  openid: app.globalData.openid,
                  token: app.globalData.token,
                  camera: "phone"
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  if (res.data.code === 0) {
                    console.log('添加成功')
                  } else {
                    console.log(res.data.error)
                  }
                }
              })
            }
          }
        }
        else {
          wx.hideLoading()
          console.log('获取摄像头列表失败！' + res.data.error)
          wx.showToast({
            title: '获取摄像头列表失败！',
            image: '../../img/about.png',
            duration: 1000
          })

        }
      }
    })

    wx.uploadFile({
      url: app.globalData.urlHeader + '/upload',
      filePath: that.data.videoSrc,
      name: 'file',
      formData: {
        'cameraid':'phone',
        'openid': app.globalData.openid,
        'token': app.globalData.token,
        'tag': 2
      },
      success: function (res) {
        console.log(res.data);
        var result = JSON.parse(res.data).data.filename
        console.log(result);
        wx.uploadFile({
          url: app.globalData.urlHeader + '/upload/fengmian',
          filePath: that.data.fengmian,
          name: 'file',
          formData: {
            'openid': app.globalData.openid,
            'token': app.globalData.token,
            'name': result
          },
          success(res) {
            console.log( res.data);
            that.setData({
              fengmian: "",
              videoSrc:""
            }),
            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../index/index'
              })
            }, 2000)
            
          },
          fail(res) {
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              image: '../../img/about.png',
              duration: 2000
            })

          }
        })
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '上传失败',
          image: '../../img/about.png',
          duration: 2000
        })

      }
      
    })
  },

  onUnload: function () {
    var that=this
    clearInterval(that.interval)
  },

  error(e) {
    console.log(e.detail)
  }

})