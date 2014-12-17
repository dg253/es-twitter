var express = require('express'),
  config = require('./config/config'),
CronJob = require('cron').CronJob,
  elasticsearch = require('elasticsearch');
  

var client = new elasticsearch.Client({
                    host: 'localhost:9200',
                    sniffOnStart: true,
                    sniffInterval: 60000,
                    trace: true
                  });

var twitterKey = 'gaKSlWuIjSXY6WQ8L0MHAAEWR',
    twitterSecret = 'NFf37GCnQg2Vt44piBp7rqLCXH5mKEDtV3kVudeXvFqPw9C0xk',
    token = '1526076258-0vZPFBxJti2sqx52aUoeqJJ71YDieyVZXIfq9l9',
    secret = 'xYF2zboeiTQhs3URTOwp2JliozejV4pX0A8dxXlFQd5di';

var OAuth = require('OAuth');
var oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  twitterKey,
  twitterSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);
new CronJob('5 * * * * *', function(){
    console.log('cron job is running...');
    oauth.get('https://api.twitter.com/1.1/statuses/home_timeline.json',
      token,
      secret,
      function (error, data, response){
        if (error) console.error(error);
        json = JSON.parse(data);
        tweets = JSON.stringify(json);

        for(var i = 0; i<json.length; i++)
          {
            var item = json[i];
            client.create({
              index: 'twitter',
              type: 'tweets',
              id: item.id,
              body: item
            }, function (error, response) {
              if(error) {
                console.log(error);
              } else {
                console.log("created index");
              }
            });
          }
    });
}, null, true, "America/New_York");


var app = express();

require('./config/express')(app, config);

app.listen(config.port);
