var express = require('express');
var posts = express.Router();
/*
const printInfo = (req,res,next) =>{
    req.body = {
        method: res.method,
        path: res.path,
        params: res.params,
    };
};
*/

posts.get('/',(req,res,next)=>{
    res.send('posts get');
    req.body = {
        method: res.method,
        path: res.path,
        params: res.params,
    };
}); 

posts.post('/',(req,res,next)=>{
    res.send('posts post');
    req.body = {
        method: res.method,
        path: res.path,
        params: res.params,
    };
});     


posts.get('/b',(req,res,next)=>{
    res.send('posts b');
});    
/*
posts.get('/', printInfo);
posts.post('/',printInfo);
posts.get('/:id',printInfo);
posts.delete('/:id',printInfo);
posts.put('/:id',printInfo);
posts.patch('/:id',printInfo);
*/

module.exports = posts;