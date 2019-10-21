const clientConfig = require('./config.json')
const jayson = require('jayson')
const uuid = require('uuid')

// rpc客户端请求
const rpcClient = jayson.client

let rpcRequest = (client, func, args) => {
  return new Promise((r, j) => {
    client.request(func, args, (err, response) => {
      if (err) {
        console.error(err.message || err)
        r({
          code: -1,
          message: err.message || err
        })
      } else {
        r(response.result || {
          code: -1,
          message: 'request error'
        })
      }


    });
  })
}

class Client {

  constructor(opt) {
    this.config = {
      host: opt.host,
      port: opt.port
    }
  }

  async request(name, data = {}) {
    let config = this.config

    let client = rpcClient.http({
      host: config.host,
      port: config.port
    })

    let rpcFunc = name
    let rpcArgs = data
    rpcArgs.uuid = data.uuid || uuid.v4()

    let rpcRet = await rpcRequest(client, rpcFunc, rpcArgs)

    return rpcRet
  }
}

let clients = {}

Object.keys(clientConfig).forEach(k => {
  clients[k + 'ProxyClient'] = new Client(clientConfig[k])
})
module.exports = clients

// module.exports = {
//   wxProxyClient: new Client(clientConfig.wx),
//   baseProxyClient: new Client(clientConfig.base)
// }