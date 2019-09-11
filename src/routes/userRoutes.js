'use strict'

var express = require('express');
var userController = require('../controllers/userController');
var md_auth = require('../middlewares/authentication');

//SUBIR IMAGEN
var multipartyes = require('connect-multiparty');
var md_subir = multipartyes({ uploadDir: './src/uploads/users' })

var api = express.Router();

api.get('/', userController.listUsers);
api.get('/:id', userController.getUser);
api.post('/login', userController.login);
api.post('/sign-up', userController.signUp);

api.delete('/:id', md_auth.ensureAuth, userController.deleteUser);
api.get('/imagen/:nameImage', userController.getImage);
api.post('/:id/subir-imagen', [md_auth.ensureAuth, md_subir], userController.uploadImage);
api.put('/:id', md_auth.ensureAuth, userController.editUser);

module.exports = api;
