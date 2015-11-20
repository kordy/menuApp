define([
  'models/model',
  'api'
], function(Model) {
  var menuModel = Model.extend({
    urlRoot: 'menu',
    defaults: {
      __v: 0,
      _id: null,
      name: "",
      image: {
        __v: 0,
        _id: null,
        ext: '',
        height: '',
        name: '',
        src: '',
        width: ''
      },
      items: [{
        __v: 0,
        _id: null,
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
      discount: '',
      noItems: true
    },
    initialize: function(params) {

    }
  });

  return menuModel;
});
