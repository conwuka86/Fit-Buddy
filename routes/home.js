// routes/home.js
const express = require('express');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
  res.render('home');
});

module.exports = router;
