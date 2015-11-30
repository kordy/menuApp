var User = require(__approot + '/server/ext/db/schema/user');
var jwt = require('jsonwebtoken');
var express = require('express');

module.exports = function (app) {
  app.post('/api/isLogin', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, app.get('secret'), function (err, decoded) {
        if (err) {
          return  res.status(401).json({ tokenValid: false, message: 'Failed to authenticate token.' });
        } else {
          return  res.status(200).json({ tokenValid: true, message: 'success', userInfo: decoded });
        }
      });
    } else {
      return res.status(403).send({
        tokenFail: false,
        message: 'No token provided.'
      });
    }
  });

  app.post('/api/login', function (req, res) {
    var login = req.body.login;
    var password = req.body.password;

    User.findOne({name: login}, function (err, curUser) {

      if (err) console.log(err);

      if (curUser && curUser.checkPassword(password)) {

        var token = jwt.sign(curUser, app.get('secret'), {
          expiresIn: '24h'
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      } else {
        res.json({
          success: false
        });
      }
    });
  });

  var apiRoutes = express.Router();
  apiRoutes.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, app.get('secret'), function (err, decoded) {
        if (err) {
          return res.status(401).json({ tokenFail: true, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        tokenFail: true,
        message: 'No token provided.'
      });
    }
  });
  app.use('/api', apiRoutes);

};