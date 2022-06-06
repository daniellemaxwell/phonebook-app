const express = require('express')
const app = express()
const morgan = require('morgan')
const PORT = 3001

app.use(express.json())
app.use(morgan('tiny'))


app.use(morgan(':object'))

morgan.token('object', function (req, res) { return `${JSON.stringify(req.body)}` })

const persons = [
    {
     "id": 1,
     "name": "Arto Hellas",
     "number": "040-123456"   
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"   
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"   
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"   
    },

]

app.get('/info', (req, res) => {
    const currentDate = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${currentDate}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(persons => persons.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(persons => persons.id !== id)
    res.status(204).end()
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(person => person.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons/', (req, res) => {
      const body = req.body
      if(!body.name) {
          return res.status(400).json({
              error: 'Please enter name'
          })
      }
      if(!body.number) {
        return res.status(400).json({
            error: 'Please enter number'
        })
    }
     if(persons.find(entry => entry.name === body.name)) {
        return res.status(400).json({
            error: 'Duplicate name. Please enter a unique name.'
        })
    }

      let entry = {
          id: generateId(),
          name: body.name,
          number: body.number
      }
      persons.push(entry)
      res.json(entry)
  })
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})