const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
// 下面以koa2-cors为例，
const cors = require('koa2-cors');

const login = require('./routes/login')
const users = require('./routes/register')
const index = require('./routes/index')
const livesList = require('./routes/livesList')
const newsList = require('./routes/newsList')
const vedioesList = require('./routes/vedioesList')
const commentVedioes = require('./routes/commentVedioes')
const commentNews = require('./routes/commentNews')
const my = require('./routes/my')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 具体参数我们在后面进行解释
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(login.routes(), login.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(livesList.routes(), livesList.allowedMethods())
app.use(newsList.routes(), newsList.allowedMethods())
app.use(vedioesList.routes(), vedioesList.allowedMethods())
app.use(commentVedioes.routes(), commentVedioes.allowedMethods())
app.use(commentNews.routes(), commentNews.allowedMethods())
app.use(my.routes(), my.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
