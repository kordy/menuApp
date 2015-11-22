define([
  'models/model',
  'api'
], function(Model) {
  var userModel = Model.extend({
    defaults: {
      __v: 0,
      _id: '',
      name: '',
      type: '',
      password: ''
    },
    urlRoot: 'login',
    initialize: function(params) {

    }
  });

  return userModel;
});