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
  await userModel.newsList_detail(news_id.news_id)
    .then(result=>{
        console.log(result)
        if (result.length){
            let time = new Date(result[0].time)
            time = time.getFullYear()+'-'+time.getMonth()+'-'+time.getDay()+' '+time.getHours()+':'+time.getMinutes()
            let new_comments = []
            for(let i = 0;i<result.length;i++){
              new_comments.push({
                  comment_content:result[i].comment_content,
                  comment_user:result[i].name,
                  comment_userImg:result[i].userImg
              })
            }
            let new_result = {
                  author:result[0].author,
                  content:result[0].content,
                  headImage:result[0].headImage,
                  image:result[0].image,
                  time:time,
                  title:result[0].title,
                  comments:new_comments
              }
            ctx.body = util.backData(200,new_result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

module.exports = router
