const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const clients = require('./client')
// const utilsClient = clients['utilsProxyClient']
const mallClient = clients['mallProxyClient']
const log = require('./lib/log')('notify')

router.post('/alipay', async function (req, res) {
  log.info('/alipay body:' , body)
  let data = {
    ...req.body
  }
  data.uuid = uuid.v4()
  ret = await mallClient.request('notify_alipay', data)

  console.log('/alipay ret:', ret)
  if (ret.code === '0'){
    res.send('success')
  } else {
    res.send('fail')
  }
  // return res.json(ret)

})