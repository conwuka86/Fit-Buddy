// models/user.js
const mongoose = require('mongoose');

const BMISchema = new mongoose.Schema({
  weight: Number,
  height: Number,
  bmi: Number,
  date: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bmiData: [BMISchema],
});

module.exports = mongoose.model('User', UserSchema);
