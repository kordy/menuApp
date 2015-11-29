'use strict';

global.__approot = __dirname;

var express = require('express');
var app = express();
var path = require('path');
var mime = require('mime');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ejs = require('ejs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var jwt = require('jsonwebtoken');

var bodyParser = require('body-parser');
var fs = require('fs');

var pdf = require('./ext/pdf');
var xlsx = require('./ext/xlsx');
var word = require('./ext/word');

//var db = require('./ext/db/db');

var Menu = require('./ext/db/schema/menu');
var Image = require('./ext/db/schema/image');
var Product = require('./ext/db/schema/product');
var Group = require('./ext/db/schema/group');
var User = require('./ext/db/schema/user');

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('secret', 'FusionMenuApp');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
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

app.use('/static', express.static(__approot + '/static'));

app.get('/', function (req, res) {
  console.log(__approot);
  res.sendfile('index.html');
});

app.post('/api/isLogin', function(req, res) {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('secret'), function(err, decoded) {
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

app.post('/api/login', function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  User.findOne({name: login}, function(err, curUser){

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

app.get('/files/:file', function (req, res) {
  var file = __dirname + '/files/' + req.params.file;
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  if (mimetype !== 'image/jpeg')  {
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  }
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

var apiRoutes = express.Router();

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('secret'), function(err, decoded) {
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

app.post('/api/pdf', function (req, res) {
  var html = pdf.get(req.body);
  res.send(html);
});

app.get('/api/pdfTemplate', function (req, res) {
  var path = __dirname + '/views/pdf.ejs';
  var file = fs.readFileSync(path, "utf8");
  res.send(file);
});

app.post('/api/exportPDF', function (req, res) {
  pdf.create(req.body, function (fileURL) {
    res.send(fileURL);
  });
});

app.post('/api/exportExcel', function (req, res) {
  xlsx.build(req.body, function (fileURL) {
    res.send(fileURL);
  });
});

app.post('/api/exportWord', function (req, res) {
  word.create(req.body, function (fileURL) {
    res.send(fileURL);
  });
});

app.get('/api/groups', function (req, res) {
  Group.find({}, null, {sort: {'code': 1}}, function (err, groups) {
    res.send(groups);
  });
});

/********** P R O D U C T S **********/

app.get('/api/products', function (req, res) {
  Product.fetch(function (err, products) {
    res.send(products);
  });
});

app.post('/api/products', multipartMiddleware, function (req, res) {
  //console.log(req.files);
  if (typeof req.files != 'undefined' && req.files.files[0].name.split('.').pop() === 'xlsx') {
    xlsx.parse(req.files.files, function () {
      Group.find({}, null, {sort: {'code': 1}}, function (err, groups) {
        Product.fetch(function (err, products) {
          res.status(200).send({groups: groups, products: products});
        });
      });
    })
  }
});

app.delete('/api/product/:id', function (req, res) {
  Product.findOne({_id: req.params.id}, function (err, product) {
    product.remove({}, function(err,removed) {
      res.status(200).send({result:true, removed: removed});
    });
  });
});

app.put('/api/product/:id', function (req, res) {
  Product.findOneAndUpdate({_id: req.params.id}, req.body, null, function (err, product) {
    res.status(200).send({result:true, product: product});
  });
});

/********** I M A G E **********/

app.get('/api/images', function (req, res) {
  Image.find({}, function (err, images) {
    res.send(images);
  });
});

app.post('/api/image', multipartMiddleware, function (req, res) {
  if (typeof req.files != 'undefined') {
    var files = req.files.files;
    for (var i in files) {
      var image = new Image();
      image.saveIMG(files[i], function (item) {
        res.send(item);
      });
    }
  }
});

app.delete('/api/image/:id', function (req, res) {
  Image.findOne({_id: req.params.id}, function (err, image) {
    image.remove({}, function(err,removed) {
      res.send({result:true, removed: removed});
    });
  });
});

app.put('/api/image/:id', function (req, res) {
  Image.findOneAndUpdate({_id: req.params.id}, req.body, null, function (err, image) {
    res.send({result:true, image: image});
  });
});

/********** M E N U **********/

app.get('/api/menus', function (req, res) {
  Menu.find({})
    .populate('image')
    .exec(function (err, menus) {
      res.json(menus);
    });
});

app.post('/api/menu', function (req, res) {
  var params = req.body;
  delete params._id;
  if (!params.image._id) delete params.image;
  var menu = new Menu(params);
  menu.save(function (err) {
    if (err) {
      console.log(err);
      res.send({'result': false});
    } else {
      Menu.find({})
        .populate('image')
        .exec(function (err, menus) {
          res.json({menus: menus, currentMenuId: menu._id});
        });
    }
  });
});

app.put('/api/menu/:id', function (req, res) {
  var params = req.body;
  delete params._id;
  if (!params.image._id) delete params.image;
  Menu.findOneAndUpdate({_id: req.params.id}, params, null, function (err, menu) {
    Menu.find({})
      .populate('image')
      .exec(function (err, menus) {
        res.json({menus: menus, currentMenuId: menu._id});
      });
  });
});

app.delete('/api/menu/:id', function (req, res) {
  Menu.findOne({_id: req.params.id}, function (err, menu) {
    menu.remove({}, function(err,menu) {
      Menu.find({})
        .populate('image')
        .exec(function (err, menus) {
          res.json({menus: menus});
        });
    });
  });
});


var server = http.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});