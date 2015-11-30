var Product = require(__approot + '/server/ext/db/schema/product');
var Group = require(__approot + '/server/ext/db/schema/group');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var xlsx = require(__approot + '/server/ext/xlsx');

module.exports = function (app) {
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
      product.remove({}, function (err, removed) {
        res.status(200).send({result: true, removed: removed});
      });
    });
  });

  app.put('/api/product/:id', function (req, res) {
    Product.findOneAndUpdate({_id: req.params.id}, req.body, null, function (err, product) {
      res.status(200).send({result: true, product: product});
    });
  });
}