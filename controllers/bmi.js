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

function getHealthTip(bmi) {
  if (bmi < 18.5) return "Your BMI indicates you are underweight. Consider increasing your calorie intake with nutritious foods.";
  if (bmi >= 18.5 && bmi < 24.9) return "Your BMI is within the healthy range. Maintain your current lifestyle and diet.";
  if (bmi >= 25 && bmi < 29.9) return "Your BMI indicates you are overweight. Consider incorporating more exercise and a balanced diet.";
  return "Your BMI indicates obesity. Consult a healthcare provider for personalized advice.";
}

router.get('/', ensureSignedIn, async (req, res) => {
  const user = await User.findById(req.user.id);
  const bmiData = user.bmiData.map(record => ({
    date: record.date.toISOString().split('T')[0],
    bmi: record.bmi,
  }));

  const latestBMI = bmiData.length > 0 ? bmiData[bmiData.length - 1].bmi : null;
  const healthTip = latestBMI ? getHealthTip(latestBMI) : "No BMI data available.";

  res.render('bmi/index', { bmiData, bmiTrend: JSON.stringify(bmiData), healthTip });
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