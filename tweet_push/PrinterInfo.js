var request = require("request");
var Twitter = require('twit');
var Elasticsearch = require('aws-es');

var client = new Twitter({
    consumer_key:   '1hkOv5wjdTaqxsRM91FGwjkRU',
    consumer_secret: '04VmYHw6z56sSt1Ypm6BbgxweTLiM5ejFxdusWU7AqYYtP8Lf6',
    access_token: '218215924-qk6PxJv342X46C3AwMNFFCI5raOa7coBYCFRXmGo',
    access_token_secret: 'pKQKTqsm37kSFVysuKodhZ7BusEKZ8J9dS7Pv3jKjB4bY'
});
//Pushing tweets into elastic search.
var topics = 'virat,kohli,trump,Man Utd,dhoni,real madrid,usgp' +
    'hillary,clinton,chelsea,ohio,patriots,GOT,cricket,democrats,republicans,mac,gadget,samsung,iphone,sony,mobile,science,'+
    'president,debate,india,The Walking Dead,election,apple,ferrari,Premier League,food,restraunt,lunch,dinner,breakfast,foodie,pizza';

var elasticsearch = new Elasticsearch({
                            accessKeyId:'AKIAJEMRSUOJLIK6SKIA',
                            secretAccessKey:'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',
                            service:'es',
                            region:'us-east-1',
                            host:'search-prathtweets-jqcnx3spdjo3rhy5zjzn4nusv4.us-east-1.es.amazonaws.com'
                        });
console.log(elasticsearch);


var stream = client.stream('statuses/filter', {track: topics}, {locations: ['-180','-90','180','90']});

    stream.on('tweet', function(tweet) {
        if(tweet.geo != null) { // Insert into elastic search when tweet with location is found
            console.log("Tweet: "+tweet.text);

            elasticsearch.index({
            index: 'twitter',
            type: 'tweet',
            body: {
                'username': tweet.user.name,
                    'text': tweet.text,
                    'location': tweet.geo
            }
        }, function(err, data) {
           console.log("Row "+err+"@@@@ "+JSON.stringify(data)+" with location: "+JSON.stringify(tweet.geo.coordinates));
        });
            
        }
    });
    stream.on('error', function(error) {
        throw error;
    });
