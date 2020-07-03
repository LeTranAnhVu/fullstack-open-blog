require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let NODE_ENV = process.env.NODE_ENV
let SECRET = process.env.SECRET
if(process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}


module.exports = {
  NODE_ENV,
  MONGODB_URI,
  PORT,
  SECRET
}