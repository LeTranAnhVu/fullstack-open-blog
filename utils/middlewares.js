const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
const errorHandler = (err, req, res, next) => {
  logger.error(err)
  if (err.name === 'CastError' && err.kind == 'ObjectId') {
    return res.status(400).send({error: 'malformatted id'})
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({error: err.message})
  } else if (err.name === 'MongoError' && err.code === 11000) {
    const keys = Object.keys(err.keyPattern)
    return res.status(400).send({error: `${keys.join(',')} is existed`})
  }
  next(err)
}
module.exports = {
  unknownEndpoint,
  errorHandler
}
