/*
 *工具类
 */

//前端API
let front = () =>{
  return '/front/api'
}

//后端API
let manager = () =>{
  return '/manager/api'
}

// 接口返回数据
let backData = (code,data,message) =>{
  return {
    code:code,
    data:data,
    message:message
  }
}

// 判断时间前面是否需要加0
let timePrefix = (v) => {
  return (v > 9 ? v : '0' + v)
}

//将当前时间转换成标准格式
let formateTime = (date) => {  
  var y = date.getFullYear();  
  var m = date.getMonth() + 1;  
  m = m < 10 ? ('0' + m) : m;  
  var d = date.getDate();  
  d = d < 10 ? ('0' + d) : d;  
  var h = date.getHours();  
  h=h < 10 ? ('0' + h) : h;  
  var minute = date.getMinutes();  
  minute = minute < 10 ? ('0' + minute) : minute;  
  var second=date.getSeconds();  
  second=second < 10 ? ('0' + second) : second;  
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
  // return y + '-' + m + '-' + d  
}

//将时间×转换成日期格式
let formatDateTime = (time, format) => {  
  var t = new Date(time);  
  var tf = function(i){return (i < 10 ? '0' : '') + i};  
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){  
      switch(a){  
          case 'yyyy':  
              return tf(t.getFullYear());  
              break;  
          case 'MM':  
              return tf(t.getMonth() + 1);  
              break;  
          case 'mm':  
              return tf(t.getMinutes());  
              break;  
          case 'dd':  
              return tf(t.getDate());  
              break;  
          case 'HH':  
              return tf(t.getHours());  
              break;  
          case 'ss':  
              return tf(t.getSeconds());  
              break;  
      }  
  })  
}

//时间格式字符串转为时间戳（毫秒）
let formateTimes = (time1) => {
  // var time1=‘2016-01-01 17:22:37’ 
  var date=new Date(time1.replace(/-/g, '/'));  //开始时间  
  return date.getTime();  
}

//外部接口的转接
/** 
 * @param key {int} APPId
 * @param start {string} 
 * @param end {string} 
*/
var fs = require('fs');
var http = require('http');
var qs = require('querystring');
let outsideIde = (key,start,end) =>{
  return (cb) => {
    var data = {
        key:key,
        start:start,
        end:end
    };

    /*请求MobAPI里的火车票查询接口*/
    var content = qs.stringify(data);
    var http_request = {
        hostname:'apicloud.mob.com',
        port:80,
        path:'/train/tickets/queryByStationToStation?' + content,
        method: 'GET'
    };

    var req = http.request(http_request,function(response){
        var body = '';
        response.setEncoding('utf-8');
        response.on('data',function(chunk){
            body += chunk;
        });
        response.on('end',function(){
            cb(null,body);
        });
    });

    req.end();
  }
}

//内部接口的转接
// 参考地址 http://nodejs.cn/api/http.html#http_http_request_options_callback
/** 
 * @param dataObj {int} 传递的JSON对象
 * @param urlRoot {string} 请求根地址
 * @param path {string} 请求地址
 * @param method {string} 请求方式 GET POST
*/

let insideIde = (dataObj,urlRoot,path,method) =>{
    /*请求自己内部的接口*/
  let data = new Promise((resolve, reject) => {
    var content = qs.stringify(dataObj);
    var http_request = {
        hostname:urlRoot,
        port:3000,
        path:path,
        method: method,
        headers: {
            "content-type": 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(content)
        }
    };

    var req = http.request(http_request,function(response){
        console.log(`状态码: ${response.statusCode}`);
        console.log(`响应头: ${JSON.stringify(response.headers)}`);
        var body = '';
        response.setEncoding('utf-8');
        response.on('data',(chunk) => {
          console.log(`响应主体: ${chunk}`);
          resolve(chunk)
        });
        response.on('end',() =>{
          console.log('响应中已无数据。');
        });
    });
    req.on('error', (e) => {
      console.error(`请求遇到问题: ${e.message}`);
    });
    
    // 写入数据到请求主体
    req.write(content);
    req.end();
  })
  return data
}

// 在其他接口里调用
// const data = {
//   'user_id':1,
//   'to_id':2,
//   'topic_type':3
// }
// util.insideIde(data,'192.168.11.106','/front/api/vedioesAttention','POST').then((date)=>{
//   console.log(date)
// })

module.exports = {
  front,
  manager,
  backData,
  formateTimes,
  formateTime,
  formatDateTime,
  timePrefix,
  insideIde,
  outsideIde
}

