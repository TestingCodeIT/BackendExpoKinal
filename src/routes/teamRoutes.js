'use strict'

var express = require('express');
var md_auth = require('../middlewares/authentication');
var teamController = require('../controllers/teamController');

var api = express.Router();

api.get('/', teamController.listTeams);
api.get('/:id', teamController.getTeam);
api.post('/', teamController.createTeam);
api.put('/:id', teamController.editTeam);
api.put('/:teamId/integrant/:integrantId', teamController.addIntegrant);

api.delete('/:teamId', md_auth.ensureAuth, teamController.deleteTeam);
api.delete('/:teamId/integrant/:integrantId', md_auth.ensureAuth, teamController.removeIntegrant);

module.exports = api;
