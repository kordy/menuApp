define([
  'models/model',
  'api'
], function(Model) {
  var hotModel = Model.extend({
    defaults: {
      __v: 0,
      _id: '',
      name: '',
      ext: '',
      height: '',
      src: '',
      width: ''
    },
    urlRoot: 'hot',
    initialize: function(params) {

    }
  });

  return hotModel;
});
