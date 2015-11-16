define([
  'models/model',
  'api'
], function(Model) {
  var menuModel = Model.extend({
    defaults: {
      __v: 0,
      _id: "",
      name: "",
      products: [{
        __v: 0,
        _id: "",
        group: [],
        name: "",
        nameEng: "",
        priceBase: '',
        serving: ''
      }]
    },
    initialize: function(params) {

    }
  });

  return menuModel;
});
