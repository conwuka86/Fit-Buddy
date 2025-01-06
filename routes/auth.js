// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Render Sign-Up Page
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// Render Sign-In Page
router.get('/login', (req, res) => {
  res.render('auth/signin');
});

// Handle Sign-Up Form Submission
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

// Handle Sign-In Form Submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/bmi');
  } catch (error) {
    res.status(400).send('Error logging in');
  }
});

// Handle Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
