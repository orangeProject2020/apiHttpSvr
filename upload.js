const express = require('express')
const router = express.Router()
const multer = require('multer')
const uuid = require('uuid')
const monent = require('moment')
const fs = require('fs')
const path = require('path')
const CONFIG = require('./config')
const clients = require('./client')
const utilsClient = clients['utilsProxyClient']

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let fileNameSplit = file.originalname.split('.')
    let fileExt = fileNameSplit[fileNameSplit.length - 1]
    let fileFolder = monent().format('YYYYMMDD')
    if (!fs.existsSync(path.join(__dirname, './uploads/' + fileFolder))) {
      fs.mkdirSync(path.join(__dirname, './uploads/' + fileFolder))
    }

    cb(null, fileFolder + '/' + uuid.v4() + '.' + fileExt)
  }
})

var upload = multer({
  storage: storage
})

router.post('/single', upload.single('photo'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  let file = req.file
  console.log(file)
  let url = CONFIG.hostFile + '/' + file.path

  return res.json({
    code: 0,
    message: "",
    data: {
      url: url,
      path: file.path
    }

  })
})


var storageSlice = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tmp')
  },
  filename: function (req, file, cb) {
    console.log('file:', file)
    // let fileNameSplit = file.originalname.split('.')
    // let fileExt = fileNameSplit[fileNameSplit.length - 1]
    // let fileFolder = monent().format('YYYYMMDD')
    // if (!fs.existsSync(path.join(__dirname, './uploads/' + fileFolder))) {
    //   fs.mkdirSync(path.join(__dirname, './uploads/' + fileFolder))
    // }
    console.log('req,query:', req.query)
    let md5 = req.query.md5
    let step = req.query.step || 0

    cb(null, md5 + '_' + step)
  }
})

var uploadSlice = multer({
  storage: storageSlice
})

router.use('/', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE, OPTIONS");
  res.setHeader("X-Powered-By", "3.2.1");

  let query = req.query || {}
  if (!query.md5 || !query.size || !query.ext || !query.hasOwnProperty('step') || !query.chunks) {
    return res.json({
      code: 1,
      message: 'query pramas error'
    })
  }

  next()
})

router.post('/slice', uploadSlice.single('file'), async function (req, res) {
  console.log('/slice body:', req.body)
  let file = req.file
  console.log('/slice file:', file)
  // if (!file) {
  //   file = req.body.file
  //   console.log('/slice body.file', typeof req.body.file)
  //   let tmp = path.join(__dirname, './uploads/tmp/', req.query.md5 + '_' + req.query.step)
  //   var ws = fs.createWriteStream(tmp)
  //   ws.on('open', function () {
  //     console.log('流打开了')
  //     ws.write(req.body.file);
  //     // ws.write('可以分多次写入');
  //     ws.end()
  //   })
  //   //on(事件,callback)  程序运行时永久有效
  //   //one(事件,callback)  触发一次后失效

  //   // let fsWriteRet = fs.writeFileSync(path.join(__dirname, './uploads/tmp/', req.query.md5 + '_' + req.query.step), file)
  //   // console.log('/slice fsWriteRet', fsWriteRet)
  // }

  let fileData = {}
  fileData.md5 = req.query.md5
  fileData.step = req.query.step || 0
  fileData.size = req.query.size
  fileData.ext = req.query.ext
  fileData.type = req.query.type
  fileData.chunks = req.query.chunks || 1

  fileData.uuid = uuid.v4()
  console.log('/slice fileData:', fileData)
  let ret = await utilsClient.request('file_update', fileData)

  let step = parseInt(fileData.step) + 1
  // console.log('/slice fileData:', file)
  if (step == +fileData.chunks) {
    // 合并文件
    let tmpFile = path.join(__dirname, './uploads/tmp', fileData.md5)
    let sourceFile = path.join(__dirname, './uploads', fileData.md5 + '.' + fileData.ext)
    // let ws = fs.createWriteStream(sourceFile)
    // ws.on('open', () => {

    //   for (let index = 0; index < fileData.chunks; index++) {
    //     tmpFileIndex = tmpFile + '_' + index
    //     let rs = fs.createReadStream(tmpFileIndex)
    //     rs.on('data', (chunk) => {
    //       ws.write(chunk)
    //     })
    //   }

    //   ws.end()
    // })
    fs.writeFileSync(sourceFile, '');
    for (let index = 0; index < fileData.chunks; index++) {
      tmpFileIndex = tmpFile + '_' + index
      fs.appendFileSync(sourceFile, fs.readFileSync(tmpFileIndex));
      fs.unlinkSync(tmpFileIndex);
    }

    fileData.step = step
    ret = await utilsClient.request('file_update', fileData)
  }

  console.log('/slice ret:', ret)
  return res.json(ret)

})

module.exports = router