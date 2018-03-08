const express = require('express')
const send = require('../../utils/send')
const userRouter = express.Router()

userRouter.get('/', send)

module.exports = userRouter
