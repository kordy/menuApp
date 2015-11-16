define([
  'models/model',
  'api'
], function(Model) {
  var productModel = Model.extend({
    fetchUrl: 'products',
    initialize: function(params) {

    }
  });

  return productModel;
});
