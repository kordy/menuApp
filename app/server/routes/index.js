var mainRoutes = require('./main');
var loginRoutes = require('./login');
var fileRoutes = require('./files');
var menuRoutes = require('./menu');
var imageRoutes = require('./image');
var productRoutes = require('./product');
var groupRoutes = require('./group');
var exportRoutes = require('./export');

module.exports = function (app) {
  mainRoutes(app);
  loginRoutes(app);
  fileRoutes(app);
  exportRoutes(app);
  groupRoutes(app);
  productRoutes(app);
  imageRoutes(app);
  menuRoutes(app);
};