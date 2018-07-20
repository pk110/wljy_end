//中间件编写

//异步编写
const loggerAsync = () =>  {
  return async (ctx, next) => {
    const start = Date.now()

    await next()

    const responseTime = (Date.now() - start)
    console.log(`接口响应时间为: ${responseTime / 1000}s`)
  }
}

//同步编写
const loggerCommon = () =>  {
  (ctx, next) => {
    const start = Date.now();
    return next().then(() => {
      const responseTime = (Date.now() - start)
      console.log(`中间件响应时间为: ${responseTime / 1000}s`)
    });
  }
}

module.exports = {
  loggerAsync,
  loggerCommon
}