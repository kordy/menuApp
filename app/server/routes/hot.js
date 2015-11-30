var Hot = require(__approot + '/server/ext/db/schema/hot');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {

  app.get('/api/hots', function (req, res) {
    Hot.find({}, function (err, images) {
      res.send(images);
    });
  });

  app.post('/api/hot', multipartMiddleware, function (req, res) {
    if (typeof req.files != 'undefined') {
      var files = req.files.files;
      for (var i in files) {
        var hot = new Hot();
        hot.saveIMG(files[i], function (item) {
          res.send(item);
        });
      }
    }
  });

  app.delete('/api/hot/:id', function (req, res) {
    Hot.findOne({_id: req.params.id}, function (err, image) {
      image.remove({}, function(err,removed) {
        res.send({result:true, removed: removed});
      });
    });
  });

  app.put('/api/hot/:id', function (req, res) {
    Hot.findOneAndUpdate({_id: req.params.id}, req.body, null, function (err, image) {
      res.send({result:true, image: image});
    });
  });

};