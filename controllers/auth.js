const User = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();


// Validation middleware
const validateSignUp = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .notEmpty()
    .withMessage('Email field cannot be empty'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs', { title: 'Sign Up!' })
});


// Sign-up route
router.post('/sign-up', validateSignUp, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/sign-up.ejs', {
      title: 'Sign Up!',
      errors: errors.array(),
    });
  }

  // Check if email is missing in the request body
  if (!req.body.email) {
    return res.status(400).render('auth/sign-up.ejs', {
      title: 'Sign Up!',
      error: 'Email is required',
    });
  }

  try {
    // Hash the password before saving
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // Create the user
    const user = await User.create(req.body);

    // Save user ID in session
    req.session.user_id = user._id;

    // Redirect to sign-in page
    res.redirect('/sign-in');
  } catch (err) {
    console.error(err);

    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(409).render('auth/sign-up.ejs', {
        title: 'Sign Up!',
        error: 'Email already exists. Please use another email.',
      });
    }

    // Handle other errors
    res.status(500).render('auth/sign-up.ejs', {
      title: 'Sign Up!',
      error: 'Internal server error',
    });
  }
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs', { title: 'Sign In' });
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) throw new Error('Invalid username');
    
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) throw new Error('Invalid password');
    req.session.user_id = user._id;
    
    console.log (req.session);
    res.redirect('/');
  } catch (e) {
    console.log(e);
    res.render('auth/sign-in.ejs', { title: 'Sign In' });
  }
});


module.exports = router;