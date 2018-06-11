const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

// router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'Hello Koa 232424!'
//   })
// })

router.post('/loginUser', async (ctx, next) => {
  var user={
    name:ctx.request.body.name
    // ,
    // pass:ctx.request.body.password
  }
  await userModel.loginUser(user.name)
    .then(result=>{
        // var res=JSON.parse(JSON.stringify(reslut))
        console.log(result.length)
        if (result.length){ 
            ctx.body = util.backData(200,result,'登录成功')           
        }else{
            ctx.body = util.backData(404,null,'用户不存在')
            // ctx.session.user=ctx.request.body.name
            // userModel.insertData([ctx.request.body.name,md5(ctx.request.body.password)])
        }                         
    })
})

module.exports = router
