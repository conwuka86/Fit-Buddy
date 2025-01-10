const express = require('express');
const router = express.Router();

const Bmi = require('../models/bmi');
const user = require('../models/user');

async function bmiCalculator (bmiBody) {
  

  
  const weightLbs = parseFloat(bmiBody.weight)
  const heightFeet = parseFloat(bmiBody.heightFeet)
  const heightInches = parseFloat(bmiBody.heightInches)


 
  const weightKg = weightLbs / 2.20462;
  const heightMeters = ((heightFeet * 12) + heightInches) * 0.0254;

  
  const bmi = parseFloat((weightKg / (heightMeters * heightMeters)).toFixed(2));

 
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
  return {bmi}
};



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

router.get("/:bmiId/edit", async (req, res) => {
  try {
    const bmi = await Bmi.findById(req.params.bmiId); 
    res.render("bmis/edit.ejs", { title: "Edit BMI", bmi });
  } catch (error) {
    console.error("Error fetching BMI for editing:", error);
    res.status(500).send("Failed to load edit form");
  }
});


router.post("/", async (req, res) => {
  console.log(req.body)
  const bmiValue = await bmiCalculator(req.body);
  bmiValue.owner = req.session.user_id
  bmiValue.weight = parseFloat(req.body.weight)
  bmiValue.heightFeet = parseFloat(req.body.heightFeet)
  bmiValue.heightInches = parseFloat(req.body.heightInches)
  console.log(bmiValue)
  await Bmi.create(bmiValue);
  res.redirect("/bmis");
});



router.put("/:bmiId", async (req, res) => {
  try {
    const updatedBmiData = await bmiCalculator(req.body);
    await Bmi.findByIdAndUpdate(req.params.bmiId, {
      weight:parseFloat(req.body.weight),
      heightFeet:parseFloat(req.body.heightFeet),
      heightInches:parseFloat(req.body.heightInches),
      bmi: updatedBmiData.bmi,
      category: updatedBmiData.category,
    });

    res.redirect(`/bmis/${req.params.bmiId}`);
  } catch (error) {
    console.error("Error updating BMI:", error);
    res.status(500).send("Failed to update BMI");
  }
});

  router.delete("/:bmiId", async (req, res) => {
    await Bmi.findByIdAndDelete(req.params.bmiId);
    res.redirect("/bmis/new");
  });


module.exports = router;