define([
  'models/model',
  'api'
], function(Model) {
  var groupModel = Model.extend({
    defaults: {
      _v: null,
      _id: "",
      code: "",
      name: "",
      children: null,
      childrenView: null
    },
    fetchUrl: 'group',
    initialize: function(params) {

    }
  });

  return groupModel;
});
