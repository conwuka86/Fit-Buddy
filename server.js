require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const bmiRoutes = require('./routes/bmi');
const homeRoutes = require('./routes/home');

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/bmi', bmiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
