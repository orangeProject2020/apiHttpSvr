const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV

let config = {
  port: 10000,
  portFile: 10021,
  hostFile: 'http://127.0.0.1:10021',
  // api请求渠道配置
  channels: [{
    id: '886',
    key: 'qsopifkhjjgjgfossfngnjgdsknkjlkljs'
  }, {
    id: '887',
    key: 'sdgjshhgdsagjdjkhkklgskjesegauhopqpogb'
  }]
}

if (fs.existsSync(path.join(__dirname, './' + env + '.js'))) {

  let envConfig = require('./' + env)
  console.log('load config env:', env)
  if (envConfig) {
    config = Object.assign(config, envConfig)
  }
}

module.exports = config