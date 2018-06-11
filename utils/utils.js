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

module.exports = {
  backData
}