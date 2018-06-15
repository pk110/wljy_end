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

users=
`create table if not exists users(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 pass VARCHAR(40) NOT NULL,
 PRIMARY KEY ( id )
);`

posts=
`create table if not exists posts(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 title VARCHAR(40) NOT NULL,
 content  VARCHAR(40) NOT NULL,
 uid  VARCHAR(40) NOT NULL,
 moment  VARCHAR(40) NOT NULL,
 comments  VARCHAR(40) NOT NULL DEFAULT '0',
 pv  VARCHAR(40) NOT NULL DEFAULT '0',
 PRIMARY KEY ( id )
);`

comment=
`create table if not exists comment(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 content VARCHAR(40) NOT NULL,
 postid VARCHAR(40) NOT NULL,
 PRIMARY KEY ( id )
);`

let createTable = function( sql ) {
  return query( sql, [] )
}

// 建表
createTable(users)
createTable(posts)
createTable(comment)

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
  let _sql = `insert into tb_users(name,password) values(?,?);`
  return query( _sql, value )
}

// 用户登录表
let loginUser = function (  name ) {
  let _sql = `
    SELECT * from tb_users
      where name="${name}"
      `
  return query( _sql)
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

//查询新闻页列表
let newsList = function (  ) {
  let _sql = `
    SELECT * FROM tb_newslist
      `
  return query( _sql)
}

//查询新闻页列表某一个
let newsList_one = function ( news_id ) {
  let _sql = `
    SELECT * FROM tb_newslist  where news_id="${news_id}"
      `
  return query( _sql)
}


//通过新闻页列表查询新闻详情
let newsList_detail = function ( news_id ) {
  let _sql = `
    SELECT * FROM tb_newslist_detail where news_id="${news_id}"
      `
  return query( _sql)
}

//查询视频页列表
let vedioesList = function (  ) {
  let _sql = `
    SELECT * FROM tb_vedioeslist
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
  loginUser,
  notice,
  livesList,
  newsList,
  newsList_one,
  vedioesList,
  newsList_detail
}