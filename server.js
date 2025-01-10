require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require('express-session');
const { validationResult } = require('express-validator');
const app = express();

const path = require('path');

const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



const authController = require('./controllers/auth.js');
const bmisController = require('./controllers/bmis.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(require('./middleware/add-user-to-locals-and-req'));

app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'FitBuddy'})
  });


app.use('/auth', authController);

const ensureSignedIn = require('./middleware/ensure-signed-in.js');
app.use('/bmis', ensureSignedIn, bmisController);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});