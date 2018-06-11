const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post('/registerUser', async (ctx, next) => {
  var user={
    name:ctx.request.body.name,
    password:ctx.request.body.password
  }
  await userModel.registerUser(user.name)
    .then(result=>{
        // var res=JSON.parse(JSON.stringify(reslut))
        console.log(result.length)
        if (result.length){ 
            ctx.body = util.backData(200,result,'用户已存在，请重新输入名称')           
        }else{
            // ctx.session.user=ctx.request.body.name
            userModel.insertData([ctx.request.body.name,ctx.request.body.password])
            ctx.body = util.backData(200,null,'注册成功')
        }                         
    })
})

module.exports = router
