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
        isGroup: false,
        name: "",
        nameEng: "",
        priceBase: '',
        serving: ''
      }],
      noAdditionalExpenses: false,
      serviceIncrease: '',
      commentAdditionalExpenses: '',
      isEnglish: false,
      isImages: false,
      noPrices: false,
      discount: ''
    },
    initialize: function(params) {

    }
  });

  return menuModel;
});
