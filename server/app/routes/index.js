'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/category', require('./category'));
router.use('/product', require('./product'));
router.use('/search', require('./search'));
router.use('/user', require('./user'));
router.use('/order', require('./order'));
router.use('/cart', require('./cart'));
router.use('/review', require('./review'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});