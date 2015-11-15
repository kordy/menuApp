define([
  'models/model',
  'api'
], function(Model) {
  var CardModel = Model.extend({
    fetchUrl: 'products',
    initialize: function(params) {

    }
  });

  return CardModel;
});
