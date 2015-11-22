var db = require('../db');
var crypto = require('crypto');

var UserSchema = db.Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  type: {
    type: String,
    require: true
  },
  hash: {
    type: String,
    require: true
  },
  salt: {
    type: String,
    require: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.virtual('password')
  .set(function(data) {
    this.salt = String(Math.random());
    this.hash = this.getHash(data);
  })
  .get(function() {
    return this.hash;
  });
//var res = getHash(password, salt);

UserSchema.methods.getHash = function(password){
  return crypto.createHmac('sha', this.salt).update(password).digest('hex')
};

UserSchema.methods.checkPassword = function(data){
  return this.getHash(data) === this.hash;
};

var User = db.model('user', UserSchema);

module.exports = User;
