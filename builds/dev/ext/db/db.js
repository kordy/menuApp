
var db = require('mongoose');
var DB_USER = 'menu';
var DB_PASSWORD= 'menu1';
var DB_HOST = 'ds031893.mongolab.com:31893';
var DB_NAME = 'menu';
var dbSRC = "mongodb://"+DB_USER+":"+DB_PASSWORD+"@"+DB_HOST+"/"+DB_NAME;

db.connect(dbSRC,function(err){});

module.exports = db;

