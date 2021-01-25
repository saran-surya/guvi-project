const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path')
// middleware
const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./db');
app.use(cors())
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
    bodyParser.json({
      extended: true
    })
)

// handling register request
app.post("/register", db.createUser)

// handling the static files
app.use(express.static('client'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'index.html')));

// main listening section
app.listen(port, (req, res)=>{
    console.log("started")
})