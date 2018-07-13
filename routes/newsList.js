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
    user_id:ctx.request.body.user_id,
    news_id:ctx.request.body.news_id,
    topic_type:ctx.request.body.topic_type
  }   
  // 当没有评论的时候查询详情信息
  let newsList_detail_top_result = await userModel.newsList_detail_top(ctx.request.body.news_id)
  //查询该用户是否关注了该视频
  let status = 0
  let attention = await userModel.attention(data)
  if(attention.length == 1){
    status = 1
  }
  await userModel.newsList_detail(data)
  .then(result=>{
      if (result.length){ 
        let time = new Date(result[0].time)
        time = util.timePrefix(time.getFullYear())+'-'+util.timePrefix(time.getMonth())+'-'+util.timePrefix(time.getDay())+' '+util.timePrefix(time.getHours())+':'+util.timePrefix(time.getMinutes())
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
                        reply_user_id:result[i].reply_user_id,
                        re_to_name:result[j].re_to_name,
                        re_to_userImg:result[j].re_to_userImg
                    })
                }
            }
            //说明第一条评论是有人评论的
            if(isBreak == true){
                let time = new Date(result[i].time)
                time = util.timePrefix(time.getMonth())+'-'+util.timePrefix(time.getDay())+' '+util.timePrefix(time.getHours())+':'+util.timePrefix(time.getMinutes())
                //把第一条人的回复放在里面
                if(result[i].re_name !== null){
                    new_replys.push({
                            re_name:result[i].re_name,
                            re_userImg:result[i].re_userImg,
                            re_content:result[i].re_content,
                            reply_user_id:result[i].reply_user_id,
                            re_to_name:result[i].re_to_name,
                            re_to_userImg:result[i].re_to_userImg
                        })
                }
                new_comments.push({
                    comment_name:result[i].comment_name,
                    comment_user_id:result[i].comment_user_id,
                    comment_id:result[i].id,
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
                id:result[0].news_id,
                title:result[0].title,
                comments:new_comments,
                status:status
            }
        ctx.body = util.backData(200,new_result,'成功')             
      }else if(result.length == 0){
        if(newsList_detail_top_result.length > 0){
          let newsList_detail_top_resultLast = {
            author:newsList_detail_top_result[0].author,
            headImg:newsList_detail_top_result[0].headImage,
            image:newsList_detail_top_result[0].image,
            title:newsList_detail_top_result[0].title,
            content:newsList_detail_top_result[0].content,
            time:newsList_detail_top_result[0].time,
            id:newsList_detail_top_result[0].news_id,
            status:status
          }
          ctx.body = util.backData(200,newsList_detail_top_resultLast,'成功')
        }else{
          ctx.body = util.backData(400,null,'失败')
        }
      }else{
        ctx.body = util.backData(400,null,'失败')
      }                         
  })
})

module.exports = router
