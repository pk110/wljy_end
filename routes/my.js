const router = require('koa-router')()
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../bin/mysql.js');
//工具类
var util = require('../utils/utils')

router.post(util.front() + '/myCollection', async (ctx, next) => {
    const data = {
        user_id:ctx.request.body.user_id,
        currentPage:ctx.request.body.currentPage
    }
  // 获得视频关注列表
  let myCollectionVedioes = await userModel.myCollectionVedioes(data) 
  await userModel.myCollectionNews(data)
    .then(result=>{
        let newResult = []
        if(myCollectionVedioes.length){
            for(let i = 0;i<myCollectionVedioes.length;i++){
                let time = new Date(myCollectionVedioes[i].time)
                time = util.timePrefix(time.getMonth())+'-'+util.timePrefix(time.getDay())+' '+util.timePrefix(time.getHours())+':'+util.timePrefix(time.getMinutes())                
                newResult.push({
                    author:myCollectionVedioes[i].author,
                    image:myCollectionVedioes[i].image,
                    time:time,
                    topic_type:myCollectionVedioes[i].topic_type,
                    title:myCollectionVedioes[i].title,
                    id:myCollectionVedioes[i].id
                })
            }
        }
        if (result.length){ 
            for(let i = 0;i<result.length;i++){
                let time = new Date(result[i].time)
                time = util.timePrefix(time.getMonth())+'-'+util.timePrefix(time.getDay())+' '+util.timePrefix(time.getHours())+':'+util.timePrefix(time.getMinutes())                
                newResult.push({
                    author:result[i].author,
                    image:result[i].image,
                    time:time,
                    topic_type:result[i].topic_type,
                    title:result[i].title,
                    news_id:result[i].news_id
                })
            }          
        }
        ctx.body = util.backData(200,{
            currentPage:ctx.request.body.currentPage,
            list:newResult,
            total:myCollectionVedioes.length+result.length
        },'成功')                       
    })
})


module.exports = router
