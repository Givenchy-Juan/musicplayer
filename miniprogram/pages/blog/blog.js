// pages/blog/blog.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //控制底部弹出层是否显示
        modalShow: false,
        blogList:[]
    },
    //发布功能
    onPublish() {
        //需要判断用户是否授权过
        wx.getSetting({
            success: (result) => {
                // console.log(result)
                if (result.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: (result) => {
                            // console.log(result)
                            //成功的时候调用这个函数
                            this.onLoginSuccess({
                                detail: result.userInfo
                            })
                        },
                        fail: () => { },
                        complete: () => { }
                    });
                } else {
                    this.setData({
                        modalShow: true
                    })
                }
            },
            fail: () => { },
            complete: () => { }
        });
    },
    onLoginSuccess(event) {
        //授权成功的时候，将用户的信息传递了过来
        // console.log(event)
        const { detail } = event
        console.log(detail)
        wx.navigateTo({
            //将昵称和头像传递过去
            url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
        });
    },
    onLoginFail() {
        wx.showModal({
            title: '授权的用户才能发布博客',
            content: ''
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadBlogList()
    },
    _loadBlogList() {
        wx.cloud.callFunction({
            name:'blog',
            data:{
                $url:'list',
                start:0,
                count:10
            }
        }).then(res=>{
            this.setData({
                blogList:this.data.blogList.concat(res.result)
            })
        })
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

    }
})