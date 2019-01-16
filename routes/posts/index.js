var express = require('express');
var posts = express.Router();
const postctrl =require('./posts.ctrl')

posts.get('/', postctrl.list);
posts.post('/', postctrl.write);
posts.get('/:id', postctrl.read);
posts.delete('/:id', postctrl.remove);
posts.put('/:id', postctrl.replace);
posts.patch('/:id', postctrl.update);


module.exports = posts;