var bodyParser = require('body-parser');
var express = require('express');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var path = require('path');
var handlers = require('./handlers');


mongoose.connect('mongodb://localhost/pushSubscriptions');

mongoose.connection.on('error', function (err) {
  console.log('Error connecting to the DB');
  console.log(err);
});


exports.start = function () {
  var app = express();

  var BASE_DIR = path.resolve(__dirname, '../');
  var PUBLIC_DIR = path.join(BASE_DIR, 'public');
  var VIEWS_DIR = path.join(BASE_DIR, 'views');

  app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(VIEWS_DIR, 'layouts')
  }));

  app.set('view engine', 'handlebars');
  app.set('views', VIEWS_DIR);

  app.use(express.static(PUBLIC_DIR));
  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.sendFile(PUBLIC_DIR + '/index.html');
  });

  app.post('/api/subscriptions', function (req, res) {
    handlers.subscriptions.create(req.body, function (err, data) {
      if (err) {
        res.send(err);
      };
      res.json(data);
    });
  });

  app.post('/api/notifications', function (req, res) {
    handlers.notifications.create(req.body, function (err, response, body) {
      if (err) {
        res.send(err);
      };
      res.send(body); // ???
    });
  });

  app.get('/subscriptions', function(req, res) {
    handlers.subscriptions.read(function (err, data) {
      if (err) {
        res.send(err);
      }
      res.render('subscriptions', {subscriptions: data});
    });
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
};
