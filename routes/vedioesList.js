const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post(util.front() + '/vedioesList', async (ctx, next) => {
  await userModel.vedioesList()
    .then(result=>{
        if (result.length){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

router.post(util.front() + '/vedioesList_detail', async (ctx, next) => {
  var data={
    user_id:ctx.request.body.user_id,
    vedioes_id:ctx.request.body.vedioes_id,
    topic_type:ctx.request.body.topic_type
  }
  // 当没有评论的时候查询详情信息
  let vedioesList_detail_top_result = await userModel.vedioesList_detail_top(ctx.request.body.vedioes_id)
  //查询该用户是否关注了该视频
  let status = 0
  let attention = await userModel.attention(data)
  if(attention.length == 1){
    status = 1
  }
  //查询当前用户是否购买了这个视频 0是不可看 1是可以看
  let isBuy = 0
  let buy = await userModel.userBuy(data)
  if(buy.length == 1){
      isBuy = 1
  }
  await userModel.vedioesList_detail(data)
  .then(result=>{
      if (result.length){ 
        let time = new Date(result[0].vedioes_time)
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
                let time = new Date(result[i].comment_time)
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
                vedioes:result[0].vedioes,
                headImage:result[0].headImg,
                image:result[0].image,
                time:time,
                money:result[0].money,
                status:status,
                isBuy:isBuy,
                id:result[0].vedioes_id,
                title:result[0].title,
                comments:new_comments
            }
        ctx.body = util.backData(200,new_result,'成功')             
      }else if(result.length == 0){
        if(vedioesList_detail_top_result.length > 0){
          let new_vedioesList_detail_top_result = {
            author:vedioesList_detail_top_result[0].author,
            headImg:vedioesList_detail_top_result[0].headImg,
            image:vedioesList_detail_top_result[0].image,
            title:vedioesList_detail_top_result[0].title,
            vedioes:vedioesList_detail_top_result[0].vedioes,
            vedioes_time:vedioesList_detail_top_result[0].vedioes_time,
            id:vedioesList_detail_top_result[0].vedioes_id,
            money:vedioesList_detail_top_result[0].money,
            isBuy:isBuy,
            status:status
          }
          ctx.body = util.backData(200,new_vedioesList_detail_top_result,'成功')
        }else{
          ctx.body = util.backData(400,null,'失败')
        }
      }else{
        ctx.body = util.backData(400,null,'失败')
      }                         
  })
})

//关注
router.post(util.front() + '/vedioesAttention', async (ctx, next) => {
  const data = [
    ctx.request.body.user_id,
    ctx.request.body.to_id,
    ctx.request.body.topic_type
  ]
  await userModel.insertAttention(data)
    .then(result=>{
        if (result.affectedRows == 1){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})
//添加购物车
router.post(util.front() + '/addCarts', async (ctx, next) => {
  const findData = {
      user_id: ctx.request.body.user_id,
      to_id:ctx.request.body.to_id,
      topic_type:ctx.request.body.topic_type
  }
  let findResult = await userModel.findCarts(findData)
  if(findResult.length == 1){
    ctx.body = util.backData(201,findResult,'已经添加到购物车了') 
  }else{
    const data = [
        ctx.request.body.user_id,
        ctx.request.body.to_id,
        ctx.request.body.topic_type
    ]
    await userModel.insertCarts(data)
        .then(result=>{
            if (result.affectedRows == 1){ 
                ctx.body = util.backData(200,result,'成功')           
            }else{
                ctx.body = util.backData(400,null,'失败')
            }                         
        })
  }
})

router.post(util.front() + '/cancelVedioesAttention', async (ctx, next) => {
  const data = {
    user_id:ctx.request.body.user_id,
    to_id:ctx.request.body.to_id,
    topic_type:ctx.request.body.topic_type
  }
  await userModel.cancelVedioesAttention(data)
    .then(result=>{
        if (result.affectedRows == 1){ 
            ctx.body = util.backData(200,result,'成功')           
        }else{
            ctx.body = util.backData(400,null,'失败')
        }                         
    })
})

module.exports = router
