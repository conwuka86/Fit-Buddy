const express = require('express');
const router = express.Router();

const Bmi = require('../models/bmi');
const user = require('../models/user');

async function bmiCalculator (bmiBody) {
  

  // Get weight and height values
  const weightLbs = parseFloat(bmiBody.weight)
  const heightFeet = parseFloat(bmiBody.heightFeet)
  const heightInches = parseFloat(bmiBody.heightInches)


  // Convert weight to kilograms and height to meters
  const weightKg = weightLbs / 2.20462;
  const heightMeters = ((heightFeet * 12) + heightInches) * 0.0254;

  // Calculate BMI
  const bmi = parseFloat((weightKg / (heightMeters * heightMeters)).toFixed(2));

  // Display result
 // const bmiResult = document.getElementById('bmiResult');
 // bmiResult.style.display = 'block';

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
  console.log(typeof weightKg)
  console.log(typeof heightMeters)
  console.log(typeof bmi)
  return {weight: weightKg, height: heightMeters, bmi}
};


// All routes start with '/bmis'
router.get("/", async (req, res) => {
  const bmis = await Bmi.find({}).populate('owner');
  res.render("bmis/index.ejs", { title: 'All BMIs', bmis });
});

router.get("/new", (req, res) => {
  res.render("bmis/new.ejs", { title: 'New BMI' });
});

router.get("/:id", async (req, res) => {
  const bmi = await Bmi.findById(req.params.id).populate('owner');

  res.render('bmis/show.ejs', { title: `Your BMI`, bmi });
});

router.post("/", async (req, res) => {
  console.log(req.body)
  const bmiValue = await bmiCalculator(req.body);
  bmiValue.owner = req.session.user_id
  console.log(bmiValue)
  await Bmi.create(bmiValue);
  res.redirect("/bmis");
});



router.put("/:id", async (req, res) => {
  try {
    const updatedBmiData = await bmiCalculator(req.body);
    await Bmi.findByIdAndUpdate(req.params.id, {
      weight: updatedBmiData.weight,
      height: updatedBmiData.height,
      bmi: updatedBmiData.bmi,
      category: updatedBmiData.category,
    });

    res.redirect(`/bmis/${req.params.id}`);
  } catch (error) {
    console.error("Error updating BMI:", error);
    res.status(500).send("Failed to update BMI");
  }
});

  router.delete("/:bmiId", async (req, res) => {
    await Bmi.findByIdAndDelete(req.params.bmiId);
    res.redirect("/bmis/new");
  });


//function bmiCalculator(weight, height) {
 // const heightInMeters = height / 100;
 // return parseFloat((weight / (heightInMeters ** 2)).toFixed(2));





module.exports = router;