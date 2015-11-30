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
app.use('/files/hots', express.static(__approot + '/files/hots'));

process.on('uncaughtException', function (err) {
  console.log(err);
});

router(app);

var server = http.listen(app.get('port'), function () {
  console.log(conf.get('app') + ' listening at http://%s:%s', conf.get('domain'), conf.get('port'));
});