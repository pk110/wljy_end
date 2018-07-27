const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post(util.front() + '/register', async (ctx, next) => {
  var userMessage=[
    ctx.request.body.name,
    ctx.request.body.sex,
    ctx.request.body.userImg
  ]
  // 查询用户是否在用户表中 没有就添加一个
  let userResult = await userModel.IsNameUser(ctx.request.body.name)
  if(userResult.length){
    //查看对应的用户有没有phone
    if(userResult[0].phone !== null){  //1表示绑定了 0 表示没有绑定
      ctx.body = util.backData(200,{status:1,user_id:userResult[0].id},'用户已经绑定了') 
    }else{
      ctx.body = util.backData(200,{status:0,user_id:userResult[0].id},'用户没有被绑定') 
    }
  }else{
    let userAgainResult = await userModel.registerUser(userMessage)
    if (userAgainResult.affectedRows == 1){ 
      //入库以后我还需要找到用户对应的id
      await userModel.IsNameUser(ctx.request.body.name)
        .then(result=>{
          //查看对应的用户有没有phone
          if(result[0].phone !== null){  //1表示绑定了 0 表示没有绑定
            ctx.body = util.backData(200,{status:1,user_id:result[0].id},'用户已经绑定了') 
          }else{
            ctx.body = util.backData(200,{status:0,user_id:result[0].id},'用户没有被绑定') 
          }                        
      })
    }else{
        ctx.body = util.backData(400,null,'入库失败')
    }
  }
})

router.post(util.front() + '/bindphone', async (ctx, next) => {
  var user={
    id:ctx.request.body.user_id,
    code:ctx.request.body.code,
    phone:ctx.request.body.phone
  }
  //在手机号入库之前要转接接口进行验证验证码是否正确
  // 查询用户是否在用户表中
  let userResult = await userModel.IsIdUser(ctx.request.body.user_id)
  if(userResult.length){
    await userModel.bindPhone(user)
      .then(result=>{
          if (result.affectedRows == 1){ 
              ctx.body = util.backData(200,result,'绑定成功')           
          }else{
              ctx.body = util.backData(400,null,'绑定失败')
          }                         
      })
  }else{
    ctx.body = util.backData(400,null,'用户不存在')
  }
})

//获取用户购物车数量
router.post(util.front() + '/getCartsNumber', async (ctx, next) => {
  await userModel.getCartsNumber(ctx.request.body.user_id)
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,{cartsNumber:result.length},'成功')           
        }else{
            ctx.body = util.backData(400,{cartsNumber:0},'购物车数量为0')
        }                         
    })
})

module.exports = router
