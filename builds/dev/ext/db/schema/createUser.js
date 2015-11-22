var User = require('./user');

var admin = new User({
  name: 'admin',
  password: 'pass@word1',
  type: 'admin'
});
admin.save(function(err){
  if (err) console.log('ERROR');
});

var manager = new User({
  name: 'manager',
  password: 'pass@word1',
  type: 'manager'
});
manager.save(function(err){
  if (err) console.log('ERROR');
});