var express = require('express');
var routes = express.Router();
const posts = require('./posts');

routes.use('./posts',posts.route());


module.exports = routes;
