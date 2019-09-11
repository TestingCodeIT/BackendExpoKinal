'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = Schema({
    title: String,
    content: String,
    deadline: Date,
    labels: String,
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
    favorite: Boolean,
});

module.exports = mongoose.model('Notes', noteSchema);
