// routes/bmi.js
const express = require('express');
const ensureSignedIn = require('../middleware/ensureSignedIn');
const User = require('../models/user');

const router = express.Router();

// Get all BMI records
router.get('/', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render('bmi/index', { bmiData: user.bmiData });
});

// routes/bmi.js
router.get('/', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.user.id);
  const bmiData = user.bmiData.map(record => ({
    date: record.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    bmi: record.bmi,
  }));
  res.render('bmi/index', { bmiData, bmiTrend: JSON.stringify(bmiData) });
});


// Add new BMI
router.post('/', ensureSignedIn, async (req, res) => {
  const { weight, height } = req.body;
  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
  const user = await User.findById(req.user.id);
  user.bmiData.push({ weight, height, bmi });
  await user.save();
  res.redirect('/bmi');
});

// Delete BMI record
router.delete('/:bmiId', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.bmiData.id(req.params.bmiId).remove();
  await user.save();
  res.redirect('/bmi');
});

module.exports = router;