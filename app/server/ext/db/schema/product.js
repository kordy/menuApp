var db = require('../db');

var ProductSchema = db.Schema({
  name: String,
  nameEng: String,
  serving: Number,
  measure: {
    type: String,
    default: 'гр'
  },
  priceBase: Number,
  coefficient: Number,
  image: String,
  group: [{type: db.Schema.Types.ObjectId, ref: 'group'}]
});

var Product = db.model('product', ProductSchema);

var sortByGroup = function (a, b) {
  var lastA = a.group.length - 1;
  var lastB = b.group.length - 1;

  if (a.group[lastA].code < b.group[lastB].code)
    return -1;
  if (a.group[lastA].code > b.group[lastB].code)
    return 1;
  if (a.group[lastA].code === b.group[lastB].code) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
  }
  return 0
};

Product.fetch = function (callback) {
  Product.find()
    .populate('group', null, null, {sort: {'code': 1}})
    .sort('group.code')
    .exec(function (err, products) {
      products.sort(sortByGroup);
      if (typeof callback === 'function')callback(err, products);
    });
};

Product.prototype.updateById = function (callback) {
  var that = this;
  Product.update({_id: that._id}, that, false, function (err) {
    if (err) console.log(err);
    if (typeof callback === 'function')callback();
  })
};

Product.prototype.deleteById = function (callback) {
  var that = this;
  Product.findOne({_id: that._id}, function (err, product) {
    if (err) throw err;
    product.remove(callback);
  });
};

Product.prototype.replace = function (callback) {
  var that = this;
  if (that._id && that.isDelete) {
    that.deleteById(callback);
    return;
  }
  if (that._id) {
    Product.findOne({_id: that._id}, function (err, product) {
      if (product) {
        that._id = product._id;
        that.__v = product.__v;
        that.updateById(callback);
      } else {
        Product.findOne({name: that.name}, function (err, product) {
          if (product) {
            that._id = product._id;
            that.__v = product.__v;
            that.updateById(callback);
          } else {
            that.save(function (err) {
              if (err) console.log(err);
              if (typeof callback === 'function')callback();
            });
          }
        });
      }
    })
  }
};

module.exports = Product;