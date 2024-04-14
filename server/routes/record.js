const express = require('express')
const { ObjectId } = require('mongodb')
const db = require('../database/connection')

const router = express.Router()

router.get('/', async (req, res) => {
  const collection = await db.collection('records')
  const results = await collection.find({}).toArray()
  res.send(results).status(200)
})

router.get('/:id', async (req, res) => {
  const collection = await db.collection('records')
  const query = { _id: new ObjectId(req.params.id) }
  const result = await collection.findOne(query)

  if (!result) res.send('Not found').status(404)
  else res.send(result).status(200)
})

router.post('/', async () => {
  try {
    // rest of the code...
  } catch (error) {
    // handle error...
  }
})

module.exports = router
