define([
  'models/model',
  'api'
], function(Model) {
  var productModel = Model.extend({
    fetchUrl: 'products',
    urlRoot: 'product',
    initialize: function(params) {

    }
  });

  return productModel;
});
