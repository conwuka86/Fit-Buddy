require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import Routes
const authRoutes = require('./routes/auth');
const bmiRoutes = require('./routes/bmi');
const homeRoutes = require('./routes/home');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(bodyParser.json()); // Parse JSON data
app.use(methodOverride('_method')); // Allow method overriding for PUT and DELETE
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// View Engine
app.set('view engine', 'ejs');

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/', homeRoutes); // Home route
app.use('/auth', authRoutes); // Authentication routes
app.use('/bmi', bmiRoutes); // BMI routes

// 404 Error Handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
