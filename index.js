const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const mongoose = require('mongoose')
require("dotenv").config()
const Credential = require('./models/credential')

const templatePath = path.join(__dirname, './views')

app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(express.urlencoded({extended:false}))

// Connect to the Mongodb database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Check for connection
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))

// const users = [
//     { name: 'blesson', password: 'password' },
//     { name: 'kharis', password: 'password' }
// ]

//Login routes
app.get('/', (req, res) => {
    res.render('login')
    // res.send(users)
})

// Signup routes
app.get('/signup', (req, res) => {
    res.render("signup")
})

app.post('/signup', async (req, res) =>{
    const data = {
        name: req.body.name,
        password: req.body.password
    }
   await Credential.insertMany([data])
   res.render("home")
})


app.post('/login', async (req, res) => {
    try {
        const check = await Credential.findOne({ name: req.body.name })
        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.name}` })
        }
        else {
            res.send("incorrect password")
        }
        } 
        catch (e) {
        res.send("wrong details")
        }
})

// Starting server
const PORT  = 3000
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
