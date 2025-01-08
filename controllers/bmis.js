const express = require('express');
const router = express.Router();

const Bmi = require('../models/bmi');



// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/bmis'
router.get("/", async (req, res) => {
  const bmis = await BMI.find({ userId: req.session.user._id });
  res.render("bmis/index.ejs", { bmis });
});

router.get("/new", (req, res) => {
  res.render("bmis/edit.ejs");
});

router.post("/", async (req, res) => {
  const bmiValue = calculateBMI(req.body.weight, req.body.height);
  await BMI.create({
    userId: req.session.user._id,
    weight: req.body.weight,
    height: req.body.height,
    bmi: bmiValue,
  });
  res.redirect("/bmis/edit.ejs");
});

router.get("/:id/edit", async (req, res) => {
  const bmi = await BMI.findById(req.params.id);
  res.render("bmis/edit", { bmi });
});

router.put("/:id", async (req, res) => {
  const bmiValue = calculateBMI(req.body.weight, req.body.height);
  await BMI.findByIdAndUpdate(req.params.id, {
    weight: req.body.weight,
    height: req.body.height,
    bmi: bmiValue,
  });
  res.redirect("/bmis/new");
});

router.delete("/:id", async (req, res) => {
  await BMI.findByIdAndDelete(req.params.id);
  res.redirect("/bmis");
});

function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters ** 2)).toFixed(2));
}

module.exports = router;

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