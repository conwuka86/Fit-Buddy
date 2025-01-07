// models/bmi.js

const mongoose = require('mongoose');

const bmisSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true,
        min: 0,
    },
    height: {
        type: Number,
        required: true,
        min: 0,
    },
    bmi: {
        type: Number,
        required: false,
        min: 0,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const bmis = mongoose.model('bmis', bmisSchema);

module.exports = bmis;

