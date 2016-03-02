var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  // res.send('Hello World!');
});

app.post('/api/subscriptions', function (req, res) {
  console.log(req.body);
});

app.get('/subscriptions', function(req, res) {
  var data = [
    {subscriptionId: '2342332432'}
  ];
  res.render('subscriptions', {subscriptions: data});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
