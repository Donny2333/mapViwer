/**
 * Created by Donny on 17/5/2.
 */
var express = require('express');
var router = express.Router();

/* GET map id. */
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    res.cookie('ID', id, {maxAge: 60 * 1000});
    res.render('map');
});

module.exports = router;