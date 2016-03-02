var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var Subscription = require('./models/subscription');
var request = require('request');
var gcmAPIKey = 'AIzaSyAbpf2LS3le6y-zhZW0UgjWmhaZBc0u6T8';
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';
var https = require('https');
var fs = require('fs');

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(55555);

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/pushSubscriptions');
mongoose.connection.on('error', function (err) {
  console.log('Error connecting to the DB');
  console.log(err);
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  // res.send('Hello World!');
});

app.post('/api/subscriptions', function (req, res) {
  var subscription = new Subscription();
  subscription.subscriptionId = req.body.subscriptionId;
  subscription.save(function(err) {
    if (err) res.send(err);
    res.json({message: 'Subscription created!'});
  });

  console.log(req.body);
});

app.post('/api/notifications', function (req, res) {
  var subscriptionId = req.body.subscriptionId;
  var data = {
    registration_ids: [subscriptionId]
  };
  var options = {
    url: GCM_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + gcmAPIKey
    },
    method: 'POST',
    body: JSON.stringify(data)
  };
  function callback(error, response, body) {
    console.log(error);
    console.log(body);
  }
  request(options, callback);
});

app.get('/subscriptions', function(req, res) {
  Subscription.find(function(err, subscriptions) {
    if (err) res.send(err);
    res.render('subscriptions', {subscriptions: subscriptions});
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
