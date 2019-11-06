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

  let file = req.file
  console.log('/slice file:', file)

  let fileData = {}
  fileData.md5 = req.query.md5
  fileData.step = req.query.step || 0
  fileData.size = req.query.size
  fileData.ext = req.query.ext
  fileData.type = req.query.type
  fileData.chunks = req.query.chunks || 1

  fileData.uuid = uuid.v4()
  console.log('/slice fileData:', file)
  let ret = await utilsClient.request('file_update', fileData)

  let step = parseInt(fileData.step) + 1
  // console.log('/slice fileData:', file)
  if (step == +fileData.chunks) {
    // 合并文件
    fileData.step = step
    ret = await utilsClient.request('file_update', fileData)
  }

  console.log('/slice ret:', ret)
  return res.json(ret)

})

module.exports = router