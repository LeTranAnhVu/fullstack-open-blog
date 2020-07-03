const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const mongoConnection = require('./mongoConnect')
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

const {NODE_ENV} = require('./utils/config')
const {unknownEndpoint, errorHandler} = require('./utils/middlewares')
// connect database
if (NODE_ENV !== 'test') {
  mongoConnection.initialize()
}

// application
app.use(cors())
app.use(express.json())

// morgan
morgan.token('res-body', function (req/*,res*/) {
  return JSON.stringify(req.body)
})
const morganStyle = morgan(':method :url :status :res[content-length] - :response-time ms :res-body')
app.use(morganStyle)


// static
// app.use(express.static('build'))

// routes
app.use('/api', authRouter)
app.use('/api', blogRouter)
app.use('/api', userRouter)

// error handler
app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app