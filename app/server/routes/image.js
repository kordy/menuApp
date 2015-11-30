var Image = require(__approot + '/server/ext/db/schema/image');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
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
      image.remove({}, function (err, removed) {
        res.send({result: true, removed: removed});
      });
    });
  });

  app.put('/api/image/:id', function (req, res) {
    Image.findOneAndUpdate({_id: req.params.id}, req.body, null, function (err, image) {
      res.send({result: true, image: image});
    });
  });
};