/**
 * Created by Donny on 17/5/2.
 */
var express = require('express');
var request = require('request');
var router = express.Router();


/* GET map id. */
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    var url = '';
    request.post({
        url: 'http://192.168.99.105:9527/MapService.svc/GetMapDocList',
        body: JSON.stringify({
            docID: id,
            pageNo: 0,
            pageNum: 10
        })
    }, function (request, response) {
        var data = JSON.parse(response.body);
        if (data.result && data.result.length) {
            url = data.result[0].MapServerPath;
        }
        res.render('map', {URL: url});
    });
});

module.exports = router;