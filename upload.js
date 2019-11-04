const express = require('express')
const router = express.Router()
const multer = require('multer')
const uuid = require('uuid')
const monent = require('moment')
const fs = require('fs')
const path = require('path')
const CONFIG = require('./config')

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

module.exports = router