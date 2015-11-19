define([
  'models/model',
  'api'
], function(Model) {
  var menuModel = Model.extend({
    urlRoot: 'menu',
    defaults: {
      __v: 0,
      _id: "",
      name: "",
      image: {
        __v: 0,
        _id: '',
        ext: '',
        height: '',
        name: '',
        src: '',
        width: ''
      },
      products: [{
        __v: 0,
        _id: "",
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
