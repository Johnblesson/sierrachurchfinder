const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
require('dotenv').config();
const Credential = require('./models/credential');
const bcrypt = require('bcrypt'); // Import bcrypt

const templatePath = path.join(__dirname, './views');

app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Connect to the Mongodb database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for connection
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

//Login routes
app.get('/', (req, res) => {
    res.render('login')
    // res.send(users)
})

// Signup routes
app.get('/signup', (req, res) => {
  res.render('signup');
});

//Password hashing// Setting saltRounds to 10
app.post('/signup', async (req, res) => {
  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // Hash the password

    const data = {
      name: req.body.name,
      password: hashedPassword, // Store the hashed password in the database
    };
    
    await Credential.insertMany([data]);
    res.render('home');
  } catch (error) {
    res.send('An error occurred while signing up.');
  }
});

// Login credential
app.post('/login', async (req, res) => {
  try {
    const user = await Credential.findOne({ name: req.body.name });

    if (!user) {
      return res.send('User not found');
    }
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
      res.status(201).render('home', { naming: `${req.body.name}` });
    } else {
      res.send('Incorrect password');
    }
  } catch (error) {
    res.send('An error occurred while logging in.');
  }
});

// Starting server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
