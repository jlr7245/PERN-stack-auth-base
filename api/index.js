const express = require('express')

const apiRouter = express.Router()

apiRouter.use('/user', require('./user'))

module.exports = apiRouter
