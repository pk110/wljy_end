/*
 *工具类
 */

// 接口返回数据
let backData = (code,data,message) =>{
  return {
    code:code,
    data:data,
    message:message
  }
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

module.exports = {
  backData,
  formateTimes,
  formateTime,
  formatDateTime
}

