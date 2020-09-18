const MAX_WORDS_NUM = 140

const MAX_IMG_NUM = 9
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
  //发送事件
  send() {
    let promiseArr = []
    //图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      new Promise((reslove, reject) => {
        let item = this.data.images[i]
        //文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        //todo 2.数据存储到云数据库中
        //数据库：内容、图片(云存储)  1.云存储 fileID  云文件ID
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 100000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res)
            reslove()
          },
          fail: (err) => {
            console.log(err)
            reject()
          }
        })
      })
    }
    //存入云数据库



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
  }
})