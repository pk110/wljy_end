const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post('/vedioesList', async (ctx, next) => {
  await userModel.vedioesList()
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})


module.exports = router
