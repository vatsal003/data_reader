require('dotenv').config();
const express = require("express")
const cors = require('cors')


const db = require("./db/db.js")
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})