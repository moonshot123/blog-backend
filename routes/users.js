var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  //res.send('respond with a resource');
  //res.send('라우터 유저');
  res.render('users',{ user: '홍길동' })
});

module.exports = router;
