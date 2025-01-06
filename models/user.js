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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
