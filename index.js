require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')


app.use(express.static('build'))
app.use(express.json())


morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :body - :req[content-length]'));

// OLD CODE FOR TESTING WITHOUT DATABASE
// let people = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', (req,res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/info', (req,res) => {
    Person.find({}).then(people => {
        res.send(`
        <p>Phonebook has info for ${people.length} people</p>
        <p>${new Date()}</p>
    `)
    })
    // res.send(`
    //     <p>Phonebook has info for ${people.length} people</p>
    //     <p>${new Date()}</p>
    // `)
})

app.get('/api/persons/:id', (req,res) => {
    // from MONGO DB
    Person.findById(req.params.id).then(person => res.json(person))

    // OLD CODE without DB
    // const id = +req.params.id
    // const person = people.find(p => p.id === id)

    // if(person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
})

app.delete('/api/persons/:id', (req,res,next) => {

    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

    // OLD DELETE METHOD W/O MONGO
    // 
    // const id = +req.params.id
    // people = people.filter(p => p.id !== id)

    // res.status(204).end()
})

app.put('/api/persons/:id', (req,res,next) => {
    const body = req.body 

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(
        req.params.id, 
        person, 
        {new: true, runValidators: true, context: 'query'}
        )
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if(!body.name){
        return res.status(400).json({
            error: 'name is missing'
        })
    } else if(!body.number){
        return res.status(400).json({
            error: 'number is missing'
        })
    } 
    // OLD CONDITIONAL CHECKING FOR DUPLICATES
    // else if(people.find(p => p.name === body.name)){
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
    // OLD RESPONSE WITHOUT MONGO DB
    // people = people.concat(person)
    // console.log(person)
    // res.json(person)
})

// UNKNOWN ENDPOINT PATH
const unknownEndpoint = (req,res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

// ERROR HANDLING MIDDLEWARE
const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    console.log(error.name)

    if(error.name === 'CasError'){
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name == 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app running on ${PORT}`)
})