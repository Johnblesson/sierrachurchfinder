const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
require('dotenv').config();

// Bulit in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View Engine
const templatePath = path.join(__dirname, './views');
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Add express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Create Database Connection
const connectDB = require('./src/database/connection')
connectDB();

// Routes
const router = require('./src/routes/route')
app.use(router)

// Church routes
const churchesRoute = require('./src/routes/churches')
app.use('/api/churches', churchesRoute)

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
