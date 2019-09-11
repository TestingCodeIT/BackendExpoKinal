'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = Schema({
    name: String,
    description: String,
    deadline: Date,
    // labels: [{ type: Schema.Types.ObjectId, ref: 'label' }],
    labels: [String],
    taskOwner: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    status: String,
    progress: Number,
    project:{type: Schema.Types.ObjectId, ref: 'project'}
});

module.exports = mongoose.model('Task', taskSchema);