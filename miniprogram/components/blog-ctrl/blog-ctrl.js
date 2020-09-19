// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blogId: String
    },
    externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
    /**
     * 组件的初始数据
     */
    data: {
        //登录组件是否显示
        loginShow: false,
        //底部弹出层，是否显示
        modalShow: false,
        content: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onComment() {
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                            success: (res) => {
                                userInfo = res.userInfo
                                    //显示评论弹出层
                                this.setData({
                                    modalShow: true,
                                })
                            }
                        });
                    } else {
                        this.setData({
                            loginShow: true
                        })


                    }
                }
            });
        },
        onLoginsuccess(event) {
            userInfo = event.detail
                //授权框消失，评论框显示
            this.setData({
                loginShow: false,
            }, () => {
                this.setData({
                    modalShow: true,
                })
            })
        },
        onLoginfail() {
            wx.showModal({
                title: '授权用户才能进行评价',
            });
        },

        onSend(event) {
            let formId = event.detail.formId
                //将数据插入云数据库
            let content = event.detail.value.content
            if (content.trim() == '') {
                wx.showModal({
                    title: '评论内容不能为空'
                });
                return
            }
            wx.showLoading({
                title: '评价中',
                mask: true,
            });
            db.collection('blog-comment').add({
                    data: {
                        content,
                        createTime: db.serverDate(),
                        blogId: this.properties.blogId,
                        nickName: userInfo.nickName,
                        avatarUrl: userInfo.avatarUrl
                    }
                }).then((res) => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '评论成功',
                    });
                    this.setData({
                        modalShow: false,
                        content: '',
                    })
                })
                //推送模板消息
        }
    }
})