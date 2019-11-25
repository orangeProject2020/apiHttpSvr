const express = require('express')
const cors = require('cors');
const app = express()
const path = require('path')
// const jayson = require('jayson')
const md5 = require('md5')
const uuid = require('uuid')
const log = require('./lib/log')('app')

let CONFIG = require('./config')
CONFIG.rpcClients = require('./client/config.json')
const CLIENTS = require('./client')

var bodyParser = require('body-parser')
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(bodyParser.raw({
  type: 'application/xml'
}))
app.use(bodyParser.text({
  type: 'text/xml'
}))
app.use(methodOverride())

// 上传
app.use('/upload', require('./upload'))
app.use(cors())

// 获取时间戳
app.get('/timestamp', (req, res) => {
  return res.send(Date.now().toString())
})

// 接口签名验证
/**
 * 鉴权中间件
 * @param {
 *   headers {
 *     timestamp: 0, // 时间戳（毫秒）
 *     channel_id: '', // 渠道id
 *     sign_key: '' // 渠道对应签名key
 *   }
 *   body {
 *     sign: '' // 签名字段
 *   }
 * } req 
 * @param {*} res 
 * @param {*} next 
 */
const apiAuthCheck = async (req, res, next) => {


  let headers = req.headers || {}
  headers.uuid = headers.uuid || uuid.v4()

  log.info(headers.uuid, 'body', req.body)
  log.info(headers.uuid, 'headers', req.headers)

  let channelId = headers.channel_id || ''
  // let signKey = headers.sign_key || ''

  let timestamp = headers.timestamp
  log.info(headers.uuid, channelId, timestamp)

  if (timestamp - Date.now() > 5000) {
    return res.json({
      code: -1,
      message: 'header timestamp error'
    })
  }

  if (!channelId) {
    return res.json({
      code: -1,
      message: 'header param error'
    })
  }

  let channelsConfig = CONFIG.channels
  let channelKeys = {}
  channelsConfig.forEach(channel => {
    channelKeys[channel.id] = channel.key
  })

  let key = channelKeys[channelId]
  log.info(headers.uuid, channelId, key)

  let body = req.body || {}
  let sign = body.sign || ''

  if (!sign) {
    log.error(headers.uuid, channelId, 'no sign param')
    return res.json({
      code: -1,
      message: 'body param error : sign'
    })
  }

  // 建timestamp和key加入body进行签名
  body.timestamp = timestamp
  body.key = key

  let signStrArr = []
  Object.keys(body).sort().forEach(key => {
    if (key != 'sign' && typeof key !== 'array' && typeof key !== 'object') {
      signStrArr.push(`${key}=${body[key]}`)
    }
  })
  let signStr = signStrArr.join('&')
  log.info(headers.uuid, channelId, 'signStr', signStr)
  let signMd5 = md5(signStr)
  log.info(headers.uuid, channelId, 'signMd5', signMd5)
  log.info(headers.uuid, channelId, 'sign', sign)
  if (sign !== signMd5) {
    return res.json({
      code: -1,
      message: 'signature error'
    })
  }

  next()
}



app.use(apiAuthCheck)



// rpc客户端请求
// const rpcClient = jayson.client
// let rpcRequest = (client, func, args) => {
//   return new Promise((r, j) => {
//     client.request(func, args, (err, response) => {
//       if (err) {
//         console.error(err.message || err)
//         r({
//           code: -1,
//           message: err.message || err
//         })
//       }

//       console.log(response.result) // 2
//       r(response.result)
//     });
//   })
// }

// 处理rpc分发逻辑
/**
 * params {
 *  mod: 模块
 *  con: 业务controller
 *  func: 方法
 * }
 */
app.post('/:mod/:con/:func', async (req, res) => {

  let mod = req.params.mod
  let con = req.params.con
  let func = req.params.func

  let ret = {
    code: 0,
    message: 'success',
    data: {}
  }

  if (!CONFIG.rpcClients.hasOwnProperty(mod)) {
    ret.code = 1
    ret.message = 'error module'
    return res.json(ret)
  }

  // let clientConfig = CONFIG.rpcClients[mod]
  // let client = rpcClient.http({
  //   host: clientConfig.host,
  //   port: clientConfig.port
  // })
  let client = CLIENTS[mod + 'ProxyClient']

  let rpcFunc = con + '_' + func
  let rpcArgs = req.body || {}
  rpcArgs.uuid = req.headers.uuid || '123456'

  let token = req.headers.token || req.query.token || req.body.token || ''
  if (token) {
    rpcArgs.TOKEN = token
  }
  log.info(req.headers.uuid, req.headers.channel_id, rpcFunc, 'args', rpcArgs)

  // rpcRet = await rpcRequest(client, rpcFunc, rpcArgs)
  rpcRet = await client.request(rpcFunc, rpcArgs)
  log.info(req.headers.uuid, req.headers.channel_id, rpcFunc, 'ret', rpcRet)
  // console.log(rpcRet)
  return res.json(rpcRet)
})

// 错误处理
const logErrors = (err, req, res, next) => {
  console.error(err.stack)
  next(err)
}

const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    return res.status(500).json({
      code: -1,
      message: '500 error'
    })
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  return res.send('500 error')
}

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(CONFIG.port, () => {
  console.log('api server start at port: ', CONFIG.port)

  const appFileServer = express()
  appFileServer.use('/uploads', express.static(path.join(__dirname, './uploads')))
  appFileServer.listen(CONFIG.portFile, () => {
    console.log('file server start at port: ', CONFIG.portFile)
  })
})