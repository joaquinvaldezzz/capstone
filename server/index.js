require('dotenv').config()

const cors = require('cors')
const express = require('express')
const records = require('./routes/record')

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors())
app.use(express.json())
app.use('/record', records)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.get('/', (_request, response) => {
  response.send('Server is running').status(200)
})
