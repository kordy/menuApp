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
      nameEng: "",
      paddingLeft: 80,
      paddingRight: 80,
      paddingTop: 120,
      paddingBottom: 120,
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
        isDelimiter: false,
        name: "",
        nameEng: "",
        priceServing: '',
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
      noItems: true,
      isTwoColumns: false
    },
    initialize: function(params) {

    }
  });

  return menuModel;
});
