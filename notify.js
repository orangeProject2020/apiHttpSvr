const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const clients = require('./client')
// const utilsClient = clients['utilsProxyClient']
const mallClient = clients['mallProxyClient']
const log = require('./lib/log')('notify')

router.post('/alipay', async function (req, res) {
  log.info('/alipay body:', req.body)
  let data = {
    ...req.body
  }
  // let json = `{"gmt_create":"2019-12-04 10:18:33","charset":"utf-8","seller_email":"qjcqki9352@sandbox.com","subject":"支付金额: ￥1499.00","sign":"CPVpZPEy656nOkStwAhUMAxGpo7rtMGIRSkut3wbD/v6C1zPpYJ7N+d0ykZuQ0+mU3oaebIZA4r8omy05lQaPgXY0K8F/XemAA0cqJKUFrotl2chsLXcG+t89AuRKqLf3StHW/jRC6TU6wOJnBcCbrI0Rio+CNC0H+g7HctBY01msATfwfIpMLNFmorhqNUiD8p4CiFr4g5XVRkcbx1oU0vuHZwulz7GjVOuyc4i4fyW0OT1a05KvB3iV7DpSVsK5fY73HlGaBj3YCd+n/ma++4M8u6wWMzFjV6iu5k6/HPk+fJgh478EKcGG+5v9Ezi8j0J+8bdFxADPSE61NUgKw==","buyer_id":"2088102175186124","invoice_amount":"1499.00","notify_id":"2019120400222101834086121000596681","fund_bill_list":"[{\"amount\":\"1499.00\",\"fundChannel\":\"ALIPAYACCOUNT\"}]","notify_type":"trade_status_sync","trade_status":"TRADE_SUCCESS","receipt_amount":"1499.00","buyer_pay_amount":"1499.00","app_id":"2016090900470172","sign_type":"RSA2","seller_id":"2088102174805259","gmt_payment":"2019-12-04 10:18:34","notify_time":"2019-12-04 10:18:35","version":"1.0","out_trade_no":"5acb799c7db749f3855812f22dcbdd02","total_amount":"1499.00","trade_no":"2019120422001486121000041499","auth_app_id":"2016090900470172","buyer_logon_id":"gpp***@sandbox.com","point_amount":"0.00"}`
  // let data = JSON.parse(json)
  data.uuid = uuid.v4()
  log.info('/alipay data:', data)
  let ret = await mallClient.request('order_notifyAlipay', data)

  log.info('/alipay ret:', ret)
  if (ret.code == 0) {
    res.send('success')
  } else {
    res.send('fail')
  }
  // return res.json(ret)

})

module.exports = router