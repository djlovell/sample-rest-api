var routes = require('express').Router();

const apiCalls = require('./api.js');

routes.post('/courses', function(req, res) {
    apiCalls.crud.create(req,res);
});

routes.get('/courses', function(req, res) {
    apiCalls.crud.readAll(req,res);
});

routes.get('/courses/:id', function(req, res) {
    apiCalls.crud.readOne(req,res);
});

routes.put('/courses/:id', function(req, res) {
    apiCalls.crud.update(req,res);
});

routes.delete('/courses/:id', function(req, res) {
    apiCalls.crud.destroy(req,res);
});

/** @module routes
  * Express routes for calling the CRUD API
  */
module.exports = routes;

