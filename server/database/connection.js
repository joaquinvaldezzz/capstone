require("dotenv").config()

const { MongoClient, ServerApiVersion } = require("mongodb")

const URI = process.env.ATLAS_URI ?? ""
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

client
  .connect()
  .then(() => client.db("admin").command({ ping: 1 }))
  .then(() => console.log("Pinged your deployment. You successfully connected to MongoDB!"))
  .catch((error) => console.error(error))

const db = client.db("employees")

module.exports = db
