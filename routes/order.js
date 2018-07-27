const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post(util.front() + '/getOrderDetail', async (ctx, next) => {
  let newResult = []
  for(let i =0;i<ctx.request.body.orderIds.length;i++){
    await userModel.getOrderDetail(ctx.request.body.orderIds[i])
      .then(result =>{
          if(result.length){
            newResult.push(result[0])
          }
      })
  } 
  ctx.body = util.backData(200,newResult,'成功')
})

module.exports = router