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
      mobile: '18676669410',
      password: '123456',
      user_type: 1,
      "platform": "ios", // ios，Android，Desktop
      "auth_type": "app", // app,h5,wx(微信公众号),mini(微信小程序),admin(管理后台)
      "device": "lcip7"
    }, {
      uuid: uuid.v4(),
      timestamp: Date.now()
    })

    // console.log('userInfoRet', userUpdateRet)
    console.log('ret', ret)

  })

  // it('data/createUser', async () => {
  //   let ret = await request.post(DOMAIN + '/user/data/createUser', {
  //     username: 'lucong',
  //     mobile: '18676669410',
  //     sex: 1,
  //     type: 1
  //   }, {
  //     uuid: uuid.v4(),
  //     timestamp: Date.now()
  //   })

  //   // console.log('userInfoRet', userUpdateRet)
  //   console.log('ret', ret)
  // })

  // it('data/updateUser', async () => {
  //   let ret = await request.post(DOMAIN + '/user/data/updateUser', {
  //     uid: '090d668c-7388-403f-b9b7-0c3eefd665d5',
  //     mobile: '18676669410',
  //     sex: 2,
  //     type: 2,
  //     status: 1,
  //     password: '123456'
  //   }, {
  //     uuid: uuid.v4(),
  //     timestamp: Date.now()
  //   })

  //   // console.log('userInfoRet', userUpdateRet)
  //   console.log('ret', ret)
  // })

  // it('role/getInfo', async () => {
  //   let ret = await request.post(DOMAIN + '/user/role/getInfo', {
  //     user_id: '090d668c-7388-403f-b9b7-0c3eefd665d5'
  //   }, {
  //     uuid: uuid.v4(),
  //     timestamp: Date.now(),
  //     token: '257a8d4b-db61-4854-b469-96906f09d835'
  //   })

  //   // console.log('userInfoRet', userUpdateRet)
  //   console.log('ret', ret)
  // })

  // it('role/setRules', async () => {
  //   let ret = await request.post(DOMAIN + '/user/role/setRules', {
  //     user_id: '090d668c-7388-403f-b9b7-0c3eefd665d5',
  //     rules: 'all'
  //   }, {
  //     uuid: uuid.v4(),
  //     timestamp: Date.now(),
  //     token: '257a8d4b-db61-4854-b469-96906f09d835'
  //   })

  //   // console.log('userInfoRet', userUpdateRet)
  //   console.log('ret', ret)
  // })
})