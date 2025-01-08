// server.js

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require('express-session');

const app = express();

const path = require('path');

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



const authController = require('./controllers/auth.js');
const bmisController = require('./controllers/bmis.js');


// Configure Express app 
// app.set(...)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount Middleware
// app.use(...)


const ensureSignedIn = require('./middleware/ensure-signed-in.js');



app.use('/auth', authController);
app.use('/bmis', ensureSignedIn, bmisController);
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Static middleware for returning static assets to the browser
app.use(express.static('public'));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Add the user (if logged in) to req.user & res.locals
app.use(require('./middleware/add-user-to-locals-and-req'));

// Routes

// GET /  (home page functionality)
app.get('/', (req, res) => {
  res.render('home.ejs', { title: 'FitBuddy'});
  });


// '/auth' is the "starts with" path that the request must match
// The "starts with" path is pre-pended to the paths
// defined in the router module
app.use('/auth', require('./controllers/auth'));

app.use('/bmis', require('./controllers/bmis'));

app.use(require('./middleware/ensure-signed-in'));

app.use('/', require('./controllers/bmis'));









app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});