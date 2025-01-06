const express = require('express');
const router = express.Router();

// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/bmi'

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

// GET /unicorns/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.send('Add a bmi!');
});



module.exports = router;