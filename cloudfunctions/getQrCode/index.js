// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const result = await cloud.openapi.wxacode.getUnlimited({
            scene: wxContext.OPENID,
            // page:扫描进入的页面，但必须等小程序上线之后，才能正常设置跳转
            //获取小程序对应的码时，在对应的页面,js文件中，console.log(options.scene)即可
            lineColor: {
                'r': 245,
                'g': 109,
                'b': 122
            }
        })
        // console.log(result);
    const upload = await cloud.uploadFile({
        cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
        fileContent: result.buffer
    })
    return upload.fileID
}