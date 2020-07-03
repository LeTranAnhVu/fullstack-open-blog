const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const mongoConnection = require('./mongoConnect')
const blogRouter = require('./routes/blog')

const {unknownEndpoint, errorHandler} = require('./utils/middlewares')
// connect database
mongoConnection.initialize()

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
app.use('/api', blogRouter)

// error handler
app.use(errorHandler)
app.use(unknownEndpoint)

module.exports = app