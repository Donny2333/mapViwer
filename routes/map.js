/**
 * Created by Donny on 17/5/2.
 */
var express = require('express');
var request = require('request');
var router = express.Router();


/* GET map id. */
router.get('/:id', function (req, res, next) {
    res.render('map');
});

module.exports = router;