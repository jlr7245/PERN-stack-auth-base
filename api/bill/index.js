const express = require('express')
const send = require('../../utils/send')
const billRouter = express.Router()

billRouter.get('/', send)

module.exports = billRouter