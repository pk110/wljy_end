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

router.post('/vedioesList_detail', async (ctx, next) => {
  var data={
    vedioes_id:ctx.request.body.vedioes_id,
    topic_type:ctx.request.body.topic_type
  }
  await userModel.vedioesList_detail(data)
  .then(result=>{
      console.log(result)
      if (result.length){ 
        let time = new Date(result[0].time)
        time = time.getFullYear()+'-'+time.getMonth()+'-'+time.getDay()+' '+time.getHours()+':'+time.getMinutes()
        let new_comments = []
        for(let i = 0;i<result.length;i++){
            let new_replys = []
            for(let j = i+1;j<result.length;j++){
                if(result[i].id == result[j].id){
                    new_replys.push({
                        re_name:result[i].re_name,
                        re_userImg:result[i].re_userImg,
                        re_content:result[i].re_content,
                        re_to_name:result[i].re_to_name,
                        re_to_userImg:result[i].re_to_userImg
                    },{
                        re_name:result[j].re_name,
                        re_userImg:result[j].re_userImg,
                        re_content:result[j].re_content,
                        re_to_name:result[j].re_to_name,
                        re_to_userImg:result[j].re_to_userImg
                    })
                }
            }
            if(new_replys.length !== 0){
                let time = new Date(result[i].time)
                time = time.getMonth()+'-'+time.getDay()+' '+time.getHours()+':'+time.getMinutes()
                new_comments.push({
                    comment_name:result[i].comment_name,
                    comment_userImg:result[i].comment_userImg,
                    comment_content:result[i].comment_content,
                    time:time,
                    new_replys:new_replys
                })
            }else{
              let time = new Date(result[i].time)
              time = time.getMonth()+'-'+time.getDay()+' '+time.getHours()+':'+time.getMinutes()
              new_comments.push({
                comment_name:result[i].comment_name,
                comment_userImg:result[i].comment_userImg,
                comment_content:result[i].comment_content,
                time:time
              })
            }
        }
        let new_result = {
              author:result[0].author,
              vedioes:result[0].vedioes,
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
