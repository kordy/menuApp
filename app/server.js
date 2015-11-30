'use strict';

global.__approot = __dirname;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var ejs = require('ejs');

var conf = require('config');
var router = require('./server/routes');

var bodyParser = require('body-parser');
var fs = require('fs');

app.set('port', conf.get('port'));
app.set('view engine', 'ejs');
app.set('views', __approot + 'server/views');
app.set('secret', conf.get('secret'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/static', express.static(__approot + conf.get('staticPath')));

//app.use(function (req, res, next) {
//  res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
//  res.header('Access-Control-Allow-Credentials', true);
//  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
//  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
//  next();
//});

process.on('uncaughtException', function (err) {
  console.log(err);
});

router(app);

var server = http.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});