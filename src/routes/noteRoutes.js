'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var NotesController = require('../controllers/noteController')

var api = express.Router();

api.get('/my-notes', md_auth.ensureAuth, NotesController.getAllNotes);
api.get('/:id', md_auth.ensureAuth, NotesController.getNote);
api.post('/', md_auth.ensureAuth, NotesController.addNote);
api.put('/:id', md_auth.ensureAuth, NotesController.editNote);
api.delete('/:id', md_auth.ensureAuth, NotesController.deleteNote);

module.exports = api;
