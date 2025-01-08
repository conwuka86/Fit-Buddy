// models/bmi.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bmiSchema = new Schema({
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
        required: true,
        min: 0,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    editedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('bmi', bmiSchema);


