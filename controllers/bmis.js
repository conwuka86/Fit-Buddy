// controllers/bmis.js

const express = require('express');
const router = express.Router();

const Bmi = require('../models/bmi');



// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/bmis'

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
router.get('/', (req, res) => {
  res.render('bmis/index.ejs', { title: 'All BMIs' });
});

// GET /bmi/new (new functionality) PROTECTED - only signed in users can access


router.get('/new', ensureSignedIn, (req, res) => {
  res.render('bmis/new.ejs', { title: 'Add BMI' });
});

// POST /bmis (create functionality)
router.post('/', async (req, res) => {
  try {
    req.body.owner = req.user._id;
    await Bmi.create(req.body);
    res.redirect('/bmis')
  } catch (err) {
    console.log(err);
    res.redirect('/bmis/new');
  }
});


module.exports = router;