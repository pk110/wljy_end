var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});

let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        resolve( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}

// users=
// `create table if not exists users(
//  id INT NOT NULL AUTO_INCREMENT,
//  name VARCHAR(100) NOT NULL,
//  pass VARCHAR(40) NOT NULL,
//  PRIMARY KEY ( id )
// );`

// posts=
// `create table if not exists posts(
//  id INT NOT NULL AUTO_INCREMENT,
//  name VARCHAR(100) NOT NULL,
//  title VARCHAR(40) NOT NULL,
//  content  VARCHAR(40) NOT NULL,
//  uid  VARCHAR(40) NOT NULL,
//  moment  VARCHAR(40) NOT NULL,
//  comments  VARCHAR(40) NOT NULL DEFAULT '0',
//  pv  VARCHAR(40) NOT NULL DEFAULT '0',
//  PRIMARY KEY ( id )
// );`

// comment=
// `create table if not exists comment(
//  id INT NOT NULL AUTO_INCREMENT,
//  name VARCHAR(100) NOT NULL,
//  content VARCHAR(40) NOT NULL,
//  postid VARCHAR(40) NOT NULL,
//  PRIMARY KEY ( id )
// );`

let createTable = function( sql ) {
  return query( sql, [] )
}

// 建表
// createTable(users)
// createTable(posts)
// createTable(comment)

// 注册用户
let insertData = function( value ) {
  let _sql = `insert into tb_users(name,password) values(?,?);`
  return query( _sql, value )
}
// 发表文章
let insertPost = function( value ) {
  let _sql = "insert into posts(name,title,content,uid,moment) values(?,?,?,?,?);"
  return query( _sql, value )
}
// 更新文章评论数
let updatePostComment = function( value ) {
  let _sql = "update posts set  comments=? where id=?"
  return query( _sql, value )
}

// 更新浏览数
let updatePostPv = function( value ) {
  let _sql = "update posts set  pv=? where id=?"
  return query( _sql, value )
}

// 发表评论
let insertComment = function( value ) {
  let _sql = "insert into comment(name,content,postid) values(?,?,?);"
  return query( _sql, value )
}
// 通过名字查找用户
let findDataByName = function (  name ) {
  let _sql = `
    SELECT * from tb_users
      where name="${name}"
      `
  return query( _sql)
}
// 通过文章的名字查找用户
let findDataByUser = function (  name ) {
  let _sql = `
    SELECT * from posts
      where name="${name}"
      `
  return query( _sql)
}
// 通过文章id查找
let findDataById = function (  id ) {
  let _sql = `
    SELECT * from posts
      where id="${id}"
      `
  return query( _sql)
}
// 通过评论id查找
let findCommentById = function ( id ) {
  let _sql = `
    SELECT * FROM comment where postid="${id}"
      `
  return query( _sql)
}

// 查询所有文章
let findAllPost = function (  ) {
  let _sql = `
    SELECT * FROM posts
      `
  return query( _sql)
}
// 更新修改文章
let updatePost = function(values){
  let _sql=`update posts set  title=?,content=? where id=?`
  return query(_sql,values)
}
// 删除文章
let deletePost = function(id){
  let _sql=`delete from posts where id = ${id}`
  return query(_sql)
}
// 删除评论
let deleteComment = function(id){
  let _sql=`delete from comment where id = ${id}`
  return query(_sql)
}
// 删除所有评论
let deleteAllPostComment = function(id){
  let _sql=`delete from comment where postid = ${id}`
  return query(_sql)
}
// 查找
let findCommentLength = function(id){
  let _sql=`select content from comment where postid in (select id from posts where id=${id})`
  return query(_sql)
}


/*
  新增mysql字段为未来教育
*/

// 注册用户表
let registerUser = function( value ) {
  let _sql = `insert into tb_users(name,sex,userImg) values(?,?,?);`
  return query( _sql, value )
}

// 用户绑定手机号到用户表
let bindPhone = function (  value ) {
  let _sql = `
      update tb_users set  phone=${value.phone} where id=${value.id}
      `
  return query( _sql)
}

//根据id查询当前用户是否在用户列表中
let IsIdUser = function(value){
  let _sql = `
    SELECT * from tb_users
      where id="${value}"
      `
  return query(_sql)
}

//根据名字查询当前用户是否在用户列表中
let IsNameUser = function(value){
  let _sql = `
    SELECT * from tb_users
      where name="${value}"
      `
  return query(_sql)
}


//查询通告信息表
let notice = function (  title ) {
  let _sql = `
    SELECT * from tb_notice
      where title="${title}"
      `
  return query( _sql)
}

//查询直播页列表
let livesList = function (  ) {
  let _sql = `
    SELECT * FROM tb_livesList
      `
  return query( _sql)
}

//查询直播页列表前四个
let livesListFour = function (  ) {
  let _sql = `
    SELECT * FROM tb_livesList limit 0,4
      `
  return query( _sql)
}

//查询新闻页列表
let newsList = function (  ) {
  let _sql = `
    SELECT * FROM tb_newslist
      `
  return query( _sql)
}

//查询新闻页列表前四个
let newsListFour = function (  ) {
  let _sql = `
    SELECT * FROM tb_newslist limit 0,4
      `
  return query( _sql)
}


//通过新闻页列表查询新闻页详情
let newsList_detail = function ( data ) {
  let _sql = 
        `select 
          new.author, 
          new.image, 
          new.title,
          new.headImage,
          new.time,
          new.news_id,
          new.content,
          co.id,
          co.content as 'comment_content',
          co.time,
          co.user_id as 'comment_user_id',
          us.name as 'comment_name',
          us.userImg as 'comment_userImg',
          re.content as 're_content',
					re.user_id as 'reply_user_id',
          u1.name as 're_name',
          u1.userImg as 're_userImg',
          u2.name as 're_to_name',
          u2.userImg as 're_to_userImg'
          from 
          tb_newslist new left join tb_comment co on co.topic_id=new.news_id
          left join tb_users us on us.id=co.user_id
          left join tb_reply re on re.comment_id=co.id
          left join tb_users u1 on u1.id=re.user_id
          left join tb_users u2 on u2.id=re.to_id
          where new.news_id=${data.news_id} and co.topic_type = ${data.topic_type}
          `
  return query( _sql)
}

//通过新闻页列表查询新闻页详情
let newsList_detail_top = function ( data ) {
  let _sql = 
        `select 
          ne.author, 
          ne.image, 
          ne.title,
          ne.headImage,
          ne.time,
          ne.news_id,
          ne.content
          from tb_newslist as ne where ne.news_id=${data}
          `
  return query( _sql)
}

//发表新闻评论
let insertNewsComment = function( value ) {
  let _sql = "insert into tb_comment(topic_id,topic_type,content,user_id,time) values(?,?,?,?,?);"
  return query( _sql, value )
}

//发表新闻回复评论
let insertNewsReply = function( value ) {
  let _sql = "insert into tb_reply(comment_id,content,user_id,to_id) values(?,?,?,?);"
  return query( _sql, value )
}

//检验新闻详情页是否有重复用户提交
let getCountByUserNameNews = function(value) {
  let _sql = 
    `select * from tb_comment where topic_id = ${value.topic_id} and  topic_type= ${value.topic_type} and user_id = ${value.user_id}`
  return query( _sql)
}

//查询视频页列表
let vedioesList = function (  ) {
  let _sql = `
    SELECT * FROM tb_vedioeslist
      `
  return query( _sql)
}
//查询视频页列表前四个
let vedioesListFour = function (  ) {
  let _sql = `
    SELECT * FROM tb_vedioeslist limit 0,4
      `
  return query( _sql)
}

//通过视频页列表查询视频页详情包括评论
let vedioesList_detail = function ( data ) {
  let _sql = 
        `select 
          ve.author, 
          ve.image, 
          ve.title,
          ve.headImg,
          ve.time as 'vedioes_time',
          ve.vedioes,
          ve.money,
          ve.id as 'vedioes_id',
          co.id,
          co.content as 'comment_content',
          co.time as 'comment_time',
					co.user_id as 'comment_user_id',
          us.name as 'comment_name',
          us.userImg as 'comment_userImg',
          re.content as 're_content',
					re.user_id as 'reply_user_id',
          u1.name as 're_name',
          u1.userImg as 're_userImg',
          u2.name as 're_to_name',
          u2.userImg as 're_to_userImg'
          from 
          tb_vedioeslist ve left join tb_comment co on co.topic_id=ve.id
          left join tb_users us on us.id=co.user_id
          left join tb_reply re on re.comment_id=co.id
          left join tb_users u1 on u1.id=re.user_id
          left join tb_users u2 on u2.id=re.to_id
          where ve.id=${data.vedioes_id} and co.topic_type = ${data.topic_type}
          `
  return query( _sql)
}

//通过视频页列表查询视频页详情
let vedioesList_detail_top = function ( data ) {
  let _sql = 
        `select 
          ve.author, 
          ve.image, 
          ve.title,
          ve.headImg,
          ve.time as 'vedioes_time',
          ve.vedioes,
          ve.id as 'vedioes_id'
          from tb_vedioeslist as ve where ve.id=${data}
          `
  return query( _sql)
}


//发表视频评论
let insertVedioesComment = function( value ) {
  let _sql = "insert into tb_comment(topic_id,topic_type,content,user_id,time) values(?,?,?,?,?);"
  return query( _sql, value )
}

//发表视频回复评论
let insertVedioesReply = function( value ) {
  let _sql = "insert into tb_reply(comment_id,content,user_id,to_id) values(?,?,?,?);"
  return query( _sql, value )
}

//检验视频详情页是否有重复用户提交
let getCountByUserName = function(value) {
  let _sql = 
    `select * from tb_comment where topic_id = ${value.topic_id} and  topic_type= ${value.topic_type} and user_id = ${value.user_id}`
  return query( _sql)
}

//检查用户是否购买了当前的视频
let userBuy = function(value){
  let _sql = `select * from tb_userBuy where topic_type=${value.topic_type} and to_id=${value.vedioes_id || value.news_id} and user_id=${value.user_id}`
  return query(_sql)
}

//用户关注新闻、视频
let attention = function(value){
  let _sql = `select * from tb_userAttention where topic_type=${value.topic_type} and to_id=${value.vedioes_id || value.news_id} and user_id=${value.user_id}`
  return query(_sql)
}

//插入数据库关注
let insertAttention = function(value){
  let _sql = `insert into tb_userattention(user_id,to_id,topic_type) values(?,?,?);`
  return query( _sql, value )
}

//查找购物车同一个账户是否有相同商品
let findCarts = function(value){
  let _sql = `select * from tb_carts where topic_type=${value.topic_type} and to_id=${value.to_id} and user_id=${value.user_id}`
  return query(_sql)
}

//用户加入购物车
let insertCarts = function(value){
  let _sql = `insert into tb_carts(user_id,to_id,topic_type) values(?,?,?);`
  return query( _sql, value )
}

//获取用户购物车数量
let getCartsNumber = function(value){
  let _sql = 
    `select * from tb_carts where user_id = ${value}`
  return query( _sql)
}

//删掉插入的数据库关注
let cancelVedioesAttention = function(value){
  let _sql = `delete from tb_userattention where user_id = ${value.user_id} and to_id = ${value.to_id} and topic_type=${value.topic_type}` 
  return query(_sql)
}

//我的收藏视频
let myCollectionVedioes = function(value){
  const start = (value.currentPage - 1) * 10;
  let _sql = `select 
          ve.author, 
          ve.image, 
          ve.title,
          ve.time,
          ve.id,
          2 as topic_type
          from 
          tb_userattention ua left join tb_vedioeslist ve on ua.to_id = ve.id
          where ua.user_id=${value.user_id} and ua.topic_type = 2
          limit ${start},10`
  return query(_sql)
}

//我的收藏新闻
let myCollectionNews = function(value){
  const start = (value.currentPage - 1) * 10;
  let _sql = `select 
          ne.author, 
          ne.image, 
          ne.title,
          ne.time,
          ne.news_id,
          3 as topic_type
          from 
          tb_userattention ua left join tb_newslist ne on ua.to_id = ne.news_id
          where ua.user_id=${value.user_id} and ua.topic_type = 3
          limit ${start},10`
  return query(_sql)
}

//我的购物车列表分页
let myCartsList = function(value){
  const start = (value.currentPage - 1) * 10;
  let _sql = `select * from tb_carts where user_id = ${value.user_id} limit ${start},10`
  return query(_sql)
}

//通过勾选购物车列表获取订单信息
let getOrderDetail = function(data){
  let _sql = 
        `select *
          from tb_vedioeslist as ve where ve.id=${data}
          `
  return query( _sql)
}

module.exports={
  query,
  createTable,
  insertData,
  findDataByName,
  insertPost,
  findAllPost,
  findDataByUser,
  findDataById,
  insertComment,
  findCommentById,
  updatePost,
  deletePost,
  deleteComment,
  findCommentLength,
  updatePostComment,
  deleteAllPostComment,
  updatePostPv,
  // 新增
  registerUser,
  bindPhone,
  IsIdUser,
  IsNameUser,
  notice,
  //直播
  livesList,
  livesListFour,
  //新闻
  newsList,
  newsList_detail,
  newsListFour,
  newsList_detail_top,
  getCountByUserNameNews,
  insertNewsComment,
  insertNewsReply,
  //视频
  vedioesList,
  vedioesList_detail,
  getCountByUserName,
  vedioesList_detail_top, 
  insertVedioesComment,
  insertVedioesReply,
  vedioesListFour,
  //用户关注新闻或者文章
  attention,
  //插入数据库关注
  insertAttention,
  cancelVedioesAttention,
  //我的模块
  myCollectionVedioes,
  myCollectionNews,
  //添加至购物车
  insertCarts,
  //查找购物车同一个账户是否有相同商品
  findCarts,
  //获取用户购物车数量
  getCartsNumber,
  //我的购物车列表
  myCartsList,
  //通过勾选购物车列表获取订单信息
  getOrderDetail,
  //检查用户是否购买了当前的视频
  userBuy
}