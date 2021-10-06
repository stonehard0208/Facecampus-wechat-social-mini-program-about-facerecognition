Page({
 
  data: {
  show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
  selectData:['2019-2020学年上学期','2019-2020学年下学期','2020-2021学年上学期','2020-2021学年下学期'],//下拉列表的数据
  index:0,//选择的下拉列表下标
  listData:[]
  },
  // 点击下拉显示框
  selectTap(){
  this.setData({
   show: !this.data.show
  });
  },
  // 点击下拉列表
  optionTap(e){
  let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
  this.setData({
   index:Index,
   show:!this.data.show
  });
  },
  onLoad: function (options) {
    
    const db = wx.cloud.database();
    db.collection('score').get({
      success:res=>{
        console.log(res.data)
        this.setData({
          listData:res.data
        })
      },
      fail:console.error
    })

    

  }
  
 })