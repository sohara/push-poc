var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var path = require('path');
var request = require('request');
var Subscription = require('./models/subscription');

var GCP_API_KEY = 'AIzaSyAbpf2LS3le6y-zhZW0UgjWmhaZBc0u6T8';
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';


mongoose.connect('mongodb://localhost/pushSubscriptions');

mongoose.connection.on('error', function (err) {
  console.log('Error connecting to the DB');
  console.log(err);
});


function _createSubscription(body, callback) {
  var subscription = new Subscription();
  subscription.subscriptionId = body.subscriptionId;
  subscription.save(_.partialRight(callback, {message: 'Subscription created!'}));
}


function _createNotification(body, callback) {
  var subscriptionId = body.subscriptionId;

  var data = {
    registration_ids: [subscriptionId]
  };

  var options = {
    url: GCM_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + GCP_API_KEY
    },
    method: 'POST',
    body: JSON.stringify(data)
  };

  request(options, function (error, response, body) {
    console.log(error);
    console.log(body);
    callback(error, response, body);
  });
}


function _getSubscriptions(callback) {
  Subscription.find(callback);
}


exports.start = function () {
  var app = express();

  app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    layoutsDir: path.resolve(__dirname, 'views/layouts')
  }));

  app.set('view engine', 'handlebars');

  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

  app.post('/api/subscriptions', function (req, res) {
    _createSubscription(req.body, function (err, data) {
      if (err) {
        res.send(err);
      };
      res.json(data);
    });
  });

  app.post('/api/notifications', function (req, res) {
    _createNotification(req.body, function (err, response, body) {
      if (err) {
        res.send(err);
      };
      res.send(body); // ???
    });
  });

  app.get('/subscriptions', function(req, res) {
    _getSubscriptions(function(err, subscriptions) {
      if (err) {
        res.send(err);
      }
      res.render('subscriptions', {subscriptions: subscriptions});
    });
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
};


exports.handlers = {
  subscriptions: {
    create: _createSubscription,
    read: _getSubscriptions
  },
  notifications: {
    create: _createNotification
  }
};
