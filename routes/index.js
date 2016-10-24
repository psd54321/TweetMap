var express = require('express');
var router = express.Router();
var request = require("request");
var Twitter = require('twit');
var Elasticsearch = require('aws-es');

/* GET home page */
router.get('/', function (req, res) {
    res.render('index');
});


router.get('/search/:searchq', function (req, res) {
    var elasticsearch = new Elasticsearch({
        accessKeyId: 'AKIAJEMRSUOJLIK6SKIA',
        secretAccessKey: '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',
        service: 'es',
        region: 'us-east-1',
        host: 'search-prathtweets-jqcnx3spdjo3rhy5zjzn4nusv4.us-east-1.es.amazonaws.com'
    });

    elasticsearch.search({
        index: 'twitter',
        type: 'tweet',
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
