const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post(util.front() + '/notice', async (ctx, next) => {
    const title = {
        title:ctx.request.body.title
    }
  await userModel.notice(title.title)
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

router.post(util.front() + '/livesListFour', async (ctx, next) => {
  await userModel.livesListFour()
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

router.post(util.front() + '/newsListFour', async (ctx, next) => {
  await userModel.newsListFour()
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})


router.post(util.front() + '/vedioesListFour', async (ctx, next) => {
  await userModel.vedioesListFour()
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

module.exports = router
