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
    res.redirect('/');
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
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('auth/sign-in.ejs', {
        title: 'Sign In',
        error: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).render('auth/sign-in.ejs', {
        title: 'Sign In',
        error: 'Invalid email or password',
      });
    }

    // Log the user in (store user ID in session)
    req.session.user_id = user._id;

    // Redirect to dashboard or homepage
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('auth/sign-in.ejs', {
      title: 'Sign In',
      error: 'Internal server error',
    });
  }
});


module.exports = router;