
var db = require('mongoose');
var conf = require('config');

var DB_HOST = conf.get('db.host');
var DB_NAME = conf.get('db.name');
var DB_USER = conf.get('db.user');
var DB_PASSWORD = conf.get('db.password');

var dbSRC = "mongodb://"+DB_USER+":"+DB_PASSWORD+"@"+DB_HOST+"/"+DB_NAME;
db.connect(dbSRC,function(err){});

module.exports = db;

