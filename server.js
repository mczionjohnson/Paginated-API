const express = require('express')
const app = express();
const cors = require('cors')

// const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model')

mongoose.connect('mongodb://localhost/pagination', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', error =>  console.log(error))

// populating data into Db with mongoose
db.once('open', async () => {
    console.log('Connected to Database')

    if(await User.countDocuments().exec() > 0 ) return
    // search for the model first 

        Promise.all([
            User.create({ 'name': 'User 1' }),
            User.create({ 'name': 'User 2' }),
            User.create({ 'name': 'User 3' }),
            User.create({ 'name': 'User 4' }),
            User.create({ 'name': 'User 5' }),
            User.create({ 'name': 'User 6' }),
            User.create({ 'name': 'User 7' }),
            User.create({ 'name': 'User 8' }),
            User.create({ 'name': 'User 9' }),
            User.create({ 'name': 'User 10' }),
            User.create({ 'name': 'User 11' }),
            User.create({ 'name': 'User 12' }),
            User.create({ 'name': 'User 13' })
        ]).then(() => console.log('Added Users'))
})

// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
// converting the body to JSON before use

app.use(cors({
    origin: [ 'https://www.section.io', 'https://www.google.com' ],
    // origin: '*',
    method: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/', require('./route'))



app.listen(3000)