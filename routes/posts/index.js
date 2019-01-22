var express = require('express');
var router = express.Router();
const postctrl =require('./posts.ctrl');

console.log('routes > posts > index');

router.get('/', postctrl.list);
router.post('/', postctrl.write);
router.post('/read/:id', postctrl.read);
router.post('/remove/:id', postctrl.remove);
router.post('/replace/:id', postctrl.replace);
router.post('/update/:id', postctrl.update);

/*
router.get('/', postctrl.list);
router.post('/', postctrl.write);
router.get('/:id', postctrl.read);
router.delete('/:id', postctrl.remove);
router.put('/:id', postctrl.replace);
router.patch('/:id', postctrl.update);
*/

module.exports = router;
