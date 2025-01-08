const mongoose = require("mongoose");
// Shortcut variable
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: Number,
    enum: ['male', 'female', 'transgender', 'Non-binary'],
    required: false
  }
}, {
  timestamps: true
})

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  applications: [applicationSchema]
});

module.exports = mongoose.model("User", userSchema);