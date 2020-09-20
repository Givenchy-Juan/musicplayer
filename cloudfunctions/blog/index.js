// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCollection = db.collection('blog')
const wxContext = cloud.getWXContext()


// 云函数入口函数
exports.main = async(event, context) => {
    const app = new TcbRouter({
        event
    })
    app.router('list', async(ctx, next) => {
            const keyword = event.keyword
            let w = {}
            if (keyword.trim() != '') {
                w = {
                    content: db.RegExp({
                        regexp: keyword,
                        options: 'i' //可以忽略大小写
                    })
                }
            }
            let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
                .orderBy('createTime', 'desc').get().then(res => {
                    return res.data
                })
            ctx.body = blogList
        }),


        app.router('getListByOpenid', async(ctx, next) => {
            ctx.body = await blogCollection.where({
                    _openid: wxContext.OPENID
                }).skip(event.start).limit(event.count)
                .orderBy('createTime', 'desc').get().then((res) => {
                    return res.data
                })
        })

    return app.serve()
}