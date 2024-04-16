const express = require('express')
const { ObjectId } = require('mongodb')
const db = require('../database/connection')

const router = express.Router()

router.get('/', async (_request, response) => {
  const collection = db.collection('records')
  const results = await collection.find({}).toArray()
  response.send(results).status(200)
})

router.get('/:id', async (request, response) => {
  const collection = db.collection('records')
  const query = { _id: new ObjectId(request.params.id) }
  const result = await collection.findOne(query)

  if (!result) response.send('Not found').status(404)
  else response.send(result).status(200)
})

router.post('/', async (request, response) => {
  try {
    const person = {
      username: request.body.username,
      password: request.body.password,
    }
    const collection = db.collection('records')
    const result = await collection.insertOne(person)
    response.send(result).status(204)
  } catch (error) {
    console.error(error)
    response.status(500).send('Error adding record')
  }
})

module.exports = router
