const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post('/vedioesComment', async (ctx, next) => {
  const args = {
    topic_id:ctx.request.body.topic_id,
    topic_type:2,
    user_id:ctx.request.body.user_id
  }
  //判断是否有用户重复评论
  let userNumResult = await userModel.getCountByUserName(args) 
  //用户名已被注册
  if(userNumResult.length > 0){   
    ctx.body = util.backData(300,null,'评论不能重复提交')
  }else{
    let time = new Date()
    time = util.formateTime(time)
    let topic_type = 2
    const data = [
      ctx.request.body.topic_id,
      topic_type,
      ctx.request.body.content,
      ctx.request.body.user_id,
      time
    ]
    await userModel.insertVedioesComment(data)
      .then(result=>{
          if (result.affectedRows == 1){ 
              ctx.body = util.backData(200,result,'成功')           
          }else{
              ctx.body = util.backData(400,null,'失败')
          }                         
      })
    }
})

router.post('/vedioesReply', async (ctx, next) => {
  const data = [
    ctx.request.body.comment_id,
    ctx.request.body.content,
    ctx.request.body.user_id,
    ctx.request.body.to_id
  ]
  await userModel.insertVedioesReply(data)
    .then(result=>{
        if (result.affectedRows == 1){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
  })

module.exports = router
