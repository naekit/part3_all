const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(res => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.error('cannot connect to MongoDB: ', err)
    })

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phoneSchema)