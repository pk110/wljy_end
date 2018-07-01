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
  var data={
    news_id:ctx.request.body.news_id,
    topic_type:ctx.request.body.topic_type
  }
  await userModel.newsList_detail(data)
    .then(result=>{
        if (result.length){
            let time = new Date(result[0].time)
            time = time.getFullYear()+'-'+time.getMonth()+'-'+time.getDay()+' '+time.getHours()+':'+time.getMinutes()
            let new_comments = []
            let catchAgain = []
            for(let i = 0;i<result.length;i++){
                let new_replys = []
                let isBreak = true  
                //检查当前的id是不是没有被之前的评论回复给合并过
                for(let k =0;k<catchAgain.length;k++){
                    if(result[i].id == catchAgain[k]){
                        isBreak = false
                        break
                    }
                }
                for(let j = i+1;j<result.length;j++){
                    if(isBreak == false){
                        break
                    }
                    //把所有相同评论的放在同一个评论下面
                    if(result[i].id == result[j].id){
                        catchAgain.push(result[j].id)
                        new_replys.push({
                            re_name:result[j].re_name,
                            re_userImg:result[j].re_userImg,
                            re_content:result[j].re_content,
                            re_to_name:result[j].re_to_name,
                            re_to_userImg:result[j].re_to_userImg
                        })
                    }
                }
                //说明第一条评论是有人评论的
                if(isBreak == true){
                    let time = new Date(result[i].time)
                    time = time.getMonth()+'-'+time.getDay()+' '+time.getHours()+':'+time.getMinutes()
                    //把第一条人的回复放在里面
                    if(result[i].re_name !== null){
                        new_replys.push({
                                re_name:result[i].re_name,
                                re_userImg:result[i].re_userImg,
                                re_content:result[i].re_content,
                                re_to_name:result[i].re_to_name,
                                re_to_userImg:result[i].re_to_userImg
                            })
                    }
                    new_comments.push({
                        comment_name:result[i].comment_name,
                        comment_userImg:result[i].comment_userImg,
                        comment_content:result[i].comment_content,
                        time:time,
                        new_replys:new_replys
                    })
                }
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
