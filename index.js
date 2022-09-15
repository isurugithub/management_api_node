require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes');
var cors = require('cors')


mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/api', routes);

// app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})