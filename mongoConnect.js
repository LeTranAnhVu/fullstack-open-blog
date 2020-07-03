const mongoose = require('mongoose')
const {MONGODB_URI} = require('./utils/config')

const initialize = () => {
  mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
    })

  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)

}

module.exports = {
  initialize
}