const Request = require('./../lib/request')
const uuid = require('uuid')
let request = new Request({
  channel_id: '886',
  key: 'qsopifkhjjgjgfossfngnjgdsknkjlkljs'
})
const DOMAIN = 'http://127.0.0.1:10000'
const fs = require('fs')
const path = require('path')

describe('sms', () => {

  it('sms/sendVerifyCode', async () => {
    let ret = await request.post(DOMAIN + '/utils/sms/sendVerifyCode', {
      mobile: '18676669410'
    }, {
      uuid: uuid.v4(),
      timestamp: Date.now()
    })

    // console.log('userInfoRet', userUpdateRet)
    console.log('ret', ret)

  })

  // checkVerifyCode
  // it('sms/checkVerifyCode', async () => {
  //   let ret = await request.post(DOMAIN + '/utils/sms/checkVerifyCode', {
  //     mobile: '18676669410',
  //     verify_code: '804208'
  //   }, {
  //     uuid: uuid.v4(),
  //     timestamp: Date.now()
  //   })

  //   // console.log('userInfoRet', userUpdateRet)
  //   console.log('ret', ret)

  // })
})