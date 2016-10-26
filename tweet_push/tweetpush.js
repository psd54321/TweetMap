var request = require("request");
var Twitter = require('twit');
var Elasticsearch = require('aws-es');

var client = new Twitter({
    consumer_key:   'Your key',
    consumer_secret: 'Your secret',
    access_token: 'Your aceess token',
    access_token_secret: 'Your token secret'
});
//Pushing tweets into elastic search.
var topics = 'virat,kohli,trump,Man Utd,dhoni,real madrid,usgp' +
    'hillary,clinton,chelsea,ohio,patriots,GOT,cricket,democrats,republicans,mac,gadget,samsung,iphone,sony,mobile,science,'+
    'president,debate,india,The Walking Dead,election,apple,ferrari,Premier League,food,restraunt,lunch,dinner,breakfast,foodie,pizza';

var elasticsearch = new Elasticsearch({
                            accessKeyId:'Your access key',
                            secretAccessKey:'Your secret',
                            service:'es',
                            region:'us-east-1',
                            host:'Your host'
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
