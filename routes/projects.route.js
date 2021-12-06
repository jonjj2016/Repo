const express = require('express');
const { bobbyCrud } = require('../generators/bobby');
const Model = require('../model/projects.model');

const route = express.Router();

route.get('/:id', bobbyCrud(Model).get);
route.post('/', bobbyCrud(Model).post);
route.get('/', bobbyCrud(Model).find);
route.patch('/:id', bobbyCrud(Model).patch);
route.delete('/:id', bobbyCrud(Model).remove);

module.exports = route;
