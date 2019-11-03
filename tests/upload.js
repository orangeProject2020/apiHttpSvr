const Request = require('./../lib/request')
const uuid = require('uuid')
let request = new Request({
  channel_id: '886',
  key: 'qsopifkhjjgjgfossfngnjgdsknkjlkljs'
})
const DOMAIN = 'http://127.0.0.1:10000'
const fs = require('fs')
const path = require('path')

describe('user', () => {

  it('auth/login', async () => {
    let ret = await request.post(DOMAIN + '/upload/single', {
      a: 2
    }, {
      uuid: uuid.v4(),
      timestamp: Date.now()
    }, 'file', {
      photo: {
        value: fs.createReadStream(path.join(__dirname, "./a.jpg")),
        options: {
          filename: 'a.jpg',
          contentType: null
        }
      }
    })

    // console.log('userInfoRet', userUpdateRet)
    console.log('ret', ret)

  })
})