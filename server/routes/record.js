const express = require("express")
const { ObjectId } = require("mongodb")
const db = require("../database/connection")

const router = express.Router()

router.get("/", async (_request, response) => {
  const collection = db.collection("records")
  const results = await collection.find({}).toArray()
  response.send(results).status(200)
})

router.get("/:id", async (request, response) => {
  const collection = db.collection("records")
  const query = { _id: new ObjectId(request.params.id) }
  const result = await collection.findOne(query)

  if (!result) response.send("Not found").status(404)
  else response.send(result).status(200)
})

router.post("/sign-up", async (request, response) => {
  try {
    const person = {
      username: request.body.username,
      password: request.body.password,
      date_created: new Date().toISOString(),
    }
    const collection = db.collection("records")
    const result = await collection.insertOne(person)
    response.send(result).status(204)
  } catch (error) {
    console.error(error)
    response.status(500).send("Error adding record")
  }
})

router.post("/log-in", async (request, response) => {
  try {
    const user = await db.collection("records").findOne({ username: request.body.username })

    if (user && user.password === request.body.password) {
      console.log("Logged in")
      response.status(200).send("Logged in")
    } else {
      console.log("Invalid password")
      response.status(401).send("Invalid password")
    }
  } catch (error) {
    console.error(error)
    response.status(500).send("Error adding record")
  }
})

router.post("/clear", async (_request, response) => {
  try {
    db.collection("records").deleteMany({})
    response.send("Records cleared").status(204)
  } catch (error) {
    console.error(error)
    response.status(500).send("Error clearing records")
  }
})

module.exports = router
