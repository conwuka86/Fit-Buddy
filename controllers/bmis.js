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
// Get /bmis (index functionality) PROTECTED - only signed in users can access
router.get('/', async (req, res) => {
  const bmis = await Bmi.find ({}); 
  res.render('bmis/index.ejs', { title: 'All BMIs', bmis });
});

// GET /bmis/new (new functionality) PROTECTED - only signed in users can access


router.get('/new', ensureSignedIn, (req, res) => {
  res.render('bmis/new.ejs', { title: 'Add BMI' });
});

// POST /bmis (create functionality)
router.post('/', async (req, res) => {
  const bmiObject = bmiCalculator(req.body)
  try {
    bmiObject.owner = req.session.user._id;
    console.log(bmiObject)
    await Bmi.create(bmiObject);
    res.redirect('/bmis')
  } catch (err) {
    console.log(err);
    res.redirect('/bmis/new');
  }
});

function bmiCalculator (bmiBody) {
  

  // Get weight and height values
  const weightLbs = bmiBody.weight
  const heightFeet = bmiBody.heightFeet
  const heightInches = bmiBody.heightInches

  // Validate input
  if (!weightLbs || weightLbs <= 0 || !heightFeet || heightFeet < 0 || !heightInches || heightInches < 0) {
    alert('Please enter valid weight and height values.');
    return;
  }

  // Convert weight to kilograms and height to meters
  const weightKg = weightLbs / 2.20462;
  const heightMeters = ((heightFeet * 12) + heightInches) * 0.0254;

  // Calculate BMI
  const bmi = (weightKg / (heightMeters * heightMeters)).toFixed(2);

  // Display result
  const bmiResult = document.getElementById('bmiResult');
  bmiResult.style.display = 'block';

  // Determine BMI category
  let category = '';
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Normal weight';
  } else if (bmi >= 25 && bmi <= 29.9) {
    category = 'Overweight';
  } else {
    category = 'Obesity';
  }

  return {weight: weightKg, height: heightMeters, bmi}
};

module.exports = router;