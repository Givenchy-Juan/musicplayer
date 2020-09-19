const MAX_WORDS_NUM = 140

const MAX_IMG_NUM = 9


const db = wx.cloud.database()
//输入的文字内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true//添加图标的元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大数字为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  onFocus(event) {
    console.log(event)
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  onChange() {
    //选择图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result)
        this.setData({
          images: this.data.images.concat(result.tempFilePaths)
        })
        //还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      }
    });
  },
  onDelete(event) {
    //  let index =  event.target.dataset.index
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length === MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true
      })
    }
  },
  onPreviewImage(event) {
    wx.previewImage({
      //预览图片
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },
  //发送事件
  send() {
    if(content.trim()===''){
      wx.showModal({
        title: '请输入内容',
        content: ''
      });
      return
    }
    wx.showLoading({
      title:'发布中',
      mask:true,
    })
    let promiseArr = []
    let fileIds=[]
    //图片上传  是一个异步过程
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((reslove, reject) => {
        let item = this.data.images[i]
        //文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        //todo 2.数据存储到云数据库中
        // 内容  图片fileID  openid 昵称  头像  时间
        //数据库：内容、图片(云存储)  1.云存储 fileID  云文件ID
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 100000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res.fileID)
            fileIds=fileIds.concat(res.fileID)
            reslove()
          },
          fail: (err) => {
            console.log(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    //存入云数据库  promise.all
    Promise.all(promiseArr).then(res => {
      db.collection('blog').add({
        data:{
          content,
          img:fileIds,
          ...userInfo,//userInfo 是一个对象 可以用扩展运算符取到里面的每一个属性
          createTime:db.serverDate()//服务端时间
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title:'发布成功'
        })
        //返回blog页面,并且刷新数据
        wx.navigateBack()
        const pages =  getCurrentPages();
        //取到上一个界面
        const prevPage = pages[pages.length-2]
        prevPage.onPullDownRefresh()
        
      })
    }).catch(err=>{
      wx.hideLoading()
      wx.showModal({
        title:'发布失败'
      })
    })
  },
})