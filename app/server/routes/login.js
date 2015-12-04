var User = require(__approot + '/server/ext/db/schema/user');
var express = require('express');
var passport = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

module.exports = function (app) {

  app.use(require('cookie-parser')());
  app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ name: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done({message: 'Неверный логин'}); }
        if (!user.checkPassword(password)) { return done({message: 'Неверный пароль'}); }
        return done(null, user, { message: 'Авторизация прошла успешно' });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  app.post('/api/logout', function(req, res) {
    req.logout();
    res.status(200).send('ok');
  });

  app.post('/api/isLogin', function (req, res) {
    if (req.isAuthenticated()) {
      res.status(200).send({
        userInfo: req.user,
        message: 'Вы авторизованы'
      });
    } else {
      return res.status(403).send({
        message: 'Требуется аутентификация'
      });
    }
  });

  app.post('/api/login', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          res.status(401).json(err);
          return;
        }
        if (user) {
          req.logIn(user, function(err) {
            return err
              ? res.status(500).json(err)
              : res.status(200).json(info);
          });
        }
      })(req, res, next)
  });

  var apiRoutes = express.Router();
  apiRoutes.use(function (req, res, next) {
    if (req.isAuthenticated()) {
      req.decoded = req.user;
      req.decodedUser = req.user;
      next();
    } else {
      return res.status(403).send({
        message: 'Требуется аутентификация'
      });
    }
  });
  app.use('/api', apiRoutes);

};