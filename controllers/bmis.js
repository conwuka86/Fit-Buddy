// controllers/bmis.js

const express = require('express');
const router = express.Router();

const Bmis = require('../models/bmis');



// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/bmi'

//router.get('/new', async (req, res) => {
//try {
//   const bmis = await bmis.find();
//   console.log('bmis:', bmis);
//   res.redirect('bmis index page');
// } catch (eror) {
//   console.log('Error fetching bmis:', error);
//   res.status(500).send('An error occurred');
// }
// });


// GET /bmi/new (new functionality) PROTECTED - only signed in users can access

router.post('/', (req, res) => {
  console.log('From Data:', req.body);
  res.redirect('/bmis');
});

router.get('/new', (req, res) => {
  res.render('bmis/new');
});

module.exports = router;