const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const Credential = require('../models/credential');
// Login route
router.get('/', (req, res) => {
    res.render('login')
  });
  
  // Signup route
  router.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  // Home route
  router.get('/home', (req, res) => {
    res.render('home')
    // res.send(users)
  })
  
  // Church Route
  router.get('/churches', (req, res) => {
    res.render('churches');
  });
  
  // FAQ Route
  router.get('/faq', (req, res) => {
    res.render('faq');
  });
  
  // About Route
  router.get('/about', (req, res) => {
    res.render('about');
  });
  
  // Contact Route
  router.get('/contact', (req, res) => {
    res.render('contact');
  });
  
  // Map Route
  router.get('/map', (req, res) => {
    res.render('map');
  });
  
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