var express = require('express');
var router = express.Router();
var request = require("request");
var Twitter = require('twit');
var Elasticsearch = require('aws-es');

var client = new Twitter({
    consumer_key: 'Your key',
    consumer_secret: 'Your key secret',
    access_token: 'Your access token',
    access_token_secret: 'Your token secret'
});

/* GET home page */
router.get('/', function (req, res) {
    res.render('index');
});


router.get('/search/:searchq', function (req, res) {
    var elasticsearch = new Elasticsearch({
        accessKeyId: 'Your access key id',
        secretAccessKey: 'Your access key secret',
        service: 'es',
        region: 'us-east-1',
        host: 'Your host'
    });

    elasticsearch.search({
        index: 'twitter',
        type: 'tweet',
        size: 150,
        body: {
            query: {
                term: {
                    text: req.params.searchq
                }
            }
        }
    }, function (err, data) {
        res.json(data);
    });

});


module.exports = router;
