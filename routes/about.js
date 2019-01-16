var express = require('express');

var about = express.Router();

about.get('/',(req,res,next)=>{
    res.send('about')
})

about.get('/a',(req,res,next)=>{
    res.send('about a')
})    

about.get('/b',(req,res,next)=>{
    res.send('about b')
})  

module.exports = about;