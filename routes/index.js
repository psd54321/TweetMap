var express = require('express');
var router = express.Router();
var request = require("request");
var Twitter = require('twit');
var Elasticsearch = require('aws-es');

var client = new Twitter({
    consumer_key: '1hkOv5wjdTaqxsRM91FGwjkRU',
    consumer_secret: '04VmYHw6z56sSt1Ypm6BbgxweTLiM5ejFxdusWU7AqYYtP8Lf6',
    access_token: '218215924-qk6PxJv342X46C3AwMNFFCI5raOa7coBYCFRXmGo',
    access_token_secret: 'pKQKTqsm37kSFVysuKodhZ7BusEKZ8J9dS7Pv3jKjB4bY'
});

/* GET home page */
router.get('/', function (req, res) {
    res.render('index');
});


router.get('/search/:searchq', function (req, res) {
    var elasticsearch = new Elasticsearch({
        accessKeyId: 'Your key',
        secretAccessKey: 'Your key',
        service: 'es',
        region: 'us-east-1',
        host: 'search-prathtweets-jqcnx3spdjo3rhy5zjzn4nusv4.us-east-1.es.amazonaws.com'
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
