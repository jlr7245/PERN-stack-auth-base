const express = require('express')
const send = require('../utils/send')
const polRouter = express.Router()

polRouter.get('/', send)

module.exports = polRouter