const express = require('express')

const apiRouter = express.Router()

apiRouter.use('/user', require('./user'))
apiRouter.use('/pol', require('./pol'))
apiRouter.use('/bill', require('./bill'))

module.exports = apiRouter
