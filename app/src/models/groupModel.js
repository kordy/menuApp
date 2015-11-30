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
      nameEng: "",
      children: null,
      childrenView: null
    },
    fetchUrl: 'group',
    initialize: function(params) {

    }
  });

  return groupModel;
});
