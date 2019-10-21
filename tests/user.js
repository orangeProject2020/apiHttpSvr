const Request = require('./../lib/request')
const uuid = require('uuid')
let request = new Request({
  channel_id: '886',
  key: 'qsopifkhjjgjgfossfngnjgdsknkjlkljs'
})
const DOMAIN = 'http://127.0.0.1:10000'

describe('user', () => {

  it('auth/login', async () => {
    let ret = await request.post(DOMAIN + '/user/auth/login', {
      a: 2
    }, {
      uuid: uuid.v4(),
      timestamp: Date.now()
    })

    // console.log('userInfoRet', userUpdateRet)
    console.log('ret', ret)

  })
})