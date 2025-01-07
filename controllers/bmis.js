// controllers/bmis.js

const express = require('express');
const router = express.Router();

const bmi = require('./models/bmi');



// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/bmi'

router.get('/bmis', async (req, res) => {
try {
  const bmis = await bmi.find();
  console.log('bmis:', bmis);
  res.send('bmis index page');
} catch (eror) {
  console.log('Error fetching bmis:', error);
  res.status(500).send('An error occurred');
}
});


// GET /healthtips (index functionality) UN-PROTECTED - all users can access
router.get('/', (req, res) => {
  const tips = [
    "Stay hydrated by drinking at least 8 glasses of water daily.",
    "Incorporate at least 30 minutes of physical activity into your day.",
    "Choose whole grains over refined grains.",
    "Eat a variety of colorful fruits and vegetables.",
    "Practice mindful eating and avoid overeating.",
  ];
});

// GET /bmi/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.send('Add a bmi!');
});

router.post

router.get('/bmis/new', (req, res) => {
  res.render('bmis/new');
});

module.exports = router;