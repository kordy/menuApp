define([
  'models/model',
  'api'
], function(Model) {
  var CardModel = Model.extend({
    defaults: {

    },
    url: 'v1/cards',
    fetchUrl: 'products',
    initialize: function(params) {

    }
  });

  return CardModel;
});
