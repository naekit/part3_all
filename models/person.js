const mongoose = require('mongoose')
require('dotenv').config()

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to', url)

function numberValidator(val) {
	const valArr = val.split('-')
	if(valArr.length > 2 || valArr[0].length < 2){
		return false
	} else {
		return true
	}
}

mongoose.connect(url)
	// eslint-disable-next-line no-unused-vars
	.then(_res => {
		console.log('connected to MongoDB')
	})
	.catch(err => {
		console.error('cannot connect to MongoDB: ', err)
	})

const phoneSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		minLength: 8,
		validate: numberValidator
	},
	date: Date,
})

phoneSchema.set('toJSON', {
	transform: (_document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', phoneSchema)