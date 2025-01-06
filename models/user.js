// models/user.js
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// Shortcut variable
const Schema = mongoose.Schema;

const BMISchema = new mongoose.Schema({
  weight: Number,
  height: Number,
  bmi: Number,
  date: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bmiDate: [BMISchema],
});

module.exports = mongoose.model("User", userSchema);
