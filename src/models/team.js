'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = Schema({
    name: String,
    description: String,
    // teamManager: { type: Schema.Types.ObjectId, ref: 'user' },
    integrants: [{
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        role: String
    }]
});

module.exports = mongoose.model('Team', teamSchema);