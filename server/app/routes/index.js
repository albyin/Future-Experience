'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/category', require('./category'));
router.use('/product', require('./product'));
router.use('/search', require('./search'));
// router.use('/tutorial', require('./tutorial'));
// router.use('/members', require('./members'));
router.use('/user', require('./user'));
router.use('/order', require('./order'));
router.use('/review', require('./review'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});