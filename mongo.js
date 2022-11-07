const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://natkha:${password}@cluster0.vtkzzsz.mongodb.net/phoneBook?retryWrites=true&w=majority`

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('person', phoneSchema)

if (process.argv.length < 5){
    mongoose
        .connect(url)
        .then(result => Person.find({}))
        .then(results => {
            console.log('phonebook:')
            results.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            return mongoose.connection.close()
        })
        .catch(err => console.error(err))
} else {
    mongoose
        .connect(url)
        .then(result => {
            console.log('connected')

            const person = new Person({
                name: `${process.argv[3]}`,
                number: `${process.argv[4]}`,
                date: new Date()
            })

            return person.save()
        })
        .then((result) => {

            console.log(`added ${result.name} number ${result.number} to phonebook`)
            mongoose.connection.close()
        })
        .catch((err) => console.error(err))
}

