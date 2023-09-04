const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const session = require('express-session'); // Add express-session
const bcrypt = require('bcrypt');
require('dotenv').config();
const Credential = require('./models/credential');

const templatePath = path.join(__dirname, './views');

app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Add express-session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret
  resave: false,
  saveUninitialized: true,
}));

// Connect to the Mongodb database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for connection
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Login route
app.get('/', (req, res) => {
  res.render('login')
});

// Signup route
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Home route
app.get('/home', (req, res) => {
  res.render('home')
  // res.send(users)
})

// Church Route
app.get('/churches', (req, res) => {
  res.render('churches');
});

// FAQ Route
app.get('/faq', (req, res) => {
  res.render('faq');
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Contact Route
app.get('/contact', (req, res) => {
  res.render('contact');
});

// Map Route
app.get('/map', (req, res) => {
  res.render('map');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

// Password hashing
app.post('/signup', async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const data = {
      name: req.body.name,
      password: hashedPassword,
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
      req.session.user = user;
      res.status(201).render('home', { naming: `${req.body.name}` });
    } else {
      res.send('Incorrect password');
    }
  } catch (error) {
    res.send('An error occurred while logging in.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
