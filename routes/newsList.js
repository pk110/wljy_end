const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post('/newsList', async (ctx, next) => {
  await userModel.newsList()
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

router.post('/newsList_detail', async (ctx, next) => {  
  var news_id={
    news_id:ctx.request.body.news_id
  }
  console.log(news_id)
  await userModel.newsList_one(news_id.news_id)
    .then(newsList_result=>{
        if (newsList_result.length){
            await userModel.newsList_detail(news_id.news_id)
              .then(newsList_detail_result =>{
                console.log(newsList_detail_result)
              })
            // let new_result = []
            // for(let i = 0;i<result.length;i++){
            //   new_result.push({
            //     content:result[i].content,
            //     id:result[i].id,
            //     images:result[i].images.split('&&'),
            //     news_id:result[i].news_id
            //   })
            // }
            // console.log(new_result)
            // ctx.body = util.backData(200,new_result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

module.exports = router
