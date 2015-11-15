define([
  'models/model',
  'api'
], function(Model) {
  var blankModel = Model.extend({
    defaults: {
      __v: 0,
      _id: '',
      ext: '',
      height: '',
      name: '',
      src: '',
      width: ''
    },
    urlRoot: 'image',
    initialize: function(params) {

    }
  });

  return blankModel;
});
