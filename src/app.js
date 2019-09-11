'use strict'

const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();

var userRoutes = require('./routes/userRoutes');
var projectRoutes = require('./routes/projectRoutes');
var taskRoutes = require('./routes/taskRoutes');
var labelRoutes = require('./routes/labelRoutes');
var teamRoutes = require('./routes/teamRoutes');
var noteRoutes = require('./routes/noteRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(helmet());

app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Controll-Allow-Request-Method');
    res.header('Access-Controll-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/labels', labelRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notes', noteRoutes);

module.exports = app;
