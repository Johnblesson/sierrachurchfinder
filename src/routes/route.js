const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const Credential = require('../models/credential');
const authenticate = require('../middleware/auth')

const TOKEN = process.env.TOKEN;

// Login route
router.get('/', (req, res) => {
    res.render('login')
  });
  
  // Signup route
  router.get('/signup', (req, res) => {
    res.render('signup');
  });

  // Home route (protected)
router.get('/home', authenticate, (req, res) => {
  res.render('home', { naming: `${req.session.user.name}` });
});

// Church Route (protected)
router.get('/churches', authenticate, (req, res) => {
  res.render('churches');
});

// FAQ Route (protected)
router.get('/faq', authenticate, (req, res) => {
  res.render('faq');
});

// About Route (protected)
router.get('/about', authenticate, (req, res) => {
  res.render('about');
});

// Contact Route (protected)
router.get('/contact', authenticate, (req, res) => {
  res.render('contact');
});

// Map Route (protected)
router.get('/map', authenticate, (req, res) => {
  res.render('map');
});

// Forbidden
router.get('/forbidden', (req, res) => {
  res.render('403')
})

  
  // Logout route
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/');
    });
  });
  
  // Password hashing
  router.post('/signup', async (req, res) => {
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
  router.post('/login', async (req, res) => {
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

module.exports = router;